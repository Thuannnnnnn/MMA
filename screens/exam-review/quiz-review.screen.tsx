// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter, useLocalSearchParams } from "expo-router";

// // Sample quiz questions (you may want to import this from a common file if necessary)


// export default function QuizReviewScreen() {
//   const { selectedAnswers, score } = useLocalSearchParams();
//   const router = useRouter();

//   const parsedAnswers = JSON.parse(selectedAnswers as string); // Parse the passed selectedAnswers

//   return (
//     <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
//       <View style={styles.reviewContainer}>
//         <Text style={styles.scoreText}>
//           Your Score: {score}/{quizQuestions.length}
//         </Text>

//         {quizQuestions.map((question, index) => {
//           const userAnswerId = parsedAnswers[index];
//           const correctAnswerId = question.correctAnswerId;

//           return (
//             <View key={index} style={styles.questionContainer}>
//               <Text style={styles.questionText}>
//                 {index + 1}. {question.question}
//               </Text>

//               {question.options.map((option) => {
//                 const isUserAnswer = option.id === userAnswerId;
//                 const isCorrectAnswer = option.id === correctAnswerId;

//                 return (
//                   <View
//                     key={option.id}
//                     style={[
//                       styles.optionContainer,
//                       isCorrectAnswer && styles.correctOption,
//                       isUserAnswer && !isCorrectAnswer && styles.wrongOption,
//                     ]}
//                   >
//                     <Ionicons
//                       name={
//                         isUserAnswer
//                           ? isCorrectAnswer
//                             ? "checkmark-circle"
//                             : "close-circle"
//                           : "ellipse-outline"
//                       }
//                       size={24}
//                       color={
//                         isUserAnswer
//                           ? isCorrectAnswer
//                             ? "green"
//                             : "red"
//                           : "#333"
//                       }
//                     />
//                     <Text style={styles.optionText}>{option.text}</Text>
//                   </View>
//                 );
//               })}
//             </View>
//           );
//         })}

//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <Text style={styles.backButtonText}>Back to Quiz</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   reviewContainer: {
//     padding: 20,
//   },
//   scoreText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//     paddingTop: 25,
//   },
//   questionContainer: {
//     marginBottom: 20,
//   },
//   questionText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   optionContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 5,
//     backgroundColor: "#f0f0f0",
//   },
//   correctOption: {
//     backgroundColor: "#d4edda",
//   },
//   wrongOption: {
//     backgroundColor: "#f8d7da",
//   },
//   optionText: {
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   backButton: {
//     backgroundColor: "#2A6C64",
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 30,
//   },
//   backButtonText: {
//     color: "white",
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });
