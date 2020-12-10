import React from "react";
import { Alert } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';


export default function CustomAlert( props ) {
  createTwoButtonAlert = () =>
  Alert.alert(
    "Alert Title",
    props,
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ],
    { cancelable: false }
  );
}