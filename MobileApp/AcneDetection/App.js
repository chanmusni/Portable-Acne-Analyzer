import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomePage from "./WelcomePage";
import LoginPageDoc from "./LoginPageDoc";
import LoginPagePat from "./LoginPagePat";
import SignupPage from "./SignupPage";
import SignupPagePat from "./SignupPagePat";
import DashboardPage from "./DashboardPage";
import DashboardPagePat from "./DashboardPagePat";
import ResultsPage from "./ResultsPage";
import ResultsPagePat from "./ResultsPagePat"; 
import PatientPage from "./PatientPage";
import SchedulePage from "./SchedulePage";
import HistoryDataPage from "./HistoryDataPage";


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginPageDoc"
          component={LoginPageDoc}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginPagePat"
          component={LoginPagePat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignupPagePat"
          component={SignupPagePat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardPage}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="DashboardPagePat"
          component={DashboardPagePat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Schedule"
          component={SchedulePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Patient"
          component={PatientPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResultsPagePat" 
          component={ResultsPagePat}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="HistoryData"
          component={HistoryDataPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
