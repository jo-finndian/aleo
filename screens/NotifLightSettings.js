import React, { useState } from "react";
import { Text, View, Dimensions } from "react-native";
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
import CardStack, { Card } from 'react-native-card-stack-swiper';

import SettingCard from "../components/Card";
import Pagination from "../components/Pagination";

const NotifLightSettings = () => {
    const [count, setCount] = useState(0);

    function setPagination(op) {
        if (op == "+") {
            setCount(count + 1);
            if (count == 2) {
                setCount(0);
            }
        }
        else {
            setCount(count - 1);
            if (count == 0) {
                setCount(2);
            }
        }
    }
    // console.log(count)

    return (
    <View style={styles.container}>

        <CardStack
            style={styles.content}
            outputRotationRange={['-1deg', '0deg', '1deg']}
            ref={swiper => {
            this.swiper = swiper
            }}
            renderNoMoreCards={() => null}
            loop={true}
            verticalSwipe={false}
            disableTopSwipe={true}
            disableBottomSwipe={true}
            onSwiped={() => console.log('swiped')}
            onSwipedLeft={() => {
                // console.log('onSwipedLeft')
                setPagination("+")
            }}
            onSwipedRight={() => {
                this.swiper.goBackFromLeft();
                this.swiper.goBackFromLeft();
                setPagination("-")
                // console.log('onSwipedLeft')
            }}
        >
            <SettingCard
                title="Text Messages"
                id="text"
            />
            <SettingCard
                title="Phone Calls"
                id="phone"
            />
            <SettingCard
                title="iCal"
                id="ical"
            />
        </CardStack>

        <View style={styles.footer}>
            <Pagination id={count}/>
        </View>
    </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 70,
        backgroundColor: '$primeGreen',
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
    },
    content:{
        flex: 1,
        alignItems: 'center',
        marginTop: 0,
    },
    footer:{
        flex: 1,
        maxHeight: 10,
        marginBottom: 50,
        justifyContent:'flex-end',
        alignSelf: 'center'
    },
});
export default NotifLightSettings;