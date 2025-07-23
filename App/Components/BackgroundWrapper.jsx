import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import bg from '../assets/imgs/bg.png';

const BackgroundWrapper = ({ children }) => {
    const insets = useSafeAreaInsets();
    return (
        <ImageBackground
            source={bg}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={[styles.dimmer, { paddingTop: insets.top }]}>
                {children}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    dimmer: {
        flex: 1,
        backgroundColor: 'rgba(217, 217, 217, 0.10)',
    }
});


export default BackgroundWrapper