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

// Sample quiz questions (you may want to import this from a common file if necessary)
const quizQuestions = [
  {
    question: "What is the capital of France?",
    options: [
      { id: 1, text: "Paris" },
      { id: 2, text: "London" },
      { id: 3, text: "Berlin" },
      { id: 4, text: "Madrid" },
    ],
    correctAnswerId: 1,
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: [
      { id: 1, text: "Charles Dickens" },
      { id: 2, text: "Leo Tolstoy" },
      { id: 3, text: "William Shakespeare" },
      { id: 4, text: "J.K. Rowling" },
    ],
    correctAnswerId: 3,
  },
  {
    question: "What is the smallest prime number?",
    options: [
      { id: 1, text: "1" },
      { id: 2, text: "2" },
      { id: 3, text: "3" },
      { id: 4, text: "5" },
    ],
    correctAnswerId: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: [
      { id: 1, text: "Earth" },
      { id: 2, text: "Mars" },
      { id: 3, text: "Jupiter" },
      { id: 4, text: "Saturn" },
    ],
    correctAnswerId: 2,
  },
  {
    question: "What is the chemical symbol for water?",
    options: [
      { id: 1, text: "O2" },
      { id: 2, text: "H2O" },
      { id: 3, text: "CO2" },
      { id: 4, text: "N2" },
    ],
    correctAnswerId: 2,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      { id: 1, text: "Vincent van Gogh" },
      { id: 2, text: "Pablo Picasso" },
      { id: 3, text: "Leonardo da Vinci" },
      { id: 4, text: "Claude Monet" },
    ],
    correctAnswerId: 3,
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    options: [
      { id: 1, text: "Oxygen" },
      { id: 2, text: "Carbon Dioxide" },
      { id: 3, text: "Nitrogen" },
      { id: 4, text: "Hydrogen" },
    ],
    correctAnswerId: 2,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: [
      { id: 1, text: "Atlantic Ocean" },
      { id: 2, text: "Indian Ocean" },
      { id: 3, text: "Pacific Ocean" },
      { id: 4, text: "Southern Ocean" },
    ],
    correctAnswerId: 3,
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: [
      { id: 1, text: "China" },
      { id: 2, text: "Japan" },
      { id: 3, text: "South Korea" },
      { id: 4, text: "Thailand" },
    ],
    correctAnswerId: 2,
  },
  {
    question: "How many continents are there on Earth?",
    options: [
      { id: 1, text: "5" },
      { id: 2, text: "6" },
      { id: 3, text: "7" },
      { id: 4, text: "8" },
    ],
    correctAnswerId: 3,
  },
  {
    question: "What is the main language spoken in Brazil?",
    options: [
      { id: 1, text: "Spanish" },
      { id: 2, text: "Portuguese" },
      { id: 3, text: "French" },
      { id: 4, text: "English" },
    ],
    correctAnswerId: 2,
  },
  {
    question: "Which element has the atomic number 1?",
    options: [
      { id: 1, text: "Helium" },
      { id: 2, text: "Oxygen" },
      { id: 3, text: "Hydrogen" },
      { id: 4, text: "Carbon" },
    ],
    correctAnswerId: 3,
  },
  {
    question: "In which year did the Titanic sink?",
    options: [
      { id: 1, text: "1912" },
      { id: 2, text: "1905" },
      { id: 3, text: "1918" },
      { id: 4, text: "1923" },
    ],
    correctAnswerId: 1,
  },
  {
    question: "Which country hosted the 2016 Summer Olympics?",
    options: [
      { id: 1, text: "China" },
      { id: 2, text: "Brazil" },
      { id: 3, text: "Japan" },
      { id: 4, text: "Russia" },
    ],
    correctAnswerId: 2,
  },
  {
    question: "Who discovered penicillin?",
    options: [
      { id: 1, text: "Marie Curie" },
      { id: 2, text: "Alexander Fleming" },
      { id: 3, text: "Louis Pasteur" },
      { id: 4, text: "Isaac Newton" },
    ],
    correctAnswerId: 2,
  },
];

export default function QuizReviewScreen() {
  const { selectedAnswers, score } = useLocalSearchParams();
  const router = useRouter();

  const parsedAnswers = JSON.parse(selectedAnswers as string); // Parse the passed selectedAnswers

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.reviewContainer}>
        <Text style={styles.scoreText}>
          Your Score: {score}/{quizQuestions.length}
        </Text>

        {quizQuestions.map((question, index) => {
          const userAnswerId = parsedAnswers[index];
          const correctAnswerId = question.correctAnswerId;

          return (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {index + 1}. {question.question}
              </Text>

              {question.options.map((option) => {
                const isUserAnswer = option.id === userAnswerId;
                const isCorrectAnswer = option.id === correctAnswerId;

                return (
                  <View
                    key={option.id}
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
                    <Text style={styles.optionText}>{option.text}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
