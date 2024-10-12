import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native'; // Sử dụng 'react' cho web
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResults } from '@/API/Quizz/quizzResultAPI';
import { Result } from '@/constants/Quizz/result';

const ResultsPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage
        if (!token) {
          throw new Error('Token không tồn tại.');
        }
        const fetchedResults = await getResults(token);
        setResults(fetchedResults);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          Alert.alert('Lỗi', err.message);
        } else {
          setError('An unknown error occurred');
          Alert.alert('Lỗi', 'An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const renderItem = ({ item }: { item: Result }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text>ID: {item._id}</Text>
      <Text>Attempts: {item.attempts}</Text>
      <Text>Points: {item.points}</Text>
      <Text>Achieved: {item.achieved}</Text>
      <Text>Created At: {new Date(item.createdAt!).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={(item) => item._id || Math.random().toString()}
    />
  );
};

export default ResultsPage;
