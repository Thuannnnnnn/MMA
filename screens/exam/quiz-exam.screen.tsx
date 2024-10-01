import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

// Sample questions with IDs for answers
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

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  const router = useRouter(); // Navigation

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Countdown logic
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer on component unmount
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (answerId: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answerId;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {

    setButtonSpinner(true);
    let tempScore = 0;

    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswerId) {
        tempScore += 1;
      }
    });

    setScore(tempScore);
    setIsSubmitted(true);
    setButtonSpinner(false);
  };

  const handleReview = () => {
    router.push({
      pathname: "/(routes)/quiz-review",
      params: { selectedAnswers: JSON.stringify(selectedAnswers), score },
    });
  };

  const handleRestart = () => {
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswers([]);
    setTimeLeft(30 * 60); // Reset timer to 30 minutes
  };

  // Function to navigate to a
  // Function to navigate to a specific question
  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 30 }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {!isSubmitted ? (
          <View style={styles.quizContainer}>
            <Text style={styles.timerText}>
              Time Left: {formatTime(timeLeft)}
            </Text>
            <Text style={styles.questionText}>
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </Text>

            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedAnswers[currentQuestionIndex] === option.id &&
                    styles.selectedOption,
                ]}
                onPress={() => handleAnswerSelect(option.id)}
              >
                <View style={styles.radioContainer}>
                  <Ionicons
                    name={
                      selectedAnswers[currentQuestionIndex] === option.id
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={24}
                    color={
                      selectedAnswers[currentQuestionIndex] === option.id
                        ? "#2467EC"
                        : "#A1A1A1"
                    }
                  />
                  <Text style={styles.optionText}>{option.text}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>

              {currentQuestionIndex < quizQuestions.length - 1 ? (
                <TouchableOpacity style={styles.navButton} onPress={handleNext}>
                  <Text style={styles.navButtonText}>Next</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              Your Score: {score}/{quizQuestions.length}
            </Text>
            <View style={styles.resultButtonContainer}>
              <TouchableOpacity
                style={styles.resultButton}
                onPress={handleReview}
              >
                <Text style={styles.navButtonText}>Review Answers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resultButton}
                onPress={handleRestart}
              >
                <Text style={styles.navButtonText}>Restart Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation bar for selecting questions */}
      {!isSubmitted && (
        <View style={styles.questionNavContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quizQuestions.map((_, index) => (
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
      )}

      {/* Always render the Submit button regardless of the current question */}
      {!isSubmitted && (
        <TouchableOpacity
          style={styles.bottomSubmitButton}
          onPress={handleSubmit}
        >
          {buttonSpinner ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.navButtonText}>Submit Quiz</Text>
          )}
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 20,
    justifyContent: "space-between",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E74C3C",
    textAlign: "center",
    marginBottom: 10,
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
  resultButton: {
    backgroundColor: "#2A6C64",
    padding: 15,
    borderRadius: 8,
    width: "45%",
  },
  bottomSubmitButtonContainer: {
    alignSelf: "stretch",
    justifyContent: "flex-end", // Pushes the button to the bottom of the screen
    paddingBottom: 15, // Adds space between the button and the bottom
  },
  bottomSubmitButton: {
    backgroundColor: "#2A6C64",
    padding: 15,
    margin: 15,
    marginBottom: 50,
    borderRadius: 8,
  },
  questionNavContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 50,
    margin: 50,
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
