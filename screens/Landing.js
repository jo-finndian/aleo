import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from "firebase";

const Landing  = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState();

  const getUserData = (uid) => {
    const docRef = firebase.firestore().collection("Users").doc(uid);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        const userData = doc.data();
        setUserInfo(userData);
        console.log("user found")
        console.log(userInfo)
      } else {
        console.log("no user data");
      }
    });
  };

  // checks if user is currently logged in, and passes uid to getUserData
  useEffect(() => {
    const isFocused = navigation.addListener("focus", () => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          getUserData(user.uid);
          navigation.navigate("Home")
        } else {
          setUserInfo(null);
        }
      });
    });
    return isFocused;

  }, [userInfo, navigation]);


    return(
    <View style={styles.container}>
        <Text style={styles.title}>Aleo</Text>
        <TouchableOpacity style={[styles.button, styles.buttonFill]} onPress={()=>{navigation.navigate('Login')}}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonOutline, styles.buttonLast, styles.button]} onPress={()=>{navigation.navigate('Signup')}}>
            <Text style={styles.buttonText2}>Sign Up</Text>
        </TouchableOpacity>
    </View>
    )

}

export default Landing;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "$primeGreen",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    color: '$brandColor',
  },
  input: {
    backgroundColor: "$offWhite",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginBottom: 20,
    height: 50,
  },
  button: {
    width: '100%',
    marginHorizontal: 30,
    marginBottom: 10,
    height: 50,
    justifyContent:'center',
    alignSelf: 'center',
    bottom: 0,
    borderRadius: '$borderRad',
  },
  buttonFill: {
    backgroundColor: '$compYellow',
  },
  buttonText: {
    textAlign: "center",
    color: "$primeGreen",
    fontWeight: "700",
  },
  buttonText2: {
    textAlign: "center",
    color: "$compYellow",
    fontWeight: "700",
  },
  buttonOutline: {
    borderColor: '$compYellow',
    borderWidth: 2,
  },
});