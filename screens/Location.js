import React from 'react';
import { View, Dimensions, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome, FontAwesome5, Ionicons, Entypo, AntDesign } from '@expo/vector-icons'; 
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
import MapView, {Marker} from 'react-native-maps';

const Location  = ({ navigation }) => {

    function findFriends() {
        console.log('find friends pressed')
    }
    const marker = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }

    return(
    <View style={styles.mainContainer}>

        <View style={styles.innerContainer}>
            <Text style={styles.h3}>Your [purse] was last seen</Text>

            <View style={styles.card}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent:'center', width: '100%', marginBottom: 5}}>
                    <Entypo name="location-pin" size={24} color="#D6AF5F" style={{marginTop: 10, marginRight: 8}}/>
                    <Text style={styles.infoText}>
                        1km away  |  2min ago
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={findFriends}>
            <Text style={styles.buttonText}>Track a Friend</Text>
        </TouchableOpacity>
        </View>
        
        <View style={styles.map}>
            <MapView style={styles.mapStyle}
                region={marker} >
                <Marker
                    coordinate={marker}
                    image={require('../assets/images/pin.png')}
                />
            </MapView>
        </View>
    </View>
    )

}

export default Location;

const styles = EStyleSheet.create({
    mainContainer: {
        alignItems: "center",
        justifyContent: 'flex-end',
        textAlign: "center",
        height: Dimensions.get('window').height,
        backgroundColor: '#FFF',
    },
    map: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    mapStyle: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
    },
    innerContainer: {
        paddingTop: 20,
        paddingBottom: 60,
        position: 'relative',
        zIndex: 100,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        backgroundColor: '$primeGreen',
        alignSelf: 'flex-end'
    },
    card: {
        paddingHorizontal: Dimensions.get('window').width * 0.08,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        height: "auto",
        width: '100%',
    },
    h1: {
        fontSize: 25,
        color: '#000',
        width: "100%",
        textAlign: 'center',
        marginBottom: 50,
    },
    h3: {
        fontSize: 14,
        color: '$compYellow',
        textAlign: 'center',
        alignSelf: 'center',
        // flex: 1,
    },
    infoText: {
        fontSize: 18,
        color: '$brandColor',
        textAlign: 'center',
        alignSelf: 'center',
    },
    button: {
        width: Dimensions.get('window').width * .872,
        marginTop: 10,
        marginBottom: 20,
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
      buttonText: {
        fontSize: 14,
        textAlign: "center",
        color: '$compYellow',
        fontWeight: "500",
      },
});