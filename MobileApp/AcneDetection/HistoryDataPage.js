import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';

const HistoryDataPage = ({ navigation }) => {
  const images = [
    require('./assets/avatar-icon.jpg'),
    require('./assets/avatar-icon.jpg'),
    require('./assets/avatar-icon.jpg'),
    require('./assets/avatar-icon.jpg'),
    require('./assets/avatar-icon.jpg'),
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePress = (image) => {
    setSelectedImage({ props: { source: image } });
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
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
        <Text style={styles.header}>Images</Text>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => handleImagePress(image)}>
                <Image source={image} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Modal visible={isModalVisible} transparent={true}>
          <ImageViewer
            imageUrls={selectedImage ? [selectedImage] : []}
            onSwipeDown={closeModal}
            enableSwipeDown={true}
            renderHeader={() => (
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )}
          />
        </Modal>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 90, // Adjust this value as needed
    marginBottom: 20,
    textAlign: 'center', // Center the header text
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 25,
    zIndex: 10,
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
});

export default HistoryDataPage;
