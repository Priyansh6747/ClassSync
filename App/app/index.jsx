import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from "../Components/Button"
import AText from "../Components/AnmatedText"
import {router} from "expo-router";

const { height, width } = Dimensions.get('window');

const App = () => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#000000', 'rgba(0,0,0,0.9)', 'rgba(64,246,128,0)']}
                start={{x: 0.50, y: 1.00}}
                end={{x: 0.50, y: 0.00}}
                style={styles.gradient}
            />
            <View style={styles.Hero}>
                <Image source={require('../assets/imgs/Hero.png')} style={styles.HeroImg} />
            </View>
            <View style={styles.textBox}>
                <Text style={styles.textTitle}>Class Sync</Text>
                <Text style={styles.textDisc}>Effortless Scheduling</Text>
                <AText text="START SMART" fontSize={32} />
            </View>
            <View style={styles.button}>
                <Button height={height * 0.07} width={width*0.9} text="Get Started"
                        onPress={()=>{router.push('./personalise')}}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'flex-end',
        gap: '5%'
    },
    text: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        marginTop: 100,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.35,
        width: width,
    },
    button: {
        bottom: '5%',
        left: '5%',
        marginVertical: 5,
    },
    textBox: {
        width: '100%',
        color: 'white',
        marginBottom: 15,
        alignItems: 'center',
    },
    textTitle: {
        color: '#a4a2a2',
        fontSize: 24
    },
    textDisc: {
        color: 'white',
        fontSize: 28
    },
    Hero: {
        width: '100%',
        height: height * 0.6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    HeroImg: {
        width: 300,
        height: 300,
    }
});

export default App;