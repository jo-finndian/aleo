import React from "react";
import { Image, View } from "react-native";
import EStyleSheet, { create } from 'react-native-extended-stylesheet';

export default function Pagination(props) {
    return (
        <View style={styles.pagination}>
            <View style={(props.id == 0) ? styles.elipsisOn : styles.elipsisOff}></View>
            <View style={(props.id == 1) ? styles.elipsisOn : styles.elipsisOff}></View>
            <View style={(props.id == 2) ? styles.elipsisOn : styles.elipsisOff}></View>
        </View>
    )
};

const styles = EStyleSheet.create({

    pagination: {
        flexDirection: 'row',
        width: 40,
        justifyContent: "space-around",
        alignSelf: 'center',
        marginTop: 30,
    },
    elipsisOff: {
        height: 5,
        width: 5,
        backgroundColor: '$compYellow',
        opacity: 0.5,
        borderRadius: 5,
    },
    elipsisOn: {
        height: 5,
        width: 5,
        backgroundColor: '$compYellow',
        opacity: 1,
        borderRadius: 5,
    },
});