import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchExamByCourseId, submitExam } from "@/API/Exams/examAPI";
import { Exam } from "@/constants/Exams/exam";
import { FontAwesome5 } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

export default function ExamScreen() {
  const navigation = useNavigation();
  const [examData, setExamData] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scaleValue] = useState(new Animated.Value(1));
  const [userSelections, setUserSelections] = useState<(number | null)[]>([]);
  const totalQuestions = examData?.questions.length || 0;
  const progress =
    totalQuestions > 0 ? (currentQuestionIndex + 1) / totalQuestions : 0;

  useEffect(() => {
    const fetchExamData = async () => {
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;
      const courseId = await AsyncStorage.getItem("courseIdGotoContent");

      if (courseId) {
        const exam = await fetchExamByCourseId(token, courseId);
        setExamData(exam);
        // Store examId in AsyncStorage
        if (exam?._id) {
          await AsyncStorage.setItem("examId", exam._id);
        }
        setUserSelections(new Array(exam.questions.length).fill(null));
      }
    };

    fetchExamData();
  }, []);

  useEffect(() => {
    const fetchExamData = async () => {
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;
      const courseId = await AsyncStorage.getItem("courseIdGotoContent");

      if (courseId) {
        const exam = await fetchExamByCourseId(token, courseId);
        setExamData(exam);
        // Store examId in AsyncStorage
        if (exam?._id) {
          await AsyncStorage.setItem("examId", exam._id);
        }
        setUserSelections(new Array(exam.questions.length).fill(null));
      }
    };

    fetchExamData();
  }, []);

  if (!examData) {
    return <Text style={styles.loadingText}>Loading exam data...</Text>;
  }

  const handleAnswerSelect = (optionIndex: number) => {
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
    updatedSelections[currentQuestionIndex] = optionIndex;
    setUserSelections(updatedSelections);
  };

  const handleExamSubmit = async () => {
    Alert.alert("Confirm submission", "Are you sure you want to submit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Submit",
        onPress: async () => {
          try {
            const token = `Bearer ${await AsyncStorage.getItem("token")}`;
            const courseId = await AsyncStorage.getItem("courseIdGotoContent");
            const userEmail = JSON.parse(
              (await AsyncStorage.getItem("user")) || "{}"
            ).email;
            const examId = await AsyncStorage.getItem("examId"); // Retrieve examId here
            if (!userEmail || !examId) {
              throw new Error("User email or exam ID is missing.");
            }

            const answers = userSelections.map((selection) => selection ?? -1);
            if (courseId) {
              await submitExam(token, courseId, examId, userEmail, answers);
            }

            router.push("/(routes)/exams/examSuccess");
          } catch {
            Alert.alert("Submission Failed");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Exam</Text>
      </View>

      <ProgressBarAndroid
        styleAttr="Horizontal"
        color="#2980f1"
        indeterminate={false}
        progress={progress}
      />

      <View style={styles.content}>
        {examData.questions[currentQuestionIndex] && (
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              {examData.questions[currentQuestionIndex].question}
            </Text>

            {examData.questions[currentQuestionIndex].options.map(
              (option, optionIndex) => (
                <TouchableOpacity
                  key={optionIndex}
                  onPress={() => handleAnswerSelect(optionIndex)}
                >
                  <Animated.View
                    style={[
                      styles.option,
                      { transform: [{ scale: scaleValue }] },
                      userSelections[currentQuestionIndex] === optionIndex
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
            onPress={() =>
              setCurrentQuestionIndex(Math.max(currentQuestionIndex - 1, 0))
            }
            style={styles.backButton}
            disabled={currentQuestionIndex === 0}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setCurrentQuestionIndex(
                Math.min(currentQuestionIndex + 1, totalQuestions - 1)
              )
            }
            style={styles.nextButton}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleExamSubmit}
        >
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
    marginTop: 20,
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
    paddingLeft: 20,
    paddingRight: 20,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
});
