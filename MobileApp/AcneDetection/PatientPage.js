import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ref as dbRef, onValue } from 'firebase/database';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { rtdb } from './FirebaseConfig';

const PatientPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patientsData, setPatientsData] = useState([]);

  useEffect(() => {
    const patientsRef = dbRef(rtdb, 'patientData');

    onValue(patientsRef, (snapshot) => {
      const patients = snapshot.val();
      const patientIds = Object.keys(patients);

      // Convert object of objects into an array, only retrieving 'severity'
      const loadedData = patientIds.map((id) => ({
        id,
        name: `Patient No. ${id}`,
        severity: patients[id].severity,
      }));

      // Set patients data here so we can filter and show this info immediately
      setPatientsData(loadedData);

      // Fetch and assign images after setting initial data
      fetchImages(patientIds);
    });
  }, []);

  const fetchImages = async (patientIds) => {
    const storage = getStorage();
    try {
      // Get image URLs in parallel
      const imageUrls = await Promise.all(
        patientIds.map((id) => {
          const patientName = `Patient No. ${id}`;
          return getDownloadURL(ref(storage, `patients/${patientName}/${patientName}_Forehead.jpeg`)).catch((error) => {
            console.error(`Failed to get download URL for patients/${patientName}/${patientName}_Forehead.jpeg`, error);
            return ''; // Return an empty string on error
          });
        })
      );

      // Map image URLs back to patient data
      setPatientsData((prevData) =>
        prevData.map((patient, index) => ({
          ...patient,
          image: { uri: imageUrls[index] || 'default-placeholder-image-uri' },
        }))
      );
    } catch (error) {
      console.error('Error fetching images: ', error);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text === '') {
      // Reload the full list when search is cleared
      onValue(dbRef(rtdb, 'patientData'), (snapshot) => {
        const patients = snapshot.val();
        const patientIds = Object.keys(patients);
        const reloadedData = patientIds.map((id) => ({
          id,
          name: `Patient No. ${id}`,
          severity: patients[id].severity,
        }));
        setPatientsData(reloadedData);
      });
    } else {
      setPatientsData((prevData) =>
        prevData.filter((item) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#c0f2f3', '#b1dbdb', '#48cbc5', '#1e9c99']}
        style={styles.gradient}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
        <Text style={styles.listHeaderText}>List of Patients:</Text>
        <FlatList
          data={patientsData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.buttonItem}
              onPress={() => navigation.navigate('Results', {
                patientId: item.id,
                patientName: item.name,
                patientImage: item.image,
                patientSeverity: item.severity,
              })}
            >
              <View style={styles.profileImageContainer}>
                <Image source={item.image} style={styles.buttonImage} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.buttonText}>{item.name}</Text>
                <Text style={styles.profileText}>Severity: {item.severity}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.buttonList}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to the left
    marginBottom: 20,
    marginTop: 70, 
    width: '100%',
  },
  greetingText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginLeft: 7,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1.5, // Adjusted the width
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 100,
    paddingHorizontal: 10,
  },
  listHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 5,
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonList: {
    marginTop: 20,
    width: '100%',
  },
  buttonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 5,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  profileDetailRow: {
    flexDirection: 'row', // Aligns label and value horizontally
    alignItems: 'center', 
  },
  profileLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold', 
    padding: 2,
  },
  profileValue: {
    fontSize: 16,
    color: 'black',
  },  
  backButton: {
    position: 'absolute', 
    top: 70, 
    left: 25,
    zIndex: 10,
  },
});

export default PatientPage;
