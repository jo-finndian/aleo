import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Dimensions, Image, Switch, ScrollView, TextInput, KeyboardAvoidingView } from "react-native";
import Slider from '@react-native-community/slider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import HsvColorPicker from 'react-native-hsv-color-picker';
import EStyleSheet, { create } from 'react-native-extended-stylesheet';

export default function NotifSettings({ props }) {
    const [value, setValue] = useState(value); //brightness
    const [colorHue, setColorHue] = useState(0);
    const [colorSat, setColorSat] = useState(0);
    const [colorVal, setColorVal] = useState(1);
    const [intLight, setIntLight] = useState(false);
    const [colorPicker, setShowColorPicker] = useState(false);
    const [reactionTime, setReactionTime] = useState();

    //only used for saving to ASYNC storage
    const [lightColor, setLightColor] = useState({
        hue: "",
        saturation: "",
        value: "",
    });

    // controls changes made by user
    const intLightControl = () => {
        setIntLight(previousState => !previousState);
        var intLightStr = JSON.stringify(!intLight)
        updateLightAsyncStorage(intLightStr);
    }
    
    const brightnessValueHandler = (brightness) => {
        setValue(brightness);
        var brightStr = JSON.stringify(brightness);
        updateBrightAsyncStorage(brightStr);
    }

    const onSatValPickerChange = ( {saturation, value }) => {
        setLightColor({
            ...lightColor,
            saturation,
            value,
        });
        // saturation = Math.floor(saturation * 100);
        // value = Math.floor(value * 100)/2;
        setColorSat(saturation);
        setColorVal(value);
    };
    
    const onHuePickerChange = ({ hue }) => {
        setLightColor({
            ...lightColor,
            hue,
        });
        hue = Math.floor(hue)
        setColorHue(hue);
    };
    const onTimeChange = (time) => {
        setReactionTime(time);
        var time = JSON.stringify(time);
        updateTimeoutAsyncStorage(time);
    };

    function saveColor() {
        var h = Math.floor(lightColor.hue)
        var s = Math.floor(lightColor.saturation * 100)
        var l = Math.floor(lightColor.value*100)/2
        var lightColorStr = JSON.stringify(h + "," + s + "," + l)

        updateHueAsyncStorage(lightColorStr);
    }

    const showColorPicker = () => {
        setShowColorPicker(previousState => !previousState);
    }

    // ASYNC STORAGE FUNCTION
    function updateLightAsyncStorage(light) {
        return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem("light");

            await AsyncStorage.setItem("light", light);
            
            console.log("light async updated successfully " + light);
            // fetchInfo();
            return resolve(true);
        } catch (e) {
            return reject(e);
        } 
        }); 
    };
    function updateBrightAsyncStorage(brightness) {
        return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem("brightness");

            await AsyncStorage.setItem("brightness", brightness);
            
            console.log("bright async updated successfully " + brightness);
            // fetchInfo();
            return resolve(true);
        } catch (e) {
            return reject(e);
        } 
        }); 
    };
    function updateHueAsyncStorage(lightColor) {
        return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem("lightColor");

            await AsyncStorage.setItem("lightColor", lightColor);
            
            console.log("hue async updated successfully " + lightColor);
            fetchInfo();
            return resolve(true);
        } catch (e) {
            return reject(e);
        } 
        }); 
    };
    function updateTimeoutAsyncStorage(timeout) {
        return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem("timeout");

            await AsyncStorage.setItem("timeout", timeout);
            
            console.log("timeout async updated successfully");
            fetchInfo();
            return resolve(true);
        } catch (e) {
            return reject(e);
        } 
        }); 
    };
  
    // FETCH ASYNC STORAGE FUNCTION
    async function fetchInfo() {
        const timeout = await AsyncStorage.getItem("timeout");
        const brightness = await AsyncStorage.getItem("brightness");
        const lightStatus = await AsyncStorage.getItem("light");
        const lightColorStr = await AsyncStorage.getItem("lightColor");

        if (timeout && brightness && lightStatus && lightColorStr) {
            formatSettings(timeout, brightness, lightStatus, lightColorStr);
        }

        console.log("Light Enabled: " + brightness)
        console.log("Timeout: " + timeout)
        console.log("Brightness: " + brightness)
        console.log("Light Color: " + lightColorStr)
    }

    function formatSettings(t, b, l, lc) {
        lc = lc.replace(/"/g, '').split(',');
        t = t.replace(/"/g, '');

        // t = parseInt(t, 10);
        b = parseInt(b, 10);
        l = Boolean(l);
        
        for (var i = 0 ; i<=lc.length-1 ; i++) {
            lc[i] = parseInt(lc[i], 10);
        }

        setReactionTime(t)
        setValue(b);
        setIntLight(l);
        setColorHue(lc[0]);
        setColorSat(lc[1]);
        setColorVal(lc[2]);
    }

    useEffect(() => {
        fetchInfo();
    }, []);
    
    return (
    <KeyboardAvoidingView style={styles.keyboard} behavior="position" enabled>
    <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollView} contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column', paddingBottom: 200}}>
            <View style={styles.card}>
                <View style={[styles.section, styles.row, styles.sectionTop]}>
                    <Text style={[styles.h2]}>Enable Interior Light</Text>
                    <Switch
                        style={styles.switch}
                        trackColor={{ false: "#5e5e5e", true: '#D6AF5F' }}
                        thumbColor={'#FFF0E3'}
                        ios_backgroundColor="#5e5e5e"
                        onValueChange={intLightControl}
                        value={intLight}
                    />
                </View>
                <View style={[styles.section, styles.column, styles.sectionTop]}>
                    <View style={styles.innerRow}>
                        <Image source={require('../assets/images/sun.png')} style={styles.icon}/>
                        <Text style={[styles.h2, styles.noArrow]}>Brightness</Text>
                    </View>
                    <Text style={styles.text}>{value}</Text>
                    <Slider
                        value={value}
                        onValueChange={(val) => brightnessValueHandler(val)}
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor="#D0BC92"
                        maximumTrackTintColor="#D0BC92"
                        thumbImage={require('../assets/images/sliderThumb-sm.png')}
                        step={1}
                        allowTouchTrack={true}
                        animateTransitions={true}
                        animationType={'easeIn'}
                    />
                </View>
                <View style={[styles.section, styles.column, styles.sectionTop]}>
                    <View style={styles.innerRow}>
                        <Image source={require('../assets/images/eyedropper.png')} style={styles.icon}/>
                        <Text style={[styles.h2, styles.noArrow]}>Hue</Text>
                    </View>
                    <View style={styles.innerRow}>
                        <Text style={styles.text}>Select a Color:</Text>
                        <TouchableOpacity
                            onPress={showColorPicker}
                            style={{
                                width: 55, 
                                height: 20,
                                marginLeft: 10, 
                                borderRadius:4, 
                                borderColor: '#FFF0E3', 
                                borderWidth: 1, 
                                backgroundColor: `hsl(${colorHue},${colorSat}%,${colorVal}%)`, 
                                alignSelf: 'center'
                            }}
                        />
                    </View>
                    <HsvColorPicker
                        huePickerHue={colorHue}
                        onHuePickerDragMove={onHuePickerChange}
                        onHuePickerPress={onHuePickerChange}
                        satValPickerHue={colorHue}
                        satValPickerSaturation={colorSat}
                        satValPickerValue={colorVal}
                        onSatValPickerDragMove={onSatValPickerChange}
                        onSatValPickerPress={onSatValPickerChange}
                        containerStyle={!colorPicker ? {display: 'none'} : {display: 'flex'}}
                    />
                    <TouchableOpacity style={!colorPicker ? {display: 'none'} : [styles.button, styles.buttonOutline, styles.buttonFill]} onPress={saveColor}>
                        <Text style={[styles.buttonText, styles.buttonTextPrime]}>Save Color</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.section, styles.column]}>
                    <View style={styles.innerRow}>
                        <Image source={require('../assets/images/clock.png')} style={styles.icon}/>
                        <Text style={[styles.h2, styles.noArrow]}>Light Timeout</Text>
                    </View>
                    <View style={styles.innerRow}>
                        <Text style={styles.text}>Light will stop after:</Text>
                        <TextInput
                            placeholder="1"
                            value={reactionTime}
                            onChangeText={onTimeChange}
                            placeholderTextColor={'#FFF0E39a'}
                            maxLength={2}
                            style={[styles.inputSm]}
                            keyboardType={"number-pad"}
                        />
                        <Text style={styles.text}>minute</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>
    </KeyboardAvoidingView>
    )
}

