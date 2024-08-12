import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, Button } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultsPagePat = ({ route, navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recommendation1, setRecommendation1] = useState('');
  const { patientName, patientImage, patientSex, patientAge, patientAcneSeverity, patientRecommendation } = route.params;
  const images = [{
    props: {
      source: patientImage
    }
  }];

  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const loadRecommendation = async () => {
    // Assuming patientId is passed via route.params
    const { patientId } = route.params;
    const savedRecommendation = await AsyncStorage.getItem(`recommendation_${patientId}`);
    if (savedRecommendation) {
      setRecommendation1(savedRecommendation);
    }
  };
  
  const saveRecommendation = async (newRecommendation) => {
    // Assuming patientId is passed via route.params
    const { patientId } = route.params;
    await AsyncStorage.setItem(`recommendation_${patientId}`, newRecommendation);
  };

  useEffect(() => {
    loadRecommendation();
  }, []);

  useEffect(() => {
    saveRecommendation(recommendation1);
  }, [recommendation1]);

  const handleRowPress = (date, treatment) => {
    // Navigate to the history data page with the selected date and treatment
    navigation.navigate('HistoryData', { date, treatment });
  };

  return (
    <SafeAreaView style={styles.container}>
    <LinearGradient
        colors={['#ffffff','#c0f2f3', '#b1dbdb', '#48cbc5', '#1e9c99']}
        style={styles.gradient}
      >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
       <Text style={styles.headerText}>My Profile</Text>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Image source={patientImage} style={styles.image} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true}>
        <ImageViewer imageUrls={images} />
        <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Modal>

      <View style={styles.inline1}>

        <Text style={styles.value}>{patientName}</Text>
      </View>
      <View style={styles.inline1}>
    
        <Text style={styles.value}>{patientAge}</Text>
      </View>

      <View style={styles.inline1}>
  
        <Text style={styles.value}>{patientSex}</Text>
      </View>


      <View style={styles.resultsContainer}>
        <Text style={styles.header1}>Results:</Text>
        
        <View style={styles.inline}>
          <Text style={styles.label}>Severity Level: </Text>
          <View style={styles.inline1}>
            <Text style={styles.value2}>{patientAcneSeverity}</Text>
          </View>
        </View>
      </View>

      <View style={styles.recommendationsContainer}>
        <Text style={styles.header2}>Recommendations:</Text>
        <TextInput
          style={editMode ? styles.textInputEdit1 : styles.textInputRead1}
          onChangeText={setRecommendation1}
          value={patientRecommendation}
          multiline
          editable={editMode} // Make the TextInput editable based on editMode
        />
      </View>
      <View style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Date</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Treatment</Text>
            </View>
            <TouchableOpacity style={styles.tableRow} onPress={() => handleRowPress('2023-05-01', 'Over-the-counter medications')}>
              <Text style={styles.tableCell}>2023-05-01</Text>
              <Text style={styles.tableCell}>Over-the-counter medications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableRow} onPress={() => handleRowPress('2023-05-08', 'Prescription creams or gels')}>
              <Text style={styles.tableCell}>2023-05-08</Text>
              <Text style={styles.tableCell}>Prescription creams or gels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableRow} onPress={() => handleRowPress('2023-05-15', 'Oral antibiotics')}>
              <Text style={styles.tableCell}>2023-05-15</Text>
              <Text style={styles.tableCell}>Oral antibiotics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableRow} onPress={() => handleRowPress('2023-05-22', 'Isotretinoin')}>
              <Text style={styles.tableCell}>2023-05-22</Text>
              <Text style={styles.tableCell}>Isotretinoin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableRow} onPress={() => handleRowPress('2023-05-29', 'Follow-up')}>
              <Text style={styles.tableCell}>2023-05-29</Text>
              <Text style={styles.tableCell}>Follow-up</Text>
            </TouchableOpacity>
          </View>
    </ScrollView>
  </LinearGradient>
</SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  headerText: {
    textAlign: "center",
    fontSize: 18,
    color: 'black',
    fontWeight: '700',
    marginTop: 70,
  },
   inline1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
   inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginTop: 5,
  },
  age: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#5A5858',
  },
   sex: {
    fontSize: 18,
    marginLeft: 10,
    color: '#5A5858',
  },
  acneSeverity: {
    fontSize: 18,
    marginLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 25,
    marginBottom: 20,
    marginTop:  30,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  resultsContainer: {
    alignSelf: 'stretch',
    marginVertical: 20,
    marginTop: 5,
  },
  ResultsInput1: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    flex: 1, // To ensure the input field stretches to fill available space
  },
    ResultsInput2: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    flex: 1, // To ensure the input field stretches to fill available space
  },
  recommendationsContainer: {
    alignSelf: 'stretch',
    marginVertical: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  header1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  header2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute', 
    top: 70, 
    left: 25,
    zIndex: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -10,
    marginBottom: 10,
  },
  value: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  value1: {
    fontSize: 18,
    backgroundColor: '#fff', // Consider a background color that matches your design
    borderColor: 'gray', // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius for rounded corners
    padding: 5, // Padding inside the text input
  },
  value2: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  closeButtonText: {
    color: '#ffff',
  },
  textInputEdit: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: 'black',
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    flex: 1,
  },
  textInputRead: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 5,
    flex: 1,
  },
  textInputEdit1: {
    fontSize: 18,
    color: 'black',
    borderColor: 'black', // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius for rounded corners
    padding: 5,
    marginTop: 10,
  },
  textInputRead1: {
    backgroundColor: 'transparent',
    fontSize: 18,
    padding: 5,
  },
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
  },
});

export default ResultsPagePat;
