import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ImageViewing from 'react-native-image-viewing';

const Results = ({ route }) => {
  const { patientId, patientName } = route.params;
  const [imageData, setImageData] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const storage = getStorage();
    const imageTypes = ['Chin', 'LeftCheeks', 'RightCheeks', 'Nose'];
    try {
      const data = await Promise.all(
        imageTypes.map(async (type) => {
          const imagePath = `patients/${patientName}/${patientName}_${type}.jpeg`;
          const url = await getDownloadURL(ref(storage, imagePath)).catch((error) => {
            console.error(`Failed to get download URL for ${imagePath}`, error);
            return ''; // Return an empty string on error
          });
          return { type, url };
        })
      );
      setImageData(data.filter(item => item.url !== '')); // Filter out empty URLs
    } catch (error) {
      console.error('Error fetching images: ', error);
    }
  };

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setIsVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#c0f2f3', '#b1dbdb', '#48cbc5', '#1e9c99']}
        style={styles.gradient}
      >
        <Text style={styles.headerText}>Images of {patientName}</Text>
        <FlatList
          data={imageData}
          keyExtractor={(item) => item.type}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleImagePress(index)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.url }} style={styles.image} />
                <Text style={styles.imageLabel}>{item.type}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <ImageViewing
          images={imageData.map(item => ({ uri: item.url }))}
          imageIndex={selectedImageIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
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
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#48cbc5',
  },
  imageLabel: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e9c99',
  },
});

export default Results;