const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 90,
        backgroundColor: '$primeGreen',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    keyboard: {
        position: "absolute",
        width: "100%",
    },
    card: {
        flex: 1,
    },
    section: {
        width: '100%',
        justifyContent: 'center',
        flexWrap: "wrap",
        marginBottom: 12,
        paddingBottom: 35,
        paddingTop: 20,
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
        marginBottom: (30-12),
        borderBottomColor: 'rgba(208, 188, 146, 0.5)',
        borderBottomWidth: 1,
      },
    icon: {
        width: 20,
        height: 20,
        marginBottom: 10,
        resizeMode: "contain", 
    },
    h2: {
        fontSize: 20,
        color: '$compYellow',
        textAlign: 'center',
        marginBottom: 10,
        padding: 10,
    },
    text: {
        color: '$compYellow',
        textAlign: 'center',
        paddingBottom: 0,
    },
    switch: {
        transform: [{ scaleX: .8 }, { scaleY: .8 }, {translateX: 0}, {translateY: -5}],
        alignSelf: 'center',
    },
    slider: {
        width: Dimensions.get('window').width * .67,
        alignSelf: 'center',
        height: 25,
    },
    inputSm: {
        backgroundColor: '$secGreen',
        width: 60,
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        borderRadius: '$borderRad',
        borderBottomColor: 'white',
        borderBottomWidth: 1,
    },
    button: {
        width: Dimensions.get('window').width * .872 /2,
        marginHorizontal: 30,
        marginTop: 20,
        height: 50,
        justifyContent:'center',
        alignSelf: 'center',
        bottom: 0,
        borderRadius: '$borderRad',
    },
    buttonFill: {
        backgroundColor: '#D0BC926a',
    },
    buttonText: {
        fontSize: 14,
        textAlign: "center",
        color: '$primeGreen',
        fontWeight: "500",
    },
    buttonOutline: {
        borderColor: '#D0BC92',
        borderWidth: 2,
    },
});