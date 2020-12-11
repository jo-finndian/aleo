
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
    const [hex, setHex] = useState(); //light hex value
    const [hue, setColorHue] = useState();
    const [sat, setColorSat] = useState();
    const [colorVal, setColorVal] = useState();
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
        setLightColor({ // for async storage
            ...lightColor,
            saturation,
            value,
        });
        setColorSat(saturation); // colour picker display
        setColorVal(value); // colour picker display
        HSVtoRGB();
    };
    
    const onHuePickerChange = ({ hue }) => {
        setLightColor({ // for async storage
            ...lightColor,
            hue,
        });
        setColorHue(hue); // colour picker display
        HSVtoRGB();
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

    function HSVtoRGB() {
        var h = hue;
        var s = sat*100;
        var v = colorVal*100;

        var r, g, b;
        var i;
        var f, p, q, t;
         
        // Make sure our arguments stay in-range
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));
         
        // We accept saturation and value arguments from 0 to 100 because that's
        // how Photoshop represents those values. Internally, however, the
        // saturation and value are calculated from a range of 0 to 1. We make
        // That conversion here.
        s /= 100;
        v /= 100;
         
        if(s == 0) {
            // Achromatic (grey)
            r = g = b = v;
            return [
                Math.round(r * 255), 
                Math.round(g * 255), 
                Math.round(b * 255)
            ];
        }
         
        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
         
        switch(i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
         
            case 1:
                r = q;
                g = v;
                b = p;
                break;
         
            case 2:
                r = p;
                g = v;
                b = t;
                break;
         
            case 3:
                r = p;
                g = q;
                b = v;
                break;
         
            case 4:
                r = t;
                g = p;
                b = v;
                break;
         
            default: // case 5:
                r = v;
                g = p;
                b = q;
        }

        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
        
        RGBToHex(r,g,b);
        
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }

    //convert RGB > HEX
    function RGBToHex(r, g, b) {
        console.log("R " + r + " G " + g + " B " + b)
        var r = r.toString(16);
        var g = g.toString(16);
        var b = b.toString(16);
        
        console.log(r ,g , b)
      
        if (r.length == 1)
          r = "0" + r;
        if (g.length == 1)
          g = "0" + g;
        if (b.length == 1)
          b = "0" + b;
      
        setHex(r + g + b)
        updateHexStorage(hex);

        // return "#" + r + g + b;
    }

    function saveColor() {
        var h = lightColor.hue;
        var s = lightColor.saturation;
        var v = lightColor.value;
        
        var lightColorStr = JSON.stringify(h + "," + s + "," + v)

        updateLightColorAsyncStorage(lightColorStr);
        socketIo.emit("color", { status: `#${hex}`});
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
    function updateHexStorage(hex) {
        return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem(`${props.id}-hex`);

            await AsyncStorage.setItem(`${props.id}-hex`, hex);
            
            console.log(props.id + " light color async updated successfully " + hex);
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
        const _hex = await AsyncStorage.getItem(`${props.id}-hex`);
        
        if (enabled && brightness && pattern && lightColorStr && _hex) {
            formatSettings(enabled, brightness, lightColorStr, pattern);
            setHex(_hex)
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
      
        var h = lc[0];
        var s = lc[1];
        var v = lc[2];

        setValue(b);
        setColorHue(h);
        setColorSat(s);
        setColorVal(v);
        
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
        fetchInfo();
        setSocketIo(
            io("ws://localhost:3000", {
              reconnectionDelayMax: 10000,
            })
          );
    }, []);
    

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
                            backgroundColor: "#" + hex, 
                            alignSelf: 'center'
                        }}
                    />
                </View>
                <HsvColorPicker
                    huePickerHue={hue}
                    onHuePickerDragMove={onHuePickerChange}
                    onHuePickerPress={onHuePickerChange}
                    satValPickerHue={hue}
                    satValPickerSaturation={sat}
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