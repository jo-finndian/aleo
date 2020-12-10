import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, } from "react-native";
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
import { Ionicons } from '@expo/vector-icons'; 
import firebase from "firebase";
import "@firebase/firestore";

const AddContact = ({ navigation }) => {
    const [enableVerify, setEnableVerify] = useState(false);
    const [phone1, setPhone1] = useState();
    const [phone2, setPhone2] = useState();
    const [verified, setVerified] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const [loading, setLoading] = useState();
    
    var num1 = '';
    var num2 = '';

    var user = firebase.auth().currentUser;

    const [newContact, setNewContact] = useState({
        name: "",
        relationship: "",
        phone: "",
      });
    
    const onChangeTextName = (name) => {
        setNewContact({
            ...newContact,
            name,
        });
    };
    const onChangeTextRel = (relationship) => {
        setNewContact({
            ...newContact,
            relationship,
        });
    };

    function onChangeTextPhone(phone) {
        setEnableVerify(true);
        num1 = formatPhoneNumber(phone);
    };
    
    function onChangeTextVerify(phone) {
        num2 = formatPhoneNumber(phone);  
        matchNumbers();
    };

    function matchNumbers() {
        if (num1 === num2) {
            console.log("match")
            setPhone1(num1);
            setPhone2(num2);
            setVerified(true);
            setContact(num1);
        }
        else {
            setVerified(false);
        }
    }
    
    function setContact(phone) {
        setNewContact({
            ...newContact,
            phone,
        });
    }

    function formatPhoneNumber(phone) {
        var cleaned = ('' + phone).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        console.log("Cleaned" + cleaned)
        
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }
        cleaned ='';
        match = '';
        
        return null
    }

    const contactHandler = () => {
        const docRef = firebase.firestore().collection("Users").doc(user.uid).collection("EmergencyContacts");

        docRef.add({
            name: newContact.name,
            relationship: newContact.relationship,
            phone: newContact.phone
        })
        .then(function() {
            console.log("Document updated successfully");
        })
        .catch(function(error) {
            console.log(err)
            alert("Error updateding name: " + error.message)
        })
    }

return (
    // <KeyboardAvoidingView style={styles.keyboard} behavior="position" enabled>
        <View style={styles.container}>
                <View style={styles.card}>
                    <View style={[styles.column]}>
                        <Text style={[styles.h2, styles.sectionTop]}>What's their first name?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor="rgba(255,240,227,0.5)"
                            autoCapitalize="none"
                            value={newContact.name}
                            onChangeText={onChangeTextName}
                            keyboardType={'email-address'}
                        />
                    </View>
                    <View style={[styles.column]}>
                        <Text style={[styles.h2, styles.sectionTop]}>What's your relationship to them?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="ie. Best Friend"
                            placeholderTextColor="rgba(255,240,227,0.5)"
                            autoCapitalize="none"
                            value={newContact.relationship}
                            onChangeText={onChangeTextRel}
                        />
                    </View>
                    <View style={[styles.column]}>
                        <Text style={styles.h2}>What's their phone number?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone"
                            placeholderTextColor="rgba(255,240,227,0.5)"
                            value={phone1}
                            keyboardType={'phone-pad'}
                            onChangeText={onChangeTextPhone}
                        />
                    </View>
                    <View style={!enableVerify ? {display:'none'} : [styles.column, styles.sectionVerify]}>
                        <Text style={styles.h2}>Verify their phone number?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Verify phone number"
                            placeholderTextColor="rgba(255,240,227,0.5)"
                            value={phone2}
                            keyboardType={'phone-pad'}
                            onChangeText={onChangeTextVerify}
                        />
                        <Text style={verified ? styles.alert : {display:'none'}}><Ionicons name="ios-checkmark-circle" size={24} color="black" /> Numbers Match</Text>
                        <Text style={!verified ? styles.alert : {display:'none'}}>Numbers do not Match</Text>
                    </View>
                    
                    <TouchableOpacity
                        style={!enableVerify ? {display:'none'} :[styles.button, styles.buttonFill]}
                        onPress={contactHandler}>
                        <Text style={styles.buttonText}>Save Contact</Text>
                    </TouchableOpacity>
                </View>
        </View>
    // </KeyboardAvoidingView>
)
}

export default AddContact;

const styles = EStyleSheet.create({
    keyboard: {
        position: "absolute",
        width: "100%",
    },
    container: {
        flex: 1,
        paddingTop: 70,
        backgroundColor: '$primeGreen',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: 'center',
    },
    card: {
        // flex: 1,
        height: '100%',
        width: Dimensions.get('window').width * .82,
    },
    column: {
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    row: {
        flexDirection: 'row',
    },
    innerRow: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    column: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    sectionTop: {
        marginTop: 0,
    },
    sectionVerify: {
        marginTop: 50,
    },
    h2: {
        fontSize: 18,
        color: '$compYellow',
        textAlign: 'center',
        marginTop: 35,
        marginBottom: 15,
    },
    input: {
        backgroundColor: '$secGreen',
        width: '100%',
        height: 40,
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        borderRadius: '$borderRad',
        borderBottomColor: 'white',
        borderBottomWidth: 1,
    },
    button: {
        width: '100%',
        marginHorizontal: 30,
        marginTop: 50,
        position: 'absolute',
        height: 50,
        justifyContent:'center',
        alignSelf: 'center',
        bottom: 50,
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
    },
});