import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ProgressBarAndroid,
  Animated,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { fetchQuestions } from "@/API/Quizz/quizzAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeResult } from "@/API/Quizz/quizzResultAPI";
import { Result } from "@/constants/Quizz/result";
import { updateProcessContent } from "@/API/process/procesAPI";

export default function QuizzScreen() {
  const navigation = useNavigation();
  const [scaleValue] = useState(new Animated.Value(1));
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userSelections, setUserSelections] = useState<(string | null)[]>([]);
  const [_IdQuestion, set_IdQuestion] = useState<any>();
  const totalQuestions = questions.length;
  const progress =
    totalQuestions > 0 ? (currentQuestionIndex + 1) / totalQuestions : 0;

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const token = `Bearer ${await AsyncStorage.getItem("token")}`;
        const storedItem = await AsyncStorage.getItem("@selectedItem");
        const parsedItem = storedItem ? JSON.parse(storedItem) : null;

        if (
          parsedItem &&
          parsedItem.contentRef._id &&
          typeof parsedItem.contentRef._id === "string"
        ) {
          const contentRef = parsedItem.contentRef._id;
          set_IdQuestion(parsedItem._id);
          const fetchedQuestions = await fetchQuestions(token, contentRef);

          if (fetchedQuestions && fetchedQuestions.length > 0) {
            const questionsWithAnswers = fetchedQuestions.map((question) => ({
              ...question,
              correctAnswer: question.options[question.answer],
            }));
            setQuestions(questionsWithAnswers);
            setUserSelections(
              new Array(questionsWithAnswers.length).fill(null)
            );
          } else {
            setError("No questions found for this quiz");
          }
        } else {
          setError("ContentRef not found or invalid");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const handleAnswerSelect = (option: string) => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const updatedSelections = [...userSelections];
    updatedSelections[currentQuestionIndex] = option;
    setUserSelections(updatedSelections);
  };

  const handleSubmit = async () => {
    Alert.alert(
      "Confirm submission",
      "Are you sure you want to submit?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Nộp",
          onPress: async () => {
            await saveResults();
            router.push("/(routes)/quizz/quizzSuccess");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const saveResults = async () => {
    console.log("saveResults called");
    const userString = await AsyncStorage.getItem("user");
    let user;
    if (userString) {
      user = JSON.parse(userString);
    }
    const courseId = await AsyncStorage.getItem("course_id");
    const progressId = user.email + "_" + courseId;
    // Tính điểm
    const score = userSelections.reduce((acc, selection, index) => {
      if (selection === questions[index].correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const resultData: Result = {
      quizId: questions[0]._id,
      result: userSelections.map((selection, index) => ({
        question: questions[index].question,
        options: questions[index].options,
        selectedAnswer: selection,
        correctAnswer: questions[index].correctAnswer,
      })),
      attempts: 1,
      points: score,
      achieved: `${score}/${questions.length}`,
      createdAt: new Date().toISOString(),
      selectedItemId: null,
      _id: "",
    };
    try {
      const storedItem = await AsyncStorage.getItem("@selectedItem");
      const parsedItem = storedItem ? JSON.parse(storedItem) : null;

      if (parsedItem && parsedItem.contentRef && parsedItem.contentRef._id) {
        resultData.selectedItemId = parsedItem.contentRef._id;
      }

      await AsyncStorage.setItem(
        "quizResults",
        JSON.stringify({ score, total: questions.length })
      );

      const token = await AsyncStorage.getItem("token");
      if (token) {
        console.log("check resultData: " + JSON.stringify(resultData, null, 2));
        const response = await storeResult(token, resultData);
        if (response) {
          if (score / questions.length >= 0.8) {
            await updateProcessContent(
              progressId,
              _IdQuestion,
              true,
              `Bearer ${token}`
            );
          }
        }
        return response;
      } else {
        console.error("Token is null");
      }
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Quiz</Text>
      </View>

      <ProgressBarAndroid
        styleAttr="Horizontal"
        color="#2980f1"
        indeterminate={false}
        progress={progress}
      />

      <View style={styles.content}>
        {questions[currentQuestionIndex] && (
          <View
            key={questions[currentQuestionIndex]._id}
            style={styles.questionCard}
          >
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex].question}
            </Text>

            {questions[currentQuestionIndex].options.map(
              (option: string, optionIndex: number) => (
                <TouchableOpacity
                  key={optionIndex}
                  onPress={() => handleAnswerSelect(option)}
                >
                  <Animated.View
                    style={[
                      styles.option,
                      { transform: [{ scale: scaleValue }] },
                      userSelections[currentQuestionIndex] === option
                        ? styles.selectedOption
                        : null,
                    ]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </Animated.View>
                </TouchableOpacity>
              )
            )}
          </View>
        )}

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            disabled={currentQuestionIndex === 0}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              }
            }}
            style={styles.nextButton}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 24,
    color: "#0fbcf9",
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderColor: "#2980f1",
    borderWidth: 1,
    shadowColor: "#2980f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  option: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#1b75ec",
    shadowColor: "#1b75ec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
  },
  selectedOption: {
    backgroundColor: "#1b75ec",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#1b75ec",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#1b75ec",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  submitButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    backgroundColor: "#2980f1",
    borderRadius: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "red",
  },
});
