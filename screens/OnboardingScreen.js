import { Alert, StatusBar, View, TextInput, StyleSheet, Dimensions, Text, Image } from 'react-native';
import React, { useState, useEffect} from 'react';
import { Button, Icon } from 'react-native-elements';
import Onboarding from 'react-native-onboarding-swiper';
import { TouchableOpacity } from 'react-native-gesture-handler';

function OnboardingScreen({navigation, props}) {

    const setOnboardingRef = ref => {
        onboardingRef = ref;
    }

    const goToNextSlide = () => {
        onboardingRef.goNext();
    }

    function verifyPhone() {
        console.log("phone verify");
    }

    const [profileInfo, setProfileInfo] = useState({
        first: "",
        last: "",
        email: "",
        phone: "",
        purse_nickname: "",
    });

    const [emergencyContact, setEmergencyContact] = useState({
        first: "",
        last: "",
        phone: "",
        relationship: "",
    });

    const onChangeTextFirst = (first) => {
        setProfileInfo({
            ...profileInfo,
            first,
        });
    };
    const onChangeTextLast = (last) => {
        setProfileInfo({
            ...profileInfo,
            last,
        });
    };
    const onChangeTextEmail = (email) => {
        setProfileInfo({
            ...profileInfo,
            email,
        });
    };
    const onChangeTextPhone = (phone) => {
        setProfileInfo({
            ...profileInfo,
            phone,
        });
    };
    const onChangeTextPurseNickname = (purse_nickname) => {
        setProfileInfo({
          ...profileInfo,
          purse_nickname,
        });
    };

    const onChangeTextFirstEmergency = (first_emergency) => {
        setEmergencyContact({
            ...emergencyContact,
            first_emergency,
        });
    };
    const onChangeTextLastEmergency = (last_emergency) => {
        setEmergencyContact({
            ...emergencyContact,
            last_emergency,
        });
    };
    const onChangeTextPhoneEmergency = (phone_emergency) => {
        setEmergencyContact({
            ...emergencyContact,
            phone_emergency,
        });
    };
    const onChangeTextRelationshipEmergency = (relationship_emergency) => {
        setEmergencyContact({
            ...emergencyContact,
            relationship_emergency,
        });
    };
    
    var verifyCode = [1,2,3,4,5,6];
    // var verifyCode = "";
    var verify_sentTo = "Sent to 1-867-333-0000";
    var verify_subtitle = "Connect your phone";
    var verify_title = "Phone Number";

    return( 

        <Onboarding
            ref={setOnboardingRef}
            showDone={false}
            onSkip={() => Alert.alert('Skipped')}
            bottomBarHeight={0}
            showPagination={false}
            pages={[
                // Page 2
                {
                title:
                <View style={styles.viewTop}>
                    <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={20}
                    color="white"
                    style={{alignSelf: 'flex-start', marginLeft: 20}}
                    />
                    <Text style={styles.h1}>Connect Your Purse</Text>
                    <Text style={styles.h3}>Tap twice on the Aleo logo on your purse to pair.</Text>
                    <Text style={styles.h3}>Tip - Make sure your purse is fully charged.</Text>
                </View>
                ,
                backgroundColor: '#003c8f',
                image: <Image source={require('../assets/images/logo.png')} style={styles.img} />,
                subtitle:
                <View style={styles.viewBottom}>
                    <Icon
                        name="wifi"
                        type="font-awesome"
                        size={75}
                        color="white"
                        marginBottom={20}
                    />
                    <Text style={styles.h2}>Searching</Text>
                    <TouchableOpacity onPress={goToNextSlide}>
                        <Text style={styles.textLink}>Help</Text>
                    </TouchableOpacity>
                </View>
                },
                // Page 3
                {
                backgroundColor: '#1565c0',
                image: <Image source={require('../assets/images/logo.png')} style={styles.img} />,
                title:
                <View style={styles.viewTop}>
                    <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={20}
                    color="white"
                    style={styles.backArrow}
                    />
                    <Text style={styles.h1}>Purse Connected!</Text>
                </View>
                ,
                subtitle:
                <View style={styles.viewBottom}>
                    <Text style={styles.h2}>Give your purse a name</Text>
                    <TextInput
                        style={styles.lastInput}
                        placeholder="Purse Nickname"
                        autoCapitalize="none"
                        value={profileInfo.purse_nickname}
                        onChangeText={onChangeTextPurseNickname}
                    />
                    <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
                        <Text style={styles.btnText}>Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.textLink}>Not your purse?</Text>
                    </TouchableOpacity>
                </View>
                },
                // Page 4
                {
                backgroundColor: '#003c8f',
                // image: '',
                title:
                <View style={styles.viewTop}>
                    <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={20}
                    color="white"
                    style={styles.backArrow}
                    />
                    <Text style={styles.h1}>Tell us about you</Text>
                </View>
                ,
                subtitle: (
                    <View style={styles.formContainer}>
                        <Text style={styles.formLabel}>First Name</Text>
                        <TextInput
                        style={styles.inputForm}
                        placeholder="First"
                        autoCapitalize="none"
                        value={profileInfo.first}
                        onChangeText={onChangeTextFirst}
                        />
                        <Text style={styles.formLabel}>Last Name</Text>
                        <TextInput
                        style={styles.inputForm}
                        placeholder="Last"
                        autoCapitalize="none"
                        value={profileInfo.last}
                        onChangeText={onChangeTextLast}
                        />
                        <Text style={styles.formLabel}>Email</Text>
                        <TextInput
                        style={styles.lastInput}
                        placeholder="Email"
                        autoCapitalize="none"
                        value={profileInfo.email}
                        onChangeText={onChangeTextEmail}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
                                <Text style={styles.btnText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ),
                },
                // Page 5
                {
                backgroundColor: '#003c8f',
                // image: '',
                title:
                <View style={styles.viewTop}>
                    <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={20}
                    color="white"
                    style={styles.backArrow}
                    />
                    <Text style={styles.h1}>{verify_title}</Text>
                    <Text style={styles.h3}>{verify_sentTo}</Text>
                </View>
                ,
                subtitle: (
                    <View style={styles.formContainer}>
                        <Text style={styles.formLabel}>{verify_subtitle}</Text>
                        <View style={styles.flexRowContainer}>
                            { !verifyCode
                            ?  <TextInput
                                style={[styles.lastInput, styles.onlyInput]}
                                placeholder="+1"
                                autoCapitalize="none"
                                value={profileInfo.phone}
                                onChangeText={onChangeTextPhone}
                                />
                            :   verifyCode.map((item, index) => 
                                <TextInput
                                    key={index}
                                    editable={false}
                                    style={[styles.textCode, styles.onlyInput]}
                                    value={JSON.stringify(item)}
                                    editable={false}
                                />
                            )
                            }
                        </View>

                        {/* <View style={styles.buttonContainer}> */}
                            <TouchableOpacity style={styles.button} onPress={verifyPhone}>
                                <Text style={styles.btnText}>Send Verification</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={goToNextSlide}>
                                <Text style={styles.textLink}>Resend Code</Text>
                            </TouchableOpacity>
                        {/* </View> */}
                    </View>
                )
                },
                // Page 6
                {
                backgroundColor: '#003c8f',
                // image: '',
                title:
                <View style={styles.viewTop}>
                    <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={20}
                    color="white"
                    style={styles.backArrow}
                    />
                    <Text style={styles.h1}>Almost Done!</Text>
                </View>
                ,
                subtitle: (
                    <View style={[styles.viewBottom]}>
                        <Text style={styles.formLabel}>Enable Purse Location</Text>

                        {/* <View style={styles.buttonContainer}> */}
                            <TouchableOpacity style={styles.button} onPress={verifyPhone}>
                                <Text style={styles.btnText}>Send Verification</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={goToNextSlide}>
                                <Text style={styles.textLink}>Resend Code</Text>
                            </TouchableOpacity>
                        {/* </View> */}
                    </View>
                )
            },
            ]}
        />
    )
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    viewTop: {
        position: 'absolute',
        top: 36,
        width: "100%",
        borderColor: 'red',
        borderWidth: 1,
        flex: 1,
    },
    viewBottom: {
        position: 'absolute',
        width: "100%",
        borderColor: 'red',
        borderWidth: 1,
        bottom: 0,
        flex: 1,
    },
    formContainer: {
        position: 'absolute',
        bottom: 0,
        width: "100%",
        marginTop: 124,
        borderColor: 'red',
        borderWidth: 1,
        // flex: 1,
    },
    flexRowContainer: {
        flexDirection: 'row',
        // width: "100%",
        // marginBottom: Dimensions.get('window').height * .325,
        justifyContent: 'center',
    },
    buttonContainer: {
        marginBottom: Dimensions.get('screen').height * .115,
    },
    formLabel: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    inputForm: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 40,
        marginBottom: 30,
        width: "85%",
        height: 50,
        alignSelf: 'center',
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 40,
        marginBottom: 10,
        width: "85%",
        alignSelf: 'center',
    },
    lastInput: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 40,
        marginBottom: 136,
        width: "85%",
        alignSelf: 'center',
    },
    onlyInput: {
        marginBottom: Dimensions.get('window').height * .325,
    },
    textCode: {
        borderBottomColor: "white",
        borderBottomWidth: 1,
        marginHorizontal: 10,
        marginBottom: 0,
        color: 'white',
        fontWeight: '600',
        fontSize: 40,
    },
    button: {
        backgroundColor: "mediumpurple",
        borderRadius: 40,
        height: 50,
        width: "85%",
        alignSelf: 'center',
        justifyContent: "center",
    },
    btnText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: "600",
    },
    buttonMarg: {
        marginBottom: 18,
    },
    buttonLast: {
        marginBottom: 94,
    },
    textLink: {
        textAlign: "center",
        color: "white",
        fontWeight: "700",
        textDecorationLine: "underline",
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 48,
    },
    h1: {
        textAlign: "center",
        fontSize: 28,
        marginTop: 25,
        marginBottom: 15,
        width: "67.7%",
        alignSelf: 'center',
    },
    h2: {
        textAlign: "center",
        fontSize: 20,
        marginBottom: 24,
    },
    h3: {
        textAlign: "center",
        fontSize: 14,
        marginBottom: 16,
    },
    img: {
        width: 150, 
        height: 150,
        resizeMode: "contain", 
        marginBottom: Dimensions.get('window').height * .19,
        borderColor: 'red',
        borderWidth: 1,
    },
    backArrow: {
        alignSelf: 'flex-start', 
        marginLeft: 20,
    },
});