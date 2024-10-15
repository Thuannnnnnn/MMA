import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  Button, 
  Modal, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResults, dropResults } from '@/API/Quizz/quizzResultAPI';
import { Result } from '@/constants/Quizz/result';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';

const ResultsPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const fetchResults = async () => {
    console.log('Fetching results...');
    setLoading(true);
    let currentSelectedItemId: string | undefined; 
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại.');
      }
  
      const storedItem = await AsyncStorage.getItem('@selectedItem');
      if (storedItem) {
        const parsedItem = JSON.parse(storedItem);
        console.log(`Parsed item:`, parsedItem);
        currentSelectedItemId = parsedItem?._id;
        
        if (currentSelectedItemId) {
          setSelectedItemId(currentSelectedItemId);
        } else {
          console.warn('Selected Item ID không tồn tại trong parsedItem.');
        }
      } else {
        console.warn('Stored item không tồn tại trong AsyncStorage.');
      }
  
      const fetchedResults = await getResults(token);
      console.log(`Fetched results:`, fetchedResults);
  
      const filteredResults = fetchedResults.filter(result => {
        console.log(`Comparing: ${result.selectedItemId} with ${currentSelectedItemId}`);
        return result.selectedItemId === currentSelectedItemId; 
      });
  
      setResults(filteredResults);
      console.log(`Filtered results:`, filteredResults);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định.');
      }
    } finally {
      setLoading(false);
      console.log('Fetching results completed.');
    }
  };
  
  useEffect(() => {
    fetchResults();
  }, []);

  const handleTryAgain = async (resultId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại.');
      }
      await dropResults(token, resultId);
      setResults((prevResults) => prevResults.filter((item) => item._id !== resultId));
      Alert.alert('Thành công', 'Kết quả đã được xóa.');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Lỗi', error.message);
      } else {
        Alert.alert('Lỗi', 'Đã xảy ra lỗi không xác định');
      }
    }
  };

  const handleShowDetails = (item: Result) => {
    setSelectedResult(item);
    setModalVisible(true);
  };

  const closeDetailsModal = () => {
    setModalVisible(false);
    setSelectedResult(null);
  };

  const renderItem = ({ item }: { item: Result }) => {
    console.log('Rendering item', item);
    const totalQuestions = item.result.length;
    const correctAnswers = item.result.filter(answer => answer.selectedAnswer === answer.correctAnswer).length;
    
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0; 
    const isPassed = percentage > 80;
    console.log('Percentage', percentage);
    console.log('Is passed', isPassed);
  
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Correct: {correctAnswers} / {totalQuestions}</Text>
        <Text style={styles.cardTitle}>Points: {percentage.toFixed(2)}%</Text>
        <Text style={[styles.resultText, isPassed ? styles.pass : styles.fail]}>
          {isPassed ? 'Pass' : 'Not Pass'}
        </Text>
        <Button title="Xem chi tiết" onPress={() => handleShowDetails(item)} color="#FF9800" />
      </View>
    );
  };

  


  const renderDetailItem = (answer: any) => {
    const isCorrect = answer.selectedAnswer === answer.correctAnswer;
    return (
      <ScrollView style={styles.detailContainer}>
        <View key={answer.question} style={[styles.detailItem, isCorrect ? styles.correct : styles.incorrect]}>
          <Text style={styles.detailQuestion}>Câu hỏi: {answer.question}</Text>
          <Text style={styles.detailText}>Your choice: </Text>
          <Text style={{ ...styles.detailText, color: isCorrect ? 'green' : 'red' }}>{answer.selectedAnswer}</Text>
          <Text style={styles.detailText}>Correct answer</Text>
          <Text style={styles.detailText1}> {answer.correctAnswer}</Text>
        </View>
      </ScrollView>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || Math.random().toString()}
        contentContainerStyle={styles.list}
      />
      {selectedResult && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeDetailsModal}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Chi tiết kết quả</Text>
            {selectedResult.result.map(renderDetailItem)}
            <Button title="Đóng" onPress={closeDetailsModal} color="#4CAF50" />
            <Button title="Thử lại" onPress={() => handleTryAgain(selectedResult._id ?? '')} color="#D32F2F" />
          </View>
        </Modal>
      )}
      <TouchableOpacity style={{ width: 200, height: 100 }}>
        <Button title="Đóng" onPress={() => router.push('/(routes)/quizz')} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
};

// Định nghĩa các styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailContainer: {
    backgroundColor: '#fff',
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  pass: {
    color: 'green',
  },
  fail: {
    color: 'red',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  correct: {
    backgroundColor: '#dff0d8',
  },
  incorrect: {
    backgroundColor: '#f2dede',
  },
  detailQuestion: {
    fontWeight: 'bold',
  },
  detailText: {
    marginVertical: 2,
    fontWeight: 'bold',
  },
  detailText1: {
    marginVertical: 2,
    color: 'gray',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default ResultsPage;
