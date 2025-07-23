import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const { width } = Dimensions.get('window');

const SimpleAnimatedText = ({
                                text = "Animated Text",
                                fontSize = 32,
                                colors = ['#00c6f3', '#f24e93', '#ff4e00', '#96ceb4', '#ffeaa7'],
                                duration = 3000,
                                style = {},
                                ...props
                            }) => {
    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startAnimation = () => {
            animationValue.setValue(0);

            Animated.loop(
                Animated.timing(animationValue, {
                    toValue: 1,
                    duration: duration,
                    useNativeDriver: false,
                })
            ).start();
        };

        startAnimation();

        return () => {
            animationValue.stopAnimation();
        };
    }, [animationValue, duration]);

    // Animate the gradient position horizontally
    const translateX = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <View style={[styles.container, style]} {...props}>
            <MaskedView
                style={styles.maskedView}
                maskElement={
                    <View style={styles.maskContainer}>
                        <Text
                            style={[
                                styles.maskText,
                                {
                                    fontSize,
                                }
                            ]}
                        >
                            {text}
                        </Text>
                    </View>
                }
            >
                <Animated.View
                    style={[
                        styles.gradientContainer,
                        {
                            transform: [{ translateX }],
                        }
                    ]}
                >
                    <LinearGradient
                        colors={colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    />
                </Animated.View>
            </MaskedView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    maskedView: {
        flexDirection: 'row',
        height: 60,
    },
    maskContainer: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    maskText: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: 'black', // This will be the mask
    },
    gradientContainer: {
        width: width * 2, // Make it wider than screen for smooth transition
        height: '100%',
    },
    gradient: {
        flex: 1,
        height: '100%',
    },
});

export default SimpleAnimatedText;