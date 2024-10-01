import React, { useEffect, useState} from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Content, Exam } from "@/constants/Content/contentList";
import { useRouter } from "expo-router";

export default function ContentExamScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [item, setItem] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const router = useRouter();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const storedItem = await AsyncStorage.getItem('@selectedItem');
        if (storedItem) {
          setItem(JSON.parse(storedItem));
        }
      } catch (e) {
        console.error("Error fetching exam", e);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, []);

  // Countdown logic
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup timer on unmount
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const handleAnswerSelection = (index: number) => {
    if (isReviewMode) return; // Prevent selection in review mode
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(updatedAnswers);
    setSelectedAnswerIndex(index);
  };

  const handleNextQuestion = () => {
    if (item?.contentType === "exams") {
      const exam = item.contentRef as Exam;
      if (currentQuestionIndex < exam.content.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswerIndex(selectedAnswers[currentQuestionIndex + 1] || null);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswerIndex(selectedAnswers[currentQuestionIndex - 1] || null);
    }
  };

  const handleSubmit = () => {
    let tempScore = 0;
    const exam = item?.contentRef as Exam;

    exam?.content.forEach((question, index) => {
      if (selectedAnswers[index] !== undefined && selectedAnswers[index] !== null) {
        if (question.answers[selectedAnswers[index]].isCorrect) {
          tempScore += 1;
        }
      }
    });

    setScore(tempScore);
    setIsSubmitted(true);
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedAnswerIndex(selectedAnswers[index] || null);
  };

  const handleRestart = () => {
    // Reset the quiz
    setIsSubmitted(false);
    setIsReviewMode(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setTimeLeft(30 * 60); // Reset timer to 30 minutes
    setSelectedAnswerIndex(null);
  };

  const handleReview = () => {
    const serializedAnswers = JSON.stringify(selectedAnswers);
    router.push({
      pathname: "/(routes)/content/content-exam.review",
      params: {
        selectedAnswers: serializedAnswers,
        score: score.toString(),
        examId: item?.contentRef._id, // Passing the exam reference to the review screen
      },
    });
  };
  

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2467EC" />
        <Text style={styles.loadingText}>Loading Exam...</Text>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>No Exam Content Available</Text>
      </SafeAreaView>
    );
  }

  if (item.contentType === "exams") {
    const exam = item.contentRef as Exam;
    const currentQuestion = exam.content[currentQuestionIndex];

    return (
      <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {!isSubmitted ? (
            <>
              <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>
              <Text style={styles.questionText}>
                {currentQuestionIndex + 1}. {currentQuestion.questionText}
              </Text>
              <View style={styles.answersContainer}>
                {currentQuestion.answers.map((answer, index) => (
                  <TouchableOpacity
                    key={answer._id}
                    style={[
                      styles.optionButton,
                      selectedAnswerIndex === index && styles.selectedOption,
                    ]}
                    onPress={() => handleAnswerSelection(index)}
                  >
                    <View style={styles.radioContainer}>
                      <Ionicons
                        name={
                          selectedAnswerIndex === index
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={24}
                        color={selectedAnswerIndex === index ? "#2467EC" : "#A1A1A1"}
                      />
                      <Text style={styles.optionText}>{answer.answerText}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.navigationContainer}>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.navButton}
                  onPress={handleNextQuestion}
                  disabled={currentQuestionIndex === exam.content.length - 1}
                >
                  <Text style={styles.navButtonText}>Next</Text>
                </TouchableOpacity>
              </View>

              {/* Navigation bar for selecting questions */}
              <View style={styles.questionNavContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {exam.content.map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.questionNavButton,
                        currentQuestionIndex === index && styles.activeNavButton,
                      ]}
                      onPress={() => handleQuestionSelect(index)}
                    >
                      <Text style={styles.navButtonText}>{index + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Your Score: {score}/{exam.content.length}
              </Text>

              {/* Review and Restart buttons */}
              <View style={styles.resultButtonContainer}>
                <TouchableOpacity style={styles.reviewButton} onPress={handleReview}>
                  <Text style={styles.navButtonText}>Review Answers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                  <Text style={styles.navButtonText}>Restart Quiz</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Display answers in review mode */}
          {isReviewMode && (
            <Text style={styles.reviewText}>You are now in Review Mode. You can not change answers.</Text>
          )}
        </ScrollView>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#575757",
  },
  errorText: {
    fontSize: 18,
    color: "#E74C3C",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E74C3C",
    textAlign: "center",
    marginBottom: 10,
  },
  answersContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    backgroundColor: "white",
  },
  selectedOption: {
    backgroundColor: "#CFE8DB",
    borderColor: "#2467EC",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#575757",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  navButton: {
    backgroundColor: "#2A6C64",
    padding: 15,
    borderRadius: 8,
    width: "45%",
  },
  navButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#2A6C64",
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#575757",
  },
  resultButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  reviewButton: {
    backgroundColor: "#2467EC",
    padding: 15,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  restartButton: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  reviewText: {
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
    color: "#333",
    marginTop: 20,
  },
  questionNavContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  questionNavButton: {
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#E5E5E5",
  },
  activeNavButton: {
    backgroundColor: "#2A6C64",
  },
});
