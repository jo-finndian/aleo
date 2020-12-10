
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image, Switch, ScrollView} from "react-native";
import Slider from '@react-native-community/slider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import HsvColorPicker from 'react-native-hsv-color-picker';
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
import io from "socket.io-client";

const SettingCard = ( props ) => {
    const [socketIo, setSocketIo] = useState();
    const [enableiCal, setEnableiCal] = useState();
    const [enableText, setEnableText] = useState();
    const [enablePhone, setEnablePhone] = useState();
    
    const [value, setValue] = useState(value); //brightness
    const [colorHue, setColorHue] = useState(0);
    const [colorSat, setColorSat] = useState(0);
    const [colorVal, setColorVal] = useState(1);
    const [colorPicker, setShowColorPicker] = useState();

    const [lightPatternText, setLightPatternText] = useState();
    const [lightPatternPhone, setLightPatternPhone] = useState();
    const [lightPatterniCal, setLightPatterniCal] = useState();

    //only used for saving to ASYNC storage
    const [lightColor, setLightColor] = useState({
        hue: "",
        saturation: "",
        value: "",
    });

    // controls changes made by user
    const notifControl = () => {
        if (props.id == "text"){
            setEnableText(!enableText);
            var val = JSON.stringify(!enableText);
            updateNotifEnabledAsyncStorage(val);
        }
        else if (props.id == "phone") {
            // setEditAccount(previousState => !previousState);
            setEnablePhone(previousState => !previousState)
            var val = JSON.stringify(!enablePhone);
            updateNotifEnabledAsyncStorage(val);
        }
        else {
            setEnableiCal(!enableiCal)
            var val = JSON.stringify(!enableiCal);
            updateNotifEnabledAsyncStorage(val);
        }
    }
    
    const brightnessValueHandler = (brightness) => {
        setValue(brightness);
        var brightStr = JSON.stringify(brightness);
        console.log(brightness)
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
    const onPatternChange = (pattern) => {
        if (props.id == 'text') {
            setLightPatternText(pattern);
            socketIo.emit("pattern", { status: pattern });
        }
        else if (props.id == 'phone') {
            setLightPatternPhone(pattern);
            socketIo.emit("pattern", { status: pattern });
        }

        if (props.id == 'ical') {
            setLightPatterniCal(pattern);
            socketIo.emit("pattern", { status: pattern });
        }

        updateLightPatternAsyncStorage(pattern);
    };

    function saveColor() {
        var h = Math.floor(lightColor.hue)
        var s = Math.floor(lightColor.saturation * 100)
        var l = Math.floor(lightColor.value*100)/2
        var lightColorStr = JSON.stringify(h + "," + s + "," + l)

        updateLightColorAsyncStorage(lightColorStr);

        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const coolor = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * coolor).toString(16).padStart(2, '0'); 
        };
        socketIo.emit("color", { status: `#${f(0)}${f(8)}${f(4)}` });
        // socketIo.emit("color", { status: lightColorStr });
    }

    const showColorPicker = () => {
        setShowColorPicker(previousState => !previousState);
    }

    // ASYNC STORAGE FUNCTION
    function updateNotifEnabledAsyncStorage(enable) {
        return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem(`${props.id}-enabled`);

            await AsyncStorage.setItem(`${props.id}-enabled`, enable);
            
            console.log(props.id + " async updated successfully " + enable);
            return resolve(true);
        } catch (e) {
            return reject(e);
        } 
        }); 
    };
    function updateBrightAsyncStorage(brightness) {
        return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem(`${props.id}-brightness`);

            await AsyncStorage.setItem(`${props.id}-brightness`, brightness);
            
            console.log(props.id + " bright async updated successfully " + brightness);
            return resolve(true);
        } catch (e) {
            return reject(e);
        } 
        }); 
    };
    function updateLightColorAsyncStorage(lightColor) {
        return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem(`${props.id}-lightColor`);

            await AsyncStorage.setItem(`${props.id}-lightColor`, lightColor);
            
            console.log(props.id + " light color async updated successfully " + lightColor);
            return resolve(true);
        } catch (e) {
            return reject(e);
        } 
        }); 
    };
    function updateLightPatternAsyncStorage(pattern) {
        return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem(`${props.id}-pattern`);

            await AsyncStorage.setItem(`${props.id}-pattern`, pattern);
            
            console.log(props.id + " pattern async updated successfully " + pattern);
            return resolve(true);
        } catch (e) {
            return reject(e);
        } 
        }); 
    };
  
    // FETCH ASYNC STORAGE FUNCTION
    async function fetchInfo() {
        const pattern = await AsyncStorage.getItem(`${props.id}-pattern`);
        const brightness = await AsyncStorage.getItem(`${props.id}-brightness`);
        const enabled = await AsyncStorage.getItem(`${props.id}-enabled`);
        const lightColorStr = await AsyncStorage.getItem(`${props.id}-lightColor`);

        if (enabled && brightness && pattern && lightColorStr) {
            formatSettings(enabled, brightness, lightColorStr, pattern);
        }
        // console.log("Notifications Enabled: " + enabled)
        // console.log("Light Color: " + lightColorStr)
        // console.log("Brightness: " + brightness)
        // console.log("Light Pattern: " + pattern)
    }

    function formatSettings(e, b, lc, p) {
        lc = lc.replace(/"/g, '').split(',');
        b = parseInt(b, 10);
        e = Boolean(e);
      
        for (var i = 0 ; i<=lc.length-1 ; i++) {
            lc[i] = parseInt(lc[i], 10);
        }
      
        // console.log("Color " + lc)
        // console.log("Enable " + e)
        // console.log("Brightness " + b)
        console.log("Pattern " + p)

        setValue(b);
        setColorHue(lc[0]);
        setColorSat(lc[1]);
        setColorVal(lc[2]);
        
        if (props.id == 'text' ) {
            setEnableText(e);
            setLightPatternText(p);
        }
        else if (props.id == 'phone') {
            setEnablePhone(e);
            setLightPatternPhone(p);
        }
        else {
            setEnableiCal(e);
            setLightPatterniCal(p);
        }
    }

    useEffect(() => {
        setSocketIo(
          io("ws://localhost:3000", {
            reconnectionDelayMax: 10000,
          })
        );
        
      }, []);
    fetchInfo();
    

    return (
    <View style={styles.card}>
        <ScrollView>
            <Text style={[styles.h1]}>{props.title}</Text>
            <View style={[styles.section, styles.row, styles.sectionTop]}>
                <Text style={[styles.h2]}>Enable {props.title} Notification</Text>
                <Switch
                    style={styles.switch}
                    trackColor={{ false: "#5e5e5e", true: '#D6AF5F' }}
                    thumbColor={'#FFF0E3'}
                    ios_backgroundColor="#5e5e5e"
                    onValueChange={notifControl}
                    value={(props.id == 'text') ? enableText : (props.id == 'phone') ? enablePhone : enableiCal}
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
                    onSlidingComplete={() => socketIo.emit("brightness", { status: value.toString() })}
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
                <TouchableOpacity
                    style={!colorPicker ? {display: 'none'} : [styles.button, styles.buttonOutline, styles.buttonFill]} 
                    onPress={()=> {
                        saveColor()}
                    }
                >
                    <Text style={[styles.buttonText, styles.buttonTextPrime]}>Save Color</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.section, styles.column]}>
                <View style={styles.innerRow}>
                    <Text style={[styles.h2, styles.noArrow]}>Light Pattern</Text>
                </View>
                <View style={styles.innerRow}>
                    <TouchableOpacity
                        style={(props.id == 'text' && lightPatternText == "Blink") ? styles.inputSelected : (props.id == 'phone' && lightPatternPhone == "Blink") ? styles.inputSelected : (props.id == 'ical' && lightPatterniCal == "Blink") ? styles.inputSelected : styles.inputSm }
                        onPress={()=> { onPatternChange("blink") }}>
                            <Text>Blink</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={(props.id == 'text' && lightPatternText == "Rainbow") ? styles.inputSelected : (props.id == 'phone' && lightPatternPhone == "Rainbow") ? styles.inputSelected : (props.id == 'ical' && lightPatterniCal == "Rainbow") ? styles.inputSelected : styles.inputSm}
                        onPress={()=> { onPatternChange("rainbow") }}>
                            <Text>Rainbow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={(props.id == 'text' && lightPatternText == "Pulse") ? styles.inputSelected : (props.id == 'phone' && lightPatternPhone == "Pulse") ? styles.inputSelected : (props.id == 'ical' && lightPatterniCal == "Pulse") ? styles.inputSelected : styles.inputSm}
                        onPress={()=> { onPatternChange("pulse") }}>
                            <Text>Pulse</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </View>
  );
};

export default SettingCard;

const styles = EStyleSheet.create({
    card: {
        height: Dimensions.get('screen').height * .65,
        width: Dimensions.get('window').width * .91,
        alignItems: 'center',
        backgroundColor: '$primeGreen',
        borderColor: '$compYellow',
        borderWidth: 2,
        borderRadius: '$borderRad'
    },
    section: {
        width: '98%',
        justifyContent: 'center',
        flexWrap: "wrap",
        marginBottom: 12,
        paddingBottom: 20,
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
    h1: {
        fontSize: 25,
        color: '$brandColor',
        textAlign: 'center',
        marginBottom: 10,
        padding: 10,
    },
    h2: {
        fontSize: 18,
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
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        borderRadius: '$borderRad',
    },
    inputSelected: { 
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        borderRadius: '$borderRad',
        backgroundColor: '$brandColor',
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