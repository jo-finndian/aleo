import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  Switch,
  LayoutAnimation,
  ScrollView,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Icon from "react-native-vector-icons/MaterialIcons";
import firebase from "firebase";

export default function Settings({ navigation }) {
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState();
  const [notifExpanded, setNotifExpanded] = useState(false);
  const [safeExpanded, setSafeExpanded] = useState(false);
  const [accountExpanded, setAccountExpanded] = useState(false);
  const [supportExpanded, setSupportExpanded] = useState(false);
  const [reactionTime, setReactionTime] = useState();

  const [locationEnabled, setLocationEnable] = useState(false);
  const [notificationsEnabled, setNotificationsEnable] = useState();
  const [phoneNotifEnabled, setPhoneNotifEnable] = useState();
  const [textNotifEnabled, setTextNotifEnable] = useState();
  const [iCalNotifEnabled, setiCalNotifEnable] = useState();
  const [safeModeEnabled, setSafeMode] = useState();
  const [editAccount, setEditAccount] = useState(true);

  const editAccountEnabled = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEditAccount(previousState => !previousState);
    console.log(editAccount)
  }
  const toggleNotifExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNotifExpanded(previousState => !previousState)
  }
  const toggleSafeExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSafeExpanded(previousState => !previousState)
  }
  const toggleAccountExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAccountExpanded(previousState => !previousState)
  }
  const toggleSupportExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSupportExpanded(previousState => !previousState)
  }

  const toggleLocation = () => {
    setLocationEnable(!locationEnabled)
    var l= JSON.stringify(!locationEnabled);
    updateAsyncStorage("location-enabled", l);
  }
  const toggleNotifications = () => {
    setNotificationsEnable(!notificationsEnabled)
    var n = JSON.stringify(!notificationsEnabled);
    updateAsyncStorage("notifications", n);
  }
  const togglePhoneNotif = () => {
    setPhoneNotifEnable(!phoneNotifEnabled);
    var p = JSON.stringify(!phoneNotifEnabled);
    updateAsyncStorage("phone-notif", p);
  }
  const toggleTextNotif = () => {
    setTextNotifEnable(!textNotifEnabled);
    var t = JSON.stringify(!textNotifEnabled);
    updateAsyncStorage("text-notif", t);
  }
  const toggleiCalNotif = () => {
    setiCalNotifEnable(!iCalNotifEnabled);
    var i = JSON.stringify(!iCalNotifEnabled);
    updateAsyncStorage("ical-notif", i);
  }
  const toggleSafeMode = () => {
    setSafeMode(!safeModeEnabled);
    var s = JSON.stringify(!safeModeEnabled);
    updateAsyncStorage("safe-mode", s);
  }
  const onChangeReactionTime = (time) => {
    setReactionTime(time);
    updateAsyncStorage("time", time);
  };

  var user = firebase.auth().currentUser;

  const getUserData = (uid) => {
    const docRef = firebase.firestore().collection("Users").doc(uid);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        const userData = doc.data();
        setUserInfo(userData);

        setTimeout(() => {
          setLoading(false);
        }, 600);

      } else {
        setLoading(false);
        console.log("no user data");
      }
    });
  };

  // checks if user is currentl8y logged in, and passes uid to getUserData
  useEffect(() => {
    const isFocused = navigation.addListener("focus", () => {
      setLoading(true);
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          getUserData(user.uid);
        } else {
          setUserInfo(null);
          setLoading(false);
          // navigation.navigate("Login");
        }
      });
    });
    return isFocused;

  }, [userInfo, loading, navigation]);

  // ASYNC STORAGE FUNCTION
  function updateAsyncStorage(item, value) {
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.removeItem(`${item}`);

        await AsyncStorage.setItem(`${item}`, value);
        
        console.log(`${item}` + " async updated successfully: " + value);
        return resolve(true);
      } catch (e) {
        return reject(e);
      } 
    }); 
  };
  
  // FETCH ASYNC STORAGE FUNCTION
  async function fetchInfo() {
    const loc = await AsyncStorage.getItem("location-enabled");
    const notif = await AsyncStorage.getItem("notifications");
    const phone = await AsyncStorage.getItem("phone-notif");
    const text = await AsyncStorage.getItem("text-notif");
    const iCal = await AsyncStorage.getItem("ical-notif");
    const safe = await AsyncStorage.getItem("safe-mode");
    const time = await AsyncStorage.getItem("time");

    if (loc && notif && phone && text && iCal && safe && time) {
      formatSettings(loc, notif, phone, text, iCal, safe, time);
    }
  }

  function formatSettings(l, n, p, txt, i, s, t) {
    // t = t.replace(/"/g, '');

    // t = parseInt(t, 10);
    l = Boolean(l);
    n = Boolean(n);
    p = Boolean(p);
    txt = Boolean(txt);
    i = Boolean(i);
    s = Boolean(s);
    console.log("reaction: " + t)
    setReactionTime(t)
    setLocationEnable(l);
    setNotificationsEnable(n);
    setPhoneNotifEnable(p);
    setTextNotifEnable(txt);
    setiCalNotifEnable(i);
    setSafeMode(s);
}

  const updateUserData = () => {
    const docRef = firebase.firestore().collection("Users").doc(user.uid);
    
    if (changeUserPassword.password == '') {
      alert('Please enter your password to make these changes.')
    }
    else {
      
      if (changeUserEmail.email != '') {
        user.updateEmail(changeUserEmail.email).then(function() {
          // Update successful.
          console.log("User email updated");
        }).catch(function(error) {
          // An error happened.
          console.log("Error: email not updated : " + error);
        });
      }
  
      user.updatePassword(changeUserPassword.password).then(function() {
        // Update successful.
        console.log("Password updated");
      }).catch(function(error) {
        // An error happened.
        console.log("Error: password not updated : " + error);
      });
      
      if (changeUserName.name != ''){
        docRef.update({
          name: changeUserName.name,
        })
        .then(function() {
          console.log("Document updated successfully");
        })
        .catch(function(error) {
          console.log(err)
          alert("Error updateding name: " + error.message)
        })
      }

      if (changeUserEmail != '') {
        docRef.update({
          email: changeUserEmail.email,
        })
        .then(function() {
          console.log("Document updated successfully");
        })
        .catch(function(error) {
          console.log(err)
          alert("Error updateding username: " + error.message)
        })
      }

      if (changeUserPhone.phone != ''){
        docRef.update({
          phone: changeUserPhone.phone,
        })
        .then(function() {
          console.log("Document updated successfully");
        })
        .catch(function(error) {
          console.log(err)
          alert("Error updateding username: " + error.message)
        })
      }
    }
  }

  const [changeUserEmail, setUserEmail] = useState({
    email: "",
  });

  const [changeUserPassword, setUserPassword] = useState({
    password: "",
  });

  const [changeUserName, setUserName] = useState({
    name: "",
  });

  const [changeUserPhone, setUserPhone] = useState({
    phone: "",
  });

  const onChangeTextEmail = (email) => {
    setUserEmail({
      ...changeUserEmail,
      email,
    });
  };
  const onChangeTextPassword = (password) => {
    setUserPassword({
      ...changeUserPassword,
      password,
    });
  };
  const onChangeTextName = (name) => {
    setUserName({
      ...changeUserName,
      name,
    });
  };
  const onChangeTextPhone = (phone) => {
    setUserPhone({
      ...changeUserPhone,
      phone,
    });
  };
  
  function connectPurse() {
    console.log("connecting purse");
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  // controls loading spinner
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="darkslateblue" />
      </View>
    );
  }
  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text>User not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column', paddingBottom: 100,}}>
        <View style={styles.innerContainer}>
          <Image source={require('../assets/images/tab.png')} style={{position: 'absolute', left: 0, top: 5, height: 26}} />
          <Text style={styles.h1}>Settings</Text>
          <View style={styles.column}>
          <View style={[styles.row, styles.rowTop]}>
            <Text style={[styles.h2, styles.noArrow]}>Location</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#5e5e5e", true: '#D6AF5F' }}
              thumbColor={'#FFF0E3'}
              ios_backgroundColor="#5e5e5e"
              onValueChange={toggleLocation}
              value={locationEnabled}
            />
          </View>

          <View style={[styles.row, styles.rowTop]}>
              <TouchableOpacity onPress={toggleNotifExpand}>
                <Icon name={!notifExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#D0BC92'} />
              </TouchableOpacity>
              <Text style={styles.h2}>Notifications</Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: "#5e5e5e", true: '#D6AF5F' }}
                thumbColor={"#FFF0E3"}
                ios_backgroundColor="#5e5e5e"
                onValueChange={toggleNotifications}
                value={notificationsEnabled}
              />
          </View>
          <View style={notifExpanded ? styles.row : styles.hidden} />
          {
            notifExpanded &&
            <View>
              <View style={[styles.row]}>
                <Text style={[styles.notif]}>Phone Calls</Text>
                <Switch
                  style={styles.switch}
                  trackColor={{ false: "#5e5e5e", true: '#D6AF5F' }}
                  thumbColor={"#FFF0E3"}
                  ios_backgroundColor="#5e5e5e"
                  onValueChange={togglePhoneNotif}
                  value={phoneNotifEnabled}
                  disabled={!notificationsEnabled}
                />
              </View>
              <View style={[styles.row]}>
                <Text style={[styles.notif]}>Text Messages</Text>
                <Switch
                  style={styles.switch}
                  trackColor={{ false: "#5e5e5e", true: '#D6AF5F' }}
                  thumbColor={"#FFF0E3"}
                  ios_backgroundColor="#5e5e5e"
                  onValueChange={toggleTextNotif}
                  value={textNotifEnabled}
                  disabled={!notificationsEnabled}
                />
              </View>
              <View style={[styles.row]}>
                <Text style={[styles.notif, styles.notifLast]}>iCal Events</Text>
                <Switch
                  style={styles.switch}
                  trackColor={{ false: "#5e5e5e", true: '#D6AF5F' }}
                  thumbColor={"#FFF0E3"}
                  ios_backgroundColor="#5e5e5e"
                  onValueChange={toggleiCalNotif}
                  value={iCalNotifEnabled}
                  disabled={!notificationsEnabled}
                />
              </View>
            </View>
          }

          <View style={[styles.row, styles.rowTop]}>
            <TouchableOpacity onPress={toggleSafeExpand}>
              <Icon name={!safeExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#D0BC92'} />
            </TouchableOpacity>
            <Text style={styles.h2}>Safe Mode</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#5e5e5e", true: '#D6AF5F' }}
              thumbColor={"#FFF0E3"}
              ios_backgroundColor="#5e5e5e"
              onValueChange={toggleSafeMode}
              value={safeModeEnabled}
            />
          </View>
          <View style={safeExpanded ? styles.row : styles.hidden} />
          {
            safeExpanded &&
            <View>
              <View style={[styles.row]}>
                <Text style={[styles.notif, styles.notifLast]}>Reaction Time</Text>
                <TextInput
                  placeholder={reactionTime}
                  value={reactionTime}
                  onChangeText={onChangeReactionTime}
                  placeholderTextColor={!safeModeEnabled ? 'grey' : '#D0BC92'}
                  editable={safeModeEnabled}
                  maxLength={2}
                  style={[styles.notifLast, styles.inputSm]}
                  keyboardType={"number-pad"}
                />
              </View>
            </View>
          }

          <View style={[styles.row, styles.rowTop]}>
            <TouchableOpacity onPress={toggleAccountExpand}>
              <Icon name={!accountExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#D0BC92'} />
            </TouchableOpacity>
            <Text style={styles.h2}>Account Info</Text>
            <TouchableOpacity onPress={editAccountEnabled}>
              <MaterialCommunityIcons name="dots-vertical" size={24} color="#D0BC92" />
            </TouchableOpacity>
          </View>
          <View style={accountExpanded ? [styles.row] : styles.hidden} />
          {
            accountExpanded &&
            <View style={styles.card}>
              <View style={styles.inputs}>
                <TextInput
                  style={!editAccount ? styles.input : [styles.input,styles.inputBg] }
                  placeholder={(userInfo.name == '') ? "Name" : userInfo.name }
                  onChangeText={onChangeTextName}
                  placeholderTextColor={"#D0BC92"}
                  editable={editAccount}
                  />
                <TextInput
                  style={!editAccount ? styles.input : [styles.input,styles.inputBg] }
                  placeholder={userInfo.email}
                  autoCapitalize="none"
                  onChangeText={onChangeTextEmail}
                  placeholderTextColor={"#D0BC92"}
                  editable={editAccount}
                  />
                <TextInput
                  style={!editAccount ? styles.input : [styles.input,styles.inputBg]}
                  placeholder={(!userInfo.phone) ? "Phone:   N/A" : userInfo.phone }
                  onChangeText={onChangeTextPhone}
                  placeholderTextColor={"#D0BC92"}
                  editable={editAccount}
                  />
                <TextInput
                  style={!editAccount ? styles.input : [styles.input,styles.inputBg] }
                  placeholder="••••••••"
                  secureTextEntry
                  onChangeText={onChangeTextPassword}
                  placeholderTextColor={"#D0BC92"}
                  editable={editAccount}
                />
                <TouchableOpacity style={!editAccount ? styles.hidden : [styles.buttonSm]} onPress={updateUserData}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          
          <View style={[styles.row, styles.rowTop]}>
            <TouchableOpacity onPress={toggleSupportExpand}>
              <Icon name={!supportExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#D0BC92'} />
            </TouchableOpacity>
            <Text style={styles.h2}>Support</Text>
          </View>
          <View style={supportExpanded ? [styles.row] : styles.hidden} />
            {
              supportExpanded &&
              <View style={styles.card}>
                <View style={styles.inputs}>
                  <Text style={[styles.notif, styles.notifLast, styles.support]}>FAQ</Text>
                  <Text style={[styles.notif, styles.support]}>24/7 Chat Support</Text>
                </View>
              </View>
            }
          </View>
        </View>
      </ScrollView>

      <View style={[styles.center]}>
        <TouchableOpacity style={[styles.button, styles.buttonFill]} onPress={connectPurse}>
          <Text style={[styles.buttonText, styles.buttonTextPrime]}>Connect Purse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonOutline, styles.button]} 
          onPress={() => {
            console.log("logout");
            firebase
            .auth()
            .signOut()
            .then(() => {
              console.log("Signout successfull!");

            })
            .catch((err) => alert(err.message));
          }}
          >
          <Text style={[styles.buttonText, styles.buttonTextAlt]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  mainContainer: {
    flex: 1,
    // alignItems: "center",
    textAlign: "center",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    paddingTop: 50,
    backgroundColor: '$primeGreen',
  },
  scrollView: {
    flexDirection: "column",
    width: '100%',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  column: {
    width: '100%',
    marginTop: 50,
    marginHorizontal: 32,
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 64,
  },
  card: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
    height: "auto",
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: "wrap",
    marginBottom: 12,
  },
  center: {
    justifyContent: 'flex-end',
    flexWrap: "wrap",
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '$primeGreen',
  },
  rowTop: {
    marginBottom: (30-12),
    borderBottomColor: 'rgba(208, 188, 146, 0.5)',
    borderBottomWidth: 1,
  },
  h2: {
    fontSize: 20,
    color: '$compYellow',
    textAlign: 'left',
    marginBottom: 10,
    paddingLeft: 10,
    flex: 1,
  },
  noArrow: {
    paddingLeft: 40,
  },
  h1: {
    color: '$brandColor',
    textAlign: 'center',
    fontSize: 30,
  },
  notif: {
    fontSize: 14,
    flex: 1,
    marginLeft: (Dimensions.get('window').width * .184) - 32,
    marginRight: 32,
    color: '$compYellow',
  },
  notifLast: {
    marginBottom: (32-12),
  },
  button: {
    width: Dimensions.get('window').width * .872,
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
  buttonOutline: {
    borderColor: '$compYellow',
    borderWidth: 2,
  },
  buttonSm: {
    borderRadius: '$borderRad',
    height: 50,
    marginTop: 10,
    justifyContent:'center',
    alignSelf: 'center',
    marginHorizontal: (Dimensions.get('window').width * .184) - 32,
    width: '75%',
    backgroundColor: "$compYellow",
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    color: '$primeGreen',
    fontWeight: "500",
  },
  buttonTextPrime: {
    color: '$primeGreen',
  },
  buttonTextAlt: {
    color: '$compYellow',
  },
  switch: {
    transform: [{ scaleX: .8 }, { scaleY: .8 }],
  },
  img: {
    width: 85,
    height: 85,
    borderWidth: 1,
    resizeMode: "contain", 
  },
  inputs: {
    flex: 1,
    width: '100%',
  },
  input: {
    marginHorizontal: (Dimensions.get('window').width * .184) - 32,
    marginBottom: 10,
  },
  inputBg: {
    backgroundColor: '$secGreen',
    padding: 10,
    borderRadius: '$borderRad',
  },
  inputSm: {
    backgroundColor: '$secGreen',
    width: 60,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: '$borderRad',
    color: '$compYellow'
  },
  hidden: {
    display: 'none',
  },
  link: {
    width: '100%',
    marginTop: 10,
    fontSize: 15,
    color: '$offWhite',
    textAlign: 'center',
    textDecorationLine: "underline",
  },

});