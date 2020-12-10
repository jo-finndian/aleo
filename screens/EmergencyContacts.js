import React, {useState, useEffect} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView
} from "react-native";
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
import firebase from "firebase";
import "@firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';

const ERContacts = ({ navigation }) => {
  const [contacts, setContactList] = useState([]);
  const [loading, setLoading] = useState();

  var user = firebase.auth().currentUser;

  const getContactData = (user) => {
    var docRef = firebase.firestore().collection("Users").doc(user).collection("EmergencyContacts");
    docRef.get().then(function(querySnapshot) {
      var list = [];
      
      querySnapshot.forEach(function(doc) {
        console.log(doc.id, " => ", doc.data());
        list.push([doc.id, doc.data()]);
      })
      console.log(list);
      setContactList(list);
      
      setTimeout(() => {
        setLoading(false);
      }, 600);
    });
  }

  const deleteContact = (contact) => {
    var docRef = firebase.firestore().collection("Users").doc(user.uid).collection("EmergencyContacts").doc(contact);

    docRef
      .delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });

      getContactData(user.uid);
  }

  // const updateContact = () => {
  //   console.log('updated')
  // }
  
  const deleteAlert = (contact) => {
    Alert.alert(
      "Remove Contact",
      `Do you want to delete ${contact[1].name} from your contacts?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: () => deleteContact(contact[0]) }
      ],
      { cancelable: false }
    );
  }

  // imports contacts successfully, but creating a contact list viewer was not within the scope of this project
  // should we continue developing this prject next semester, this will be completed
  async function importContact() {
    const { data } = await Contacts.getContactsAsync({
    });
    
    if (data.length > 0) {
      const contact = data[0];
      console.log(data);
    }
    
  }

  async function sendSMS() {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
      // do your SMS stuff here
        ['0123456789'], // phone number(s)
        'Hi, I\'m not feeling safe. Can you call me please?', // message
        {
          attachments: {
            // add attachments here
            // uri: 'path/myfile.png',
            // mimeType: 'image/png',
            // filename: 'myfile.png',
          },
        }
      );
      console.log('sms available')
    } else {
      // misfortune... there's no SMS available on this device
      console.log('sms not avialable')
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const isFocused = navigation.addListener("focus", () => {
      setLoading(true);
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          getContactData(user.uid);
        } else {
          setLoading(false);
        }
      });
    });

    return isFocused;
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#D6AF5F" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your emergency contacts will only be notified only when you safety mode detects that you are in danger.</Text>
      
      <ScrollView >
        {contacts.map((contact, i) => (
          <View key={i} style={[styles.contactCard, styles.row]}>
            <View style={styles.column}>
              <Text style={styles.noteName}>{contact[1].name}</Text>
              <Text style={styles.noteText}>{contact[1].relationship}</Text>
              <Text style={styles.noteText}>{contact[1].phone}</Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={()=>{deleteAlert(contact)}}>
                <MaterialIcons name="delete" size={24} color="#0D3416" style={{marginRight: 15}}/>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={updateContact}>
                <MaterialIcons name="mode-edit" size={24} color="#0D3416" />
              </TouchableOpacity> */}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.section}>
        <TouchableOpacity
        style={[styles.button, styles.buttonFill, styles.row]}
          onPress={sendSMS}
        >
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={[styles.button, styles.buttonFill, styles.row]}
          onPress={importContact}
        >
          <Text style={styles.buttonText}>Import From Contacts</Text>
          <Image source={require('../assets/images/export.png')} style={styles.icon}></Image>
        </TouchableOpacity>
        <TouchableOpacity
        style={[styles.button, styles.buttonFill]}
          onPress={() => {
            navigation.navigate("AddContacts");
          }}
        >
          <Text style={styles.buttonText}>Add +</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ERContacts;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$primeGreen',
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  flatList: {
    width: '100%',
    borderColor: 'red',
    borderWidth: 1,
    marginBottom: 170,
  },
  section: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 30,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '$primeGreen'
  },
  column: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  contactCard: {
    backgroundColor: '$compYellow',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginVertical: 10,
    borderRadius: 4,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginHorizontal: 30,
    marginTop: 20,
    height: 50,
    justifyContent:'center',
    alignSelf: 'center',
    borderRadius: '$borderRad',
  },
  buttonFill: {
      backgroundColor: '$compYellow',
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    color: '$primeGreen',
    fontWeight: "500",
    alignSelf: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    resizeMode: "contain", 
    paddingHorizontal: 16,
  },
  noteName: {
    fontSize: 18,
    fontWeight: '800',
    color: '$primeGreen',
  },
  noteText: {
    // paddingTop: 10,
    fontSize: 14,
    color: '$primeGreen',
  },
  text: {
    fontWeight: '300',
    fontStyle: 'italic',
    fontSize: 14,
    textAlign: 'center',
    color: '$compYellow',
    marginBottom: 20,
  },
});
