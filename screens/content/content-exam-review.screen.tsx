import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Exam } from "@/constants/Content/contentList";

// Define your ReviewParams interface
interface ReviewParams {
  selectedAnswers: string;
  score: number;
  exam: Exam; // Assuming exam is of type Exam
}

export default function ContentExamReviewScreen() {
  const router = useRouter();
  const { selectedAnswers, score, exam } = useLocalSearchParams() as Partial<ReviewParams>; 
  // Use Partial<ReviewParams> to avoid strict type checking on potentially missing params

  const parsedAnswers = selectedAnswers ? JSON.parse(selectedAnswers) : []; // Safely parse

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.reviewContainer}>
        <Text style={styles.scoreText}>
          Your Score: {score}/{exam?.content.length}
        </Text>

        {exam?.content.map((question, index) => {
          const userAnswerId = parsedAnswers[index];
          const correctAnswerId = question.answers.find((answer) => answer.isCorrect)?._id;

          return (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {index + 1}. {question.questionText}
              </Text>

              {question.answers.map((option) => {
                const isUserAnswer = option._id === userAnswerId;
                const isCorrectAnswer = option._id === correctAnswerId;

                return (
                  <View
                    key={option._id}
                    style={[
                      styles.optionContainer,
                      isCorrectAnswer && styles.correctOption,
                      isUserAnswer && !isCorrectAnswer && styles.wrongOption,
                    ]}
                  >
                    <Ionicons
                      name={
                        isUserAnswer
                          ? isCorrectAnswer
                            ? "checkmark-circle"
                            : "close-circle"
                          : "ellipse-outline"
                      }
                      size={24}
                      color={
                        isUserAnswer
                          ? isCorrectAnswer
                            ? "green"
                            : "red"
                          : "#333"
                      }
                    />
                    <Text style={styles.optionText}>{option.answerText}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(routes)/content/content-list")}
        >
          <Text style={styles.backButtonText}>Back to Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  reviewContainer: {
    padding: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 25,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
  },
  correctOption: {
    backgroundColor: "#d4edda",
  },
  wrongOption: {
    backgroundColor: "#f8d7da",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#2A6C64",
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  backButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
