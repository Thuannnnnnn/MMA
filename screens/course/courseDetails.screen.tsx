import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import img from '@/assets/Course/BgCourseDetail.png';

const { width, height } = Dimensions.get('window');
export default function CourseDetailsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.banner}>
          <View style={styles.label}>
            <Text style={styles.labelText}>BESTSELLER</Text>
          </View>
          <Text style={styles.courseTitle}>ProductDesign v1.0</Text>
          <Image source={img} style={styles.courseImage} />
        </View>

        <View style={styles.childrent}>
          {/* About Course Section */}
          <View style={styles.aboutCourse}>
            <View style={styles.courseSection}>
              <Text style={styles.courseTitleChild}>ProductDesign v1.0</Text>
              <Text style={styles.price}>$74.00</Text>
            </View>
            <Text style={styles.courseInfo}>6h 14min · 24 Lessons</Text>
            <Text style={styles.aboutTitle}>About this course</Text>
            <Text style={styles.aboutDescription}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
            </Text>
          </View>

          {/* Lessons List */}
          <View style={styles.lessonList}>
            <View style={styles.lessonItem}>
              <Text style={styles.lessonIndex}>01</Text>
              <View style={styles.lessonDetails}>
                <Text style={styles.lessonTitle}>Welcome to the Course</Text>
                <Text style={styles.lessonTime}>6:10 mins</Text>
              </View>
              <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.lessonItem}>
              <Text style={styles.lessonIndex}>02</Text>
              <View style={styles.lessonDetails}>
                <Text style={styles.lessonTitle}>Process overview</Text>
                <Text style={styles.lessonTime}>6:10 mins</Text>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.lessonItem}>
              <Text style={styles.lessonIndex}>03</Text>
              <View style={styles.lessonDetails}>
                <Text style={styles.lessonTitle}>Discovery</Text>
                <Text style={styles.lessonTime}>6:10 mins</Text>
              </View>
              <TouchableOpacity style={styles.lockButton}>
              <Text style={styles.playButtonText}>Lock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerChildren}>
          <TouchableOpacity style={styles.favoriteButton}>
            <Text style={styles.favoriteIcon}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Buy Now */}
        <View style={styles.footerChildren}>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#FFE7EE',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  childrent: {
    borderTopRightRadius: width * 0.04,
    borderTopLeftRadius: width * 0.04,
    padding: width * 0.05,
    backgroundColor: '#fff',
    flex: 1,
    
  },
  banner: {
    paddingTop: height * 0.01,
    width: width,
    height: height * 0.36,
    paddingHorizontal: width * 0.05,
  },
  label: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    top: height * 0.1,
  },
  labelText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.025,
  },
  courseTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginVertical: 10,
    top: height * 0.1,
  },
  courseTitleChild: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  courseSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseImage: {
    width: width * 0.3,
    height: height * 0.3,
    left: width * 0.65,
    bottom: height * 0.02,
  },
  price: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#3D5CFF',
    marginBottom: 10,
  },
  courseInfo: {
    fontSize: width * 0.025,
    color: '#6c757d',
    paddingBottom: height * 0.02,
  },
  aboutCourse: {
    marginBottom: 20,
    zIndex: 1,
  },
  aboutTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  aboutDescription: {
    fontSize: width * 0.025,
    color: '#6c757d',
    marginTop: 10,
  },
  lessonList: {
    marginBottom: 20,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lessonIndex: {
    fontSize: width * 0.08,
    fontWeight: 'light',
    marginRight: width*0.05,
    color: '#cdcdcd',
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  lessonTime: {
    fontSize: width * 0.03,
    color: '#6c757d',
  },
  playButton: {
    backgroundColor: '#2E86DE',
    width: width* 0.1,
    height: height*0.06,
    borderRadius: width*0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: width * 0.03,
    color: '#fff',
    fontWeight: 'bold',  
  },
  lockButton: {
    backgroundColor: '#cccccc',
    width: width* 0.1,
    height: height*0.06,
    borderRadius: width*0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopRightRadius: width * 0.025,
    borderTopLeftRadius: width * 0.025,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    height: height * 0.15,
    bottom: 20,
    marginBottom: -20
  },
  footerChildren: {
    flex: 1,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: height * 0.02,
    width: width * 0.5,
    height: height * 0.08,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  favoriteButton: {
    justifyContent: 'flex-start',
    backgroundColor: '#FDEDEC',
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    width: width * 0.4,
    height: height * 0.08,
  },
  favoriteIcon: {
    color: '#E74C3C',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});
