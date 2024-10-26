import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getExamResultByUser,
  fetchExamByCourseId,
  hasUserAttemptedExamAPI,
} from "@/API/Exams/examAPI";
import { ExamResults } from "@/constants/Exams/examResults";
import { Exam, Question } from "@/constants/Exams/exam";
import { useRouter } from "expo-router";


export default function ExamResultScreen() {
  const router = useRouter();
  const [examData, setExamData] = useState<ExamResults | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);

  useEffect(() => {
    const fetchExamData = async () => {
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;
      const courseId = await AsyncStorage.getItem("courseIdGotoContent");
      const examId = await AsyncStorage.getItem("examId");
      const userEmail = JSON.parse(
        (await AsyncStorage.getItem("user")) || "{}"
      ).email;

      if (courseId && examId) {
        const attempted = await hasUserAttemptedExamAPI(
          token,
          examId,
          userEmail
        );
        setHasAttempted(attempted);

        if (attempted) {
          const examResults: ExamResults = await getExamResultByUser(
            token,
            courseId,
            userEmail
          );
          setExamData(examResults);

          const exam: Exam = await fetchExamByCourseId(token, courseId);
          setExamQuestions(exam.questions);
        }
      }
    };

    fetchExamData();
  }, []);

  if (!hasAttempted) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.frameContainer}>
          <Text style={styles.instructionText}>
           Click the button below to start!
          </Text>
          <TouchableOpacity
            style={styles.startExamButton}
            onPress={() => {
              router.push({ pathname: "/(routes)/exams" });
            }}
          >
            <Text style={styles.startExamButtonText}>Start Exam</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  

  if (!examData || examQuestions.length === 0) {
    return <Text>Loading exam results...</Text>;
  }

  const hasPassed = examData.score > 80;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Score: {examData.score}%</Text>
      <Text
        style={[styles.statusText, hasPassed ? styles.passed : styles.failed]}
      >
        Status: {hasPassed ? "Passed" : "Failed"} {"\n"}
        {hasPassed
          ? "Congratulations!!!"
          : "You need a score greater than 80% to pass."}
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {examQuestions.map((question, index) => {
          const userAnswer = examData.answers.find(
            (ans) => ans.questionId === question._id
          );

          return (
            <View key={question._id} style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {index + 1}. {question.question}
              </Text>
              {question.options.map((option, optionIndex) => {
                const isSelected = userAnswer?.selectedAnswer === optionIndex;
                const isCorrectAnswer = question.answer === optionIndex;
                const optionStyle = isSelected
                  ? isCorrectAnswer
                    ? styles.correctOption
                    : styles.incorrectOption
                  : isCorrectAnswer
                  ? styles.correctAnswer
                  : styles.option;

                return (
                  <View
                    key={optionIndex}
                    style={[styles.optionContainer, optionStyle]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.backButtonRed}
        onPress={() => router.push({ pathname: "/(routes)/exams" })}
      >
        <Text style={styles.backButtonText}>Try again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.push({ pathname: "/(routes)/content/content-list" })
        }
      >
        <Text style={styles.backButtonText}>Go Back to Course List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    padding: 10,
    borderRadius: 5,
  },
  passed: {
    color: "#2ECC71", // Green color for Passed
    backgroundColor: "#DFF0D8", // Light green background
  },
  failed: {
    color: "#E74C3C", // Red color for Failed
    backgroundColor: "#FADBD8", // Light red background
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // To make room for the fixed buttons at the bottom
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  optionContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  correctOption: {
    backgroundColor: "#D0E8FF", // Light blue background for correct answers
    borderColor: "#2980F1", // Blue border for correct answers
    borderWidth: 1,
  },
  correctAnswer: {
    backgroundColor: "#D0E8FF", // Light blue background for correct answer even if not selected
  },
  incorrectOption: {
    backgroundColor: "#FADBD8", // Light red background for incorrect answers
    borderColor: "#E74C3C", // Red border for incorrect answers
    borderWidth: 1,
  },
  option: {
    backgroundColor: "#EFEFEF", // Default background for unselected options
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#2980F1",
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonRed: {
    marginTop: -10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  instructionText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  frameContainer: {
    borderWidth: 2, // Border width
    borderColor: "#2980F1", // Border color
    borderRadius: 10, // Rounded corners
    padding: 20, // Padding inside the frame
    backgroundColor: "#FFFFFF", // Background color
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 5, // Elevation for Android
    alignItems: "center", // Center content
  },
  startExamButton: {
    paddingVertical: 15, // Increase vertical padding for height
    paddingHorizontal: 100, // Increase horizontal padding for width
    backgroundColor: "#2980F1",
    borderRadius: 0,
    alignItems: "center",
    minWidth: 400, // Set a minimum width for the button
  },
  startExamButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
