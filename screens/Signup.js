import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase";

const Signup = ({ navigation }) => {
  const [isFirstLaunched, setIsFirstLaunched] = useState(null);
  
  async function fetchInfo() {
    const isFirstLaunch = await AsyncStorage.getItem("alreadyLaunched");

    if (isFirstLaunch == "true") {
      setIsFirstLaunched(true);
    }
    console.log("first launch = " + isFirstLaunch);
  }
  fetchInfo();

  const [profileInfo, setProfileInfo] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    password2: "",
  });

  const [emergencyContact, setEmergencyContact] = useState({
    first: "",
    last: "",
    phone: "",
    relationship: "",
  });

  const onChangeTextFirst = (name) => {
    setProfileInfo({
      ...profileInfo,
      name,
    });
  };
  const onChangeTextEmail = (email) => {
    setProfileInfo({
      ...profileInfo,
      email,
    });
  };
  const onChangeTextPassword = (password) => {
    setProfileInfo({
      ...profileInfo,
      password,
    });
  };
  const onChangeTextPassword2 = (password2) => {
    setProfileInfo({
      ...profileInfo,
      password2,
    });
  };
  
  const createAccount = () => {
    if ( profileInfo.password === profileInfo.password2 ) {
      return new Promise(() => {
        firebase
        .auth()
        .createUserWithEmailAndPassword(profileInfo.email, profileInfo.password)
        .then((res) => {
          firebase
          .firestore()
          .collection("Users")
          .doc(res.user.uid)
          .set({
            uid: res.user.uid,
            email: res.user.email,
            firstName: profileInfo.first,
            lastName: profileInfo.last,
          })
          .then(() => {
            console.log("User successfully created!");
            if ( isFirstLaunched == true  ) {
              navigation.navigate("Onboarding");
            }
            else {
              navigation.navigate("Home");
            }
          })
          .catch((err) => {
            console.log(err);
            alert("Create account failed, Error:" + err.message);
          });
        })
        .catch((err) => alert(err.message));
      });
    }
    else {
      Alert.alert('Passwords do not match.')
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        autoCapitalize="none"
        value={profileInfo.name}
        onChangeText={onChangeTextFirst}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={profileInfo.email}
        onChangeText={onChangeTextEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={profileInfo.password}
        secureTextEntry
        onChangeText={onChangeTextPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Re-type password"
        value={profileInfo.password2}
        secureTextEntry
        onChangeText={onChangeTextPassword2}
      />
      
      <TouchableOpacity style={styles.button} onPress={createAccount}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => { navigation.navigate("Login");}}
      >
        <Text style={styles.buttonText2}>Go to login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

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
    backgroundColor: '$compYellow',
  },
  buttonText: {
    textAlign: "center",
    color: "$primeGreen",
    fontWeight: "700",
  },
  buttonText2: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});