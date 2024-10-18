import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  Button, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResults, dropResults } from '@/API/Quizz/quizzResultAPI';
import { Result } from '@/constants/Quizz/result';
import { router } from 'expo-router';

const ResultsPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch kết quả từ API
  const fetchResults = async () => {
    console.log('Fetching results...');
    setLoading(true);
    let currentSelectedItemId: string | undefined; 
    try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token retrieved:', token);
        if (!token) {
            throw new Error('Token không tồn tại.');
        }

        console.log('Fetching stored item...');
        const storedItem = await AsyncStorage.getItem('@selectedItem');
        console.log('Stored item:', storedItem);
        if (storedItem) {
            const parsedItem = JSON.parse(storedItem);
            currentSelectedItemId = parsedItem?.contentRef?._id; // Gán ID từ contentRef
            console.log('Parsed Item ID:', currentSelectedItemId);
        }

        console.log('Fetching results from API...');
        const fetchedResults = await getResults(token);
        console.log('Fetched Results:', fetchedResults);

        const filteredResults = fetchedResults.filter(result => {
          const selectedItemId = result.selectedItemId;
          return currentSelectedItemId === selectedItemId;
      });

        console.log('Filtered Results:', filteredResults);
        setResults(filteredResults);
    } catch (err) {
        console.error('Error occurred:', err);
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Đã xảy ra lỗi không xác định.');
        }
    } finally {
        setLoading(false);
        console.log('Fetching results complete.');
    }
};

  useEffect(() => {
    fetchResults();
  }, []);

  const handleTryAgain = async (resultId: string) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to retry this result?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Retry',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                throw new Error('Token not found.');
              }
              await dropResults(token, resultId);
              setResults(prevResults => prevResults.filter(item => item._id !== resultId));
              router.push('/(routes)/quizz')
            } catch (error) {
              if (error instanceof Error) {
                Alert.alert('Error', error.message);
              } else {
                Alert.alert('Error', 'An unknown error occurred');
              }
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const CircleCheckbox = ({ selected, onSelect }: { selected: boolean; onSelect: () => void }) => {
    return (
      <TouchableOpacity onPress={onSelect} style={styles.checkboxContainer}>
        <View style={[styles.circle, selected && styles.selectedCircle]} />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: Result }) => {
    const totalQuestions = item.result.length;
    const correctAnswers = item.result.filter(answer => answer.selectedAnswer === answer.correctAnswer).length;
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0; 
    const isPassed = percentage > 80;

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Correct answers: {correctAnswers} / {totalQuestions}</Text>
        <Text style={styles.resultText}>Score: {percentage.toFixed(2)}%</Text>
        <Text style={[styles.resultText, isPassed ? styles.pass : styles.fail]}>
          {isPassed ? 'Pass' : 'Not Pass'}
        </Text>
        <Text style={styles.detailTitle}>Chi tiết kết quả:</Text>
        {item.result.map((answer, index) => {
          return (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailQuestion}>Question: {answer.question}</Text>
              <View style={styles.optionsContainer}>
                {answer.options.map((option: string, optionIndex: string) => {
                  const isOptionSelected = answer.selectedAnswer === option;
                  const isOptionCorrect = option === answer.correctAnswer;
  
                  return (
                    <View key={optionIndex} style={[styles.optionItem, isOptionCorrect ? styles.correctOption : isOptionSelected && !isOptionCorrect ? styles.incorrectOption : null]}>
                      <CircleCheckbox 
                        selected={isOptionSelected} 
                        onSelect={() => {}} 
                      />
                      <Text>{option}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  
  if (results.length === 0) {
    return (
      <View style={styles.container2}>
        <View style={styles.noResultContainer}>
          <Text style={styles.resultTitle}>Your correct answers: 0</Text>
          <Text style={styles.resultText}>Your score: 0%</Text>
          <TouchableOpacity style={styles.startButton}>
            <Button title="Start" onPress={() => router.push('/(routes)/quizz')} color="#1E90FF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || Math.random().toString()}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.tryAgainButton}>
        <Button title="Try Again" onPress={() => handleTryAgain(results[0]._id)} color="#D32F2F" />
      </TouchableOpacity>
    </View>
  );
};

// Định nghĩa các styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#FFFFFF',
  },
  list: {
    paddingBottom: 20,
  },
  resultContainer: {
    padding: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    marginVertical: 2,
    textAlign: 'center',
  },
  detailQuestion: {
    fontWeight: 'bold', 
  },
  detailTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  detailItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    flexWrap: 'wrap', 
  },
  correctOption: {
    backgroundColor: '#dff0d8',
    flexGrow: 1,
    flexShrink: 1,
  },
  incorrectOption: {
    backgroundColor: '#f2dede',
    flexGrow: 1,
    flexShrink: 1,
  },
  detailText: {
    fontSize: 14,
    marginTop: 5,
  },
  detailText1: {
    color: 'red',
  },
  tick: {
    marginLeft: 5,
  },
  closeButton: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  pass: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 20,
  },
  fail: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#060606',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#60a5f9',
  },
  noResultContainer: {
    width: 200,
    height: 150,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    marginTop: 10,
  },
  tryAgainButton: {
    marginVertical: 20,
  },
});

export default ResultsPage;
