import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Dimensions, Image, Switch, TextInput, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EStyleSheet, { create } from 'react-native-extended-stylesheet';

import NotifSettings from "../components/NotifSettings";

export default function IntLightSettings({ navigation, props }) {
    return (
       <View>
           <NotifSettings></NotifSettings>
       </View>
    )
}

const styles = EStyleSheet.create({

    cardIcon: {
        width: 45,
        height: 45,
        resizeMode: "contain", 
    },
});