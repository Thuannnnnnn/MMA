import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  Dimensions,
  View,
  Animated,
  StatusBar,
} from "react-native";
import { Entypo, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";
import { getContentById } from "@/API/Content/ContentApi";
import { Course, Content } from "@/constants/Content/contentList";
import {
  getProcessByCourseIdAndEmail,
  updateProcessContent,
} from "@/API/process/procesAPI";
import { Process } from "@/constants/process/process";
import { useFocusEffect } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ContentList() {
  const [totalTasks, setTotalTasks] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const [data, setData] = useState<Content[]>([]);
  const [datProcess, setDatProcess] = useState<Process>();
  const [course, setCourse] = useState<Course>();
  const [token, setToken] = useState<any>();
  
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const token = `Bearer ${await AsyncStorage.getItem("token")}`;
          setToken(token);
          const courseId = await AsyncStorage.getItem("courseIdGotoContent");
          if (token && courseId) {
            const result: Course = await getContentById(courseId, token);
            setData(result.contents);
            setCourse(result);
          }
        } catch (error) {
          console.error("Error fetching content:", error);
        }
      };

      fetchData();
    }, [token])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchDataProcess = async () => {
        try {
          const userString = await AsyncStorage.getItem("user");
          let user;
          if (userString) {
            user = JSON.parse(userString);
          }

          if (token && course) {
            const result: Process = await getProcessByCourseIdAndEmail(
              course?._id,
              user.email,
              token
            );
            setTotalTasks(result.content.length);
            setDatProcess(result);
          }
        } catch (error) {
          console.error("Error fetching process:", error);
        }
      };

      fetchDataProcess();
    }, [token, course])
  );

  const animatedWidth = new Animated.Value(0);
  useFocusEffect(
    useCallback(() => {
      if (datProcess) {
        const completedTasks = datProcess.content.filter(
          (item) => item.isComplete === true
        ).length;
        const calculatedProgress = (completedTasks / totalTasks) * 100;
        setProgress(calculatedProgress);
      }

      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 10,
        useNativeDriver: false,
      }).start();
    }, [progress, datProcess, totalTasks])
  );

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#6a51ae");
      const lockOrientation = async () => {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      };
      lockOrientation();
    }, [])
  );

  const MakeIsComplete = async (id: string) => {
    const token = `Bearer ${await AsyncStorage.getItem("token")}`;
    const userString = await AsyncStorage.getItem("user");
    let user;

    if (userString) {
      user = JSON.parse(userString);
    }

    if (token) {
      const processId = user.email + "_" + course?._id;
      await updateProcessContent(processId, id, true, token);
    }
  };

  const saveDataToAsyncStorage = async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log("Data saved successfully!");
    } catch (e) {
      console.error("Error saving data: ", e);
    }
  };

  const handlePress = async (item: Content) => {
    try {
      await AsyncStorage.setItem("@selectedItem", JSON.stringify(item));
    } catch (e) {
      console.error("Error saving item", e);
    }

    switch (item.contentType) {
      case "videos":
        MakeIsComplete(item._id);
        router.push({
          pathname: "/(routes)/content/content-video",
        });
        break;
      case "docs":
        saveDataToAsyncStorage("_idCourse", course?._id);
        router.push({
          pathname: "/(routes)/content/content-docs",
        });
        break; 
      case 'questions':
        console.log('Redirecting to quizzResults');
        router.push({
          pathname: '/(routes)/quizz/quizzResults',
        });
        break;
      case "exams":
        router.push({
          pathname: "/(routes)/content/content-video",
        });
        break;
      default:
        console.log('No matching type. Doing nothing.');
        break;
    }
  };

  const renderCourse = ({ item }: { item: Content }) => {
    const courseIsComplete =
      datProcess?.content?.find(
        (contentItem) => contentItem.contentId === item._id
      )?.isComplete == true;

    const getIconByContentType = (contentType: string) => {
      switch (contentType) {
        case "videos":
          return <Entypo name="video" size={30} color="black" />;
        case "docs":
          return (
            <MaterialCommunityIcons
              name="file-document"
              size={30}
              color="black"
            />
          );
        case "questions":
          return (
            <MaterialCommunityIcons
              name="help-circle"
              size={30}
              color="black"
            />
          );
        case "exams":
          return <AntDesign name="edit" size={30} color="black" />;
        default:
          return (
            <MaterialCommunityIcons name="book" size={30} color="black" />
          );
      }
    };

    return (
      <View style={styles.courseCard} onTouchEnd={() => handlePress(item)}>
        <View style={styles.iconContainerType}>
          {getIconByContentType(item.contentType)}
        </View>
        <View style={styles.courseDetails}>
          <Text style={styles.courseTitle}>{item.contentName}</Text>
          <Text style={styles.courseType}>
            <MaterialCommunityIcons
              name="format-list-bulleted-type"
              size={18}
              color="black"
            />{" "}
            {item.contentType}
          </Text>
        </View>
        <View style={styles.iconContainerPlay}>
          {courseIsComplete ? (
            <AntDesign name="checkcircle" size={20} color="green" />
          ) : (
            <AntDesign name="caretright" size={20} color="black" />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleHeader}>Content List</Text>
      <FlatList
        data={data}
        renderItem={renderCourse}
        keyExtractor={(item) => item.contentId}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  titleHeader: {
    fontSize: 30,
    marginTop: 30,
    marginLeft: 30,
    fontWeight: "900",
    marginBottom: 40,
  },
  courseCard: {
    flexDirection: "row",
    marginBottom: screenHeight * 0.02,
    backgroundColor: "#fff",
    borderRadius: screenWidth * 0.02,
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  courseDetails: {
    flex: 1,
    padding: screenWidth * 0.03,
  },
  courseTitle: {
    fontSize: screenWidth * 0.045,
    fontWeight: "bold",
    color: "#FF7F3E",
  },
  courseType: {
    fontSize: screenWidth * 0.04,
    fontWeight: "600",
  },
  iconContainerType: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: 10,
    width: 60,
  },
  iconContainerPlay: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
