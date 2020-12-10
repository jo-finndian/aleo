import React, {useEffect, useState} from "react";
import { Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from "firebase";

export default function Home( { navigation } ) {
  const [userInfo, setUserInfo] = useState();

  const getUserData = (uid) => {
    const docRef = firebase.firestore().collection("Users").doc(uid);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        const userData = doc.data();
        setUserInfo(userData);
      } else {
        console.log("no user data");
      }
    });
  };

  console.log(userInfo)

  // checks if user is currently logged in, and passes uid to getUserData
  useEffect(() => {
    const isFocused = navigation.addListener("focus", () => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          getUserData(user.uid);
        } else {
          setUserInfo(null);
          navigation.navigate("Login");
        }
      });
    });
    return isFocused;

  }, [userInfo, navigation]);


  return (
    <View style={styles.mainContainer}>

    <View style={styles.innerContainer}>
      <View style={[styles.card, styles.topCard]}>
        <Text style={styles.h1}>Jenny</Text>
        <View style={styles.imgContainer}>
          <Image source={require('../assets/images/purse.png')} style={styles.img} />
        </View>
        <View style={styles.innerCardText}>
          <View style={styles.statusRow}>
            <Image source={require('../assets/images/battery.png')} style={styles.icon} />
            <Text style={styles.text}>70%</Text>
          </View>
          <View style={styles.statusRow}>
            <Image source={require('../assets/images/pin.png')} style={styles.icon} />
            <Text style={styles.text}>1 km away  |  2 min ago</Text>
          </View>
          <View style={styles.statusRow}>
            <Image source={require('../assets/images/bell.png')} style={styles.icon} />
            <Text style={styles.text}>Notificatitons Disabled</Text>
          </View>
        </View>
      </View>

      <View style={{borderColor: 'rgba(255, 240, 227, 0.2)', height: 1, borderWidth: 1, width: '100%'}} />
    </View>

    <View style={{flexDirection:'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      <TouchableOpacity 
        onPress={() => {
          navigation.navigate("Interior Lighting Settings");
        }}
        style={[styles.halfCard, styles.firstCard]}>
        <Image source={require('../assets/images/lightbulb.png')} style={styles.cardIcon} />
        <Text style={[styles.h3, styles.h3Half]}>Interior Light</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.halfCard]}
        onPress={() => {
          navigation.navigate("Notification Light Settings");
        }}>
        {/* <MaterialCommunityIcons name="bell" size={42} color="#486C50"/> */}
        <Image source={require('../assets/images/lgBell.png')} style={styles.cardIcon} />
        <Text style={[styles.h3, styles.h3Half]}>Notification Light</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.wideCard]}
        onPress={() => {
          navigation.navigate("Emergency Contacts");
        }}>
        <Image source={require('../assets/images/contacts.png')} style={styles.cardIconWide}/>
        <Text style={[styles.h3, styles.h3Wide]}>Emergency Contacts</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
}

const styles = EStyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '$primeGreen',
    paddingTop: 36,
  },
  innerContainer: {
    width: "100%",
  },
  card: {
    paddingHorizontal: Dimensions.get('window').width * 0.08,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 40,
    height: "auto",
  },
  halfCard: {
    width: Dimensions.get('window').width * 0.395,
    height: Dimensions.get('window').height * .2,
    marginTop: Dimensions.get('window').height * 0.06,
    marginBottom: 17,
    justifyContent: "center",
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '$compYellow',
    borderRadius: '$borderRad',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  wideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: (Dimensions.get('window').width * (0.395*2)) + (Dimensions.get('window').width * 0.04),
    height: Dimensions.get('window').height * .1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '$compYellow',
    borderRadius: '$borderRad',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  firstCard: {
    marginRight: Dimensions.get('window').width * 0.04,
  },
  topCard: {
    width: "100%",
  },
  innerCardText: {
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginHorizontal: 20,
  },
  statusRow: {
    flexDirection: 'row',
    paddingBottom: 5,
    alignItems: 'center',
  },
  link: {
    marginTop: 10,
    fontSize: 15,
    color: 'green',
    textAlign: 'center',
    textDecorationLine: "underline",
  },
  h1: {
    fontSize: 30,
    color: '$brandColor',
    width: "100%",
    textAlign: 'center',
    marginBottom: 45,
  },
  h3: {
    fontSize: 12,
    color: '$primeGreen',
    textAlign: 'center',
  },
  h3Half: {
    paddingTop: 23,
  },
  h3Wide: {
    fontSize: 12,
    color: '$primeGreen',
    textAlign: 'center',
    paddingLeft: 22,
  },
  text: {
    fontSize: 14,
    color: '$brandColor',
    paddingLeft: 10,
  },
  btn: {
    backgroundColor: "darkgreen",
    borderRadius: 40,
    marginBottom: 10,
    padding: 20,
    width: 300,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  imgContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '$secGreen',
    alignItems: 'center',
  },
  img: { 
    width: 45,
    resizeMode: "contain", 
    height: 100,
  },
  cardIcon: {
    width: 45,
    height: 45,
    resizeMode: "contain", 
  },
  cardIconWide: {
    width: 30,
    resizeMode: "contain", 
  },
  icon: {
    width: 13, 
    height: 10, 
    resizeMode: "contain",
  },
});
