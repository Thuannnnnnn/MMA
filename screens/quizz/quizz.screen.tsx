import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ProgressBarAndroid, Animated, Image, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { fetchQuestions } from '@/API/Quizz/quizzAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeResult } from '@/API/Quizz/quizzResultAPI';
import { Result } from '@/constants/Quizz/result';

export default function QuizzScreen() {
  const navigation = useNavigation();
  const [scaleValue] = useState(new Animated.Value(1));
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userSelections, setUserSelections] = useState<(string | null)[]>([]);
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (currentQuestionIndex + 1) / totalQuestions : 0;

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        const fetchedQuestions = await fetchQuestions(token);
    
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          const questionsWithAnswers = fetchedQuestions[0].questions.map((q) => ({
            ...q,
            correctAnswer: q.options[q.answer],
          }));
          setQuestions(questionsWithAnswers);
          setUserSelections(new Array(questionsWithAnswers.length).fill(null));
        } else {
          setError('No questions found');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to fetch questions');
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
      Animated.timing(scaleValue, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 150, useNativeDriver: true }),
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

      // Tính điểm
      const score = userSelections.reduce((acc, selection, index) => {
          if (selection === questions[index].correctAnswer) {
              return acc + 1;
          }
          return acc;
      }, 0);

      // Tạo đối tượng resultData theo interface Result
      const resultData: Result = {
        quizId: questions[0]._id,
        result: userSelections.map((selection, index) => ({
          question: questions[index].question,
          selectedAnswer: selection,
          correctAnswer: questions[index].correctAnswer,
        })),
        attempts: 1,
        points: score,
        achieved: `${score}/${questions.length}`,
        createdAt: new Date().toISOString(),
        selectedItemId: null,
        _id: ''
      };

      try {
          console.log("resultData", resultData);
        
          // Lấy _id từ AsyncStorage
          const storedItem = await AsyncStorage.getItem('@selectedItem');
          const parsedItem = storedItem ? JSON.parse(storedItem) : null;

          // Nếu tồn tại, thêm _id vào resultData
          if (parsedItem && parsedItem._id) {
              resultData.selectedItemId = parsedItem._id;
          }

          console.log("resultData after adding selectedItemId", resultData);

          // Lưu kết quả vào AsyncStorage
          await AsyncStorage.setItem('quizResults', JSON.stringify({ score, total: questions.length }));

          // Lấy token và gửi request lưu kết quả
          const token = await AsyncStorage.getItem('token');
          if (token !== null) {
              console.log("token", token);
              const response = await storeResult(token, resultData); // Gọi hàm lưu kết quả
              console.log("msg", response); // In thông điệp phản hồi từ server
              return response;
          } else {
              console.error('Token is null');
          }
      } catch (error) {
          console.error('Error saving results:', error);
      }
  };  const handleBack = () => {
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

      <ProgressBarAndroid styleAttr="Horizontal" color="#2980f1" indeterminate={false} progress={progress} />

      <View style={styles.content}>
        {questions[currentQuestionIndex] && (
          <View key={questions[currentQuestionIndex]._id} style={styles.questionCard}>
            <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>

            {questions[currentQuestionIndex].options.map((option: string, optionIndex: number) => (
              <TouchableOpacity key={optionIndex} onPress={() => handleAnswerSelect(option)}>
                <Animated.View style={[
                  styles.option,
                  { transform: [{ scale: scaleValue }] },
                  userSelections[currentQuestionIndex] === option ? styles.selectedOption : null
                ]}>
                  <Text style={styles.optionText}>{option}</Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.navigationButtons}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} disabled={currentQuestionIndex === 0}>
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
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 24,
    color: '#0fbcf9',
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2980f1',
  },
  username: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderColor: '#2980f1',
    borderWidth: 1,
    shadowColor: '#2980f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#1b75ec',
    shadowColor: '#1b75ec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#29f1c3',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1b75ec',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  loadingText: {
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#ff3d3d',
    textAlign: 'center',
    marginTop: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  nextButton: {
    backgroundColor: '#2954f1',
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#333',
  },
  nextButtonText: {
    color: '#fff',
  },
});
