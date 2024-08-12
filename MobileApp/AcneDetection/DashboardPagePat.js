import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';

const DashboardPagePat = ({ navigation }) => {
  const [acneCounts, setAcneCounts] = useState({
    'Mild': 0,
    'Moderate': 0,
    'Severe': 0,
    'Very Severe': 0
  });

  const updateAcneCount = (severity, increment) => {
    setAcneCounts(prevCounts => ({
      ...prevCounts,
      [severity]: prevCounts[severity] + increment
    }));
  };

  const chartData = {
    labels: ['Mild', 'Moderate', 'Severe', 'Very Severe'],
    datasets: [{
      data: [
        acneCounts['Mild'],
        acneCounts['Moderate'],
        acneCounts['Severe'],
        acneCounts['Very Severe']
      ]
    }]
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
      
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
        
        <View style={styles.menuContainer}>
          
          <TouchableOpacity onPress={() => navigation.navigate('Schedule')} style={styles.menuItem1}>
            <Ionicons name="calendar" size={70} color="darkslategrey" />
            <Text style={styles.menuText}>Current Acne Details</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ResultsPagePat', { 
  patientName: 'John Doe',
})} style={styles.menuItem}>
  <Ionicons name="person" size={70} color="darkslategrey" />
  <Text style={styles.menuText}>Results</Text>
</TouchableOpacity>
        </View>

        <Text style={styles.chartHeaderText1}>Current Severity Levels</Text>
        <View style={{borderRadius: 25, overflow: 'hidden', backgroundColor: 'white', marginTop: 10, alignSelf: 'center' }}>
          <View style={{ borderRadius: 20 }}>
<BarChart
  data={chartData}
  width={350}
  height={200}
  yAxisLabel=""
  chartConfig={{
    backgroundGradientFrom: '#edf2fb',
    backgroundGradientFromOpacity: 0.5,
    backgroundGradientTo: '#48cbc5',
    backgroundGradientToOpacity: 0.8,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForLabels: {
      fontSize: 10,
    },
    barPercentage: 0.5,
    useWholeNumbersOnly: true,
    formatYLabel: (label) => Math.round(label),
    minValue: 0, 
    yAxisInterval: 1, 
    yAxisSuffix: '', 
  }}
/>
          </View>
        </View>

        {/* Displaying the daily counts of acne */}
        <View style={styles.resultsContainer}>
          {Object.entries(acneCounts).map(([severity, count]) => (
            <View key={severity} style={styles.acneCountContainer}>
              <Text style={styles.acneCountText}>{severity}: {count}</Text>
              <View style={styles.countButtonsContainer}>
                <TouchableOpacity onPress={() => updateAcneCount(severity, 1)}>
                  <Ionicons name="add-circle-outline" size={24} color="green" style={styles.iconButton} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => updateAcneCount(severity, -1)}>
                  <Ionicons name="remove-circle-outline" size={24} color="red" style={styles.iconButton} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

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
    justifyContent: 'auto',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    marginTop: 50,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5A5858',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: -10,
    paddingHorizontal: 40,
  },
  menuItem1: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: -10,
  },
  menuText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  chartHeaderText1: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5, 
    marginBottom: 5,
  },
  backButton: {
    position: 'absolute', 
    top: 70, 
    left: 25,
    zIndex: 10,
  },
  resultsContainer: {
    fontSize: 24,
    fontWeight: 'bold',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  acneCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  acneCountText: {
    marginRight: 10,
  },
  countButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default DashboardPagePat;
