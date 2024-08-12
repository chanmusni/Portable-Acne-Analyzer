import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

let initialAppointments = [];

const ScheduleItem = ({ title, detail, date, time, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <Ionicons name="ellipse" size={10} color="black" style={styles.bulletIcon} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
        <Text style={styles.datetime}>{`${date} - ${time}`}</Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={24} color="darkslategrey" />
      </TouchableOpacity>
    </View>
  );
};

const SchedulePage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ title: '', detail: '', date: '', time: '' });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    saveAppointments();
  }, [appointments]);

  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
      else setAppointments(initialAppointments);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  };

  const saveAppointments = async () => {
    try {
      await AsyncStorage.setItem('appointments', JSON.stringify(appointments));
    } catch (error) {
      console.error('Failed to save appointments:', error);
    }
  };

  const addNewAppointment = () => {
    const newId = (parseInt(appointments[appointments.length - 1]?.id || '0') + 1).toString();
    const appointmentToAdd = { id: newId, ...newAppointment };
    setAppointments(prevAppointments => [...prevAppointments, appointmentToAdd]);
    setModalVisible(false);
    setNewAppointment({ title: '', detail: '', date: '', time: '' });
  };

  const deleteAppointment = id => {
    setAppointments(prevAppointments =>
      prevAppointments.filter(appointment => appointment.id !== id)
    );
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
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Schedules:</Text>
        </View>
        <FlatList
          data={appointments}
          renderItem={({ item }) => (
            <ScheduleItem
              title={item.title}
              detail={item.detail}
              date={item.date}
              time={item.time}
              onDelete={() => deleteAppointment(item.id)}
            />
          )}
          keyExtractor={item => item.id}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Appointment</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={newAppointment.title}
                onChangeText={text => setNewAppointment({ ...newAppointment, title: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Detail"
                value={newAppointment.detail}
                onChangeText={text => setNewAppointment({ ...newAppointment, detail: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Date"
                value={newAppointment.date}
                onChangeText={text => setNewAppointment({ ...newAppointment, date: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Time"
                value={newAppointment.time}
                onChangeText={text => setNewAppointment({ ...newAppointment, time: text })}
              />
              <View style={styles.modalButtons}>
                <Button title="Add" onPress={addNewAppointment} />
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
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
  headerTitle: {
    fontWeight: 'bold',
    marginTop: 100,
    color: '#000',
    fontSize: 24,
    alignSelf: 'flex-start',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  bulletIcon: {
    width: 10,
    marginRight: 8,
    marginLeft: -10,
    marginTop: -10,
  },
  detailsContainer: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detail: {
    color: 'grey',
    fontSize: 14,
  },
  datetime: {
    color: 'grey',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    top: 60,
    right: 25,
    zIndex: 10,
    borderRadius: 50,
    padding: 10,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 25,
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%', 
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default SchedulePage;