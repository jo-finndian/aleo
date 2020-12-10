import React, { useState, useEffect } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Entypo } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "firebase";
import "@firebase/firestore";

import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Location from "./screens/Location";
import Landing from './screens/Landing';
import OnboardingScreen from './screens/OnboardingScreen';
import EmergencyContacts from './screens/EmergencyContacts';
import IntLightingSettings from "./screens/IntLightSettings";
import NotifLightSettings from "./screens/NotifLightSettings";
import Verify from "./screens/Verify";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import AddContacts from "./screens/AddContact";

EStyleSheet.build({ // always call EStyleSheet.build() even if you don't use global variables!
  $brandColor: '#D6AF5F',
  $compYellow: '#D0BC92',
  $primeGreen: '#0D3416',
  $secGreen: '#486C50',
  $offWhite: '#FFF0E3',
  $borderRad: 4,
});

  // FIREBASE
  const firebaseConfig = {
    apiKey: "AIzaSyB8JuBeYg89lGZjgBLxFp6x90CGIsaghU0",
    authDomain: "smannila-7be39.firebaseapp.com",
    databaseURL: "https://smannila-7be39.firebaseio.com",
    projectId: "smannila-7be39",
    storageBucket: "smannila-7be39.appspot.com",
    messagingSenderId: "259311576564",
    appId: "1:259311576564:web:7fc11b29038d6f8d4b05a1",
    measurementId: "G-X7P36WMSDN"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const AppStack = createStackNavigator();
  const TabStack = createBottomTabNavigator();

const HomeStackNavigator = () => { //Import the other screens you use!
    return(
     <AppStack.Navigator>
      <AppStack.Screen name="Home" component={BottomTabNavigator} 
        options={{
          headerShown: false
        }}/>
      <AppStack.Screen
        name="Interior Lighting Settings"
        component={IntLightingSettings} 
        options={{
          title: 'Interior Light',
          headerStyle: {
            backgroundColor: '#0D3416',
            height: 160,
            shadowColor: 'transparent',
          },
          headerTintColor: '#0D3416',
          headerLeftContainerStyle: {
            backgroundColor: '#D0BC92',
            borderRadius: 30,
            height: 30,
            width: 30,
            marginLeft: 10,
          },
          headerBackTitleVisible: false,
          headerTitleStyle: {
            marginTop: 80,
            fontWeight: '400',
            fontSize: 30,
            color: '#D6AF5F',
          },
        }} />
      <AppStack.Screen
        name="Notification Light Settings"
        component={NotifLightSettings} 
        options={{
          title: 'Notification Lights',
          headerStyle: {
            backgroundColor: '#0D3416',
            height: 160,
            shadowColor: 'transparent',
          },
          headerTintColor: '#0D3416',
          headerLeftContainerStyle: {
            backgroundColor: '#D0BC92',
            borderRadius: 30,
            height: 30,
            width: 30,
            marginLeft: 10,
          },
          headerBackTitleVisible: false,
          headerTitleStyle: {
            marginTop: 80,
            fontWeight: '400',
            fontSize: 30,
            color: '#D6AF5F',
          },
        }} />
      <AppStack.Screen
        name="Emergency Contacts"
        component={EmergencyContacts} 
        options={{
          title: 'Emergency Contacts',
          headerStyle: {
            backgroundColor: '#0D3416',
            height: 160,
            shadowColor: 'transparent',
          },
          headerTintColor: '#0D3416',
          headerLeftContainerStyle: {
            backgroundColor: '#D0BC92',
            borderRadius: 30,
            height: 30,
            width: 30,
            marginLeft: 10,
          },
          headerBackTitleVisible: false,
          headerTitleStyle: {
            marginTop: 80,
            fontWeight: '400',
            fontSize: 30,
            color: '#D6AF5F',
          },
        }} />
      <AppStack.Screen
       name="AddContacts"
       component={AddContacts} 
       options={{
         title: 'New Contact',
         headerStyle: {
           backgroundColor: '#0D3416',
           height: 160,
           shadowColor: 'transparent',
         },
         headerTintColor: '#0D3416',
         headerLeftContainerStyle: {
           backgroundColor: '#D0BC92',
           borderRadius: 30,
           height: 30,
           width: 30,
           marginLeft: 10,
         },
         headerBackTitleVisible: false,
         headerTitleStyle: {
           marginTop: 80,
           fontWeight: '400',
           fontSize: 30,
           color: '#D6AF5F',
         },
       }} />
     </AppStack.Navigator>
  )
}

const BottomTabNavigator = () => {
  return (
    <TabStack.Navigator
      backBehavior='history'
      tabBarOptions={{
        showLabel: true,
        labelStyle: {
          paddingTop: 2,
          fontSize: 12,
          paddingBottom: 15,
        },
        tabStyle: {
          paddingTop: 10,
          borderWidth: 0,
        },
        activeTintColor: "#0D3416",
        activeBackgroundColor: "#D0BC92",
        inactiveTintColor: "#D0BC92",
        style: {
          backgroundColor: '#486C50',
          paddingBottom: 0,
          height: 60,
        }
      }}
    >
      <TabStack.Screen name="Home" component={Home} 
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ focused }) => (
          <Entypo name="home" size={16} color={focused ? "#0D3416" : "#D0BC92"} />
        ),
      }}/>

      <TabStack.Screen name="Location" component={Location}
      options={{
        tabBarLabel: "Location",
        tabBarIcon: ({ focused }) => (
          <Entypo name="location-pin" size={16} color={focused ? "#0D3416" : "#D0BC92"} />
        ),
      }}/>

      <TabStack.Screen name="Settings" component={Settings} 
      options={{
        tabBarLabel: "Settings",
        tabBarIcon: ({ focused }) => (
          <Ionicons name="ios-settings" size={16} color={focused ? "#0D3416" : "#D0BC92"} />
        ),
      }}/>
    </TabStack.Navigator>
  );
};

const App = () => {
  const [isFirstLaunched, setIsFirstLaunched] = useState(null);
  
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if(value == null) {
        AsyncStorage.removeItem("alreadyLaunched");
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunched(true);
      }
      else {
        setIsFirstLaunched(false); //change to FALSE when live`
      }
    });
  }, []);

  console.log(isFirstLaunched);

  if( isFirstLaunched == null) {
    return null;
  }
  else if ( isFirstLaunched == true ) {
    return (
      <NavigationContainer>
        <AppStack.Navigator
          headerMode="none"
          >
            <AppStack.Screen name="Landing" component={Landing} />
            <AppStack.Screen name="Login" component={Login} />
            <AppStack.Screen name="Signup" component={Signup} />
            <AppStack.Screen name="Onboarding" component={OnboardingScreen} />
            <AppStack.Screen name="Verify" component={Verify} />
            <AppStack.Screen name="Home" component={HomeStackNavigator} />
        </AppStack.Navigator>

      </NavigationContainer>
    );
  }
  else {
    return (
      <NavigationContainer>
      <AppStack.Navigator
        headerMode="none"
        initialRouteName="Landing"
        >
          <AppStack.Screen name="Landing" component={Landing} />
          <AppStack.Screen name="Login" component={Login} />
          <AppStack.Screen name="Signup" component={Signup} />
          <AppStack.Screen name="Verify" component={Verify} />
          <AppStack.Screen name="Home" component={HomeStackNavigator} />
        </AppStack.Navigator>
    </NavigationContainer>
    )
  }
};

export default App;