import React, {useState, useEffect, useRef} from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Platform } from 'react-native';
import {db} from "../firebaseConfig";
const { width, height } = Dimensions.get('window');

const TechLoadingScreen = () => {
    const [dots, setDots] = useState('');
    const [currentSubtextIndex, setCurrentSubtextIndex] = useState(0);
    const [showToast, setShowToast] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;
    const floatAnim1 = useRef(new Animated.Value(0)).current;
    const floatAnim2 = useRef(new Animated.Value(0)).current;
    const floatAnim3 = useRef(new Animated.Value(0)).current;
    const floatAnim4 = useRef(new Animated.Value(0)).current;
    const toastAnim = useRef(new Animated.Value(0)).current;



    // Tech-themed rotating subtexts
    const subtexts = [
        "Waking up the server from hibernation",
        "Checking MongoDB cabinet for your data",
        "Initializing Redis cache warming protocols",
        "Establishing secure WebSocket connections",
        "Loading configuration files and env variables",
        "Synchronizing distributed database clusters",
        "Validating API endpoints and middlewares",
        "Optimizing query performance and indexing",
        "Initializing microservices architecture",
        "Setting up load balancers and failovers",
        "Finalizing JWT authentication tokens",
        "Almost ready - last system checks running"
    ];

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Toast animation
    useEffect(() => {
        if (showToast) {
            Animated.sequence([
                Animated.timing(toastAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.delay(4000),
                Animated.timing(toastAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowToast(false));
        }
    }, [showToast]);

    // Pulse animation for main icon
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    // Spinner animation
    useEffect(() => {
        const spin = Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );
        spin.start();
        return () => spin.stop();
    }, []);

    // Floating animations for tech icons
    useEffect(() => {
        const createFloatAnimation = (animValue, delay = 0) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animValue, {
                        toValue: -10,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animValue, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animations = [
            createFloatAnimation(floatAnim1, 0),
            createFloatAnimation(floatAnim2, 500),
            createFloatAnimation(floatAnim3, 1000),
            createFloatAnimation(floatAnim4, 1500),
        ];

        animations.forEach(anim => anim.start());

        return () => animations.forEach(anim => anim.stop());
    }, []);

    // Rotating subtext effect with fade animation
    useEffect(() => {
        const rotateSubtext = () => {
            // Fade out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                // Change text
                setCurrentSubtextIndex(prev => (prev + 1) % subtexts.length);

                // Fade in
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        };

        const interval = setInterval(rotateSubtext, 3000);
        return () => clearInterval(interval);
    }, [fadeAnim]);

    const spinInterpolate = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const FloatingIcon = ({ children, animValue, style }) => (
        <Animated.View
            style={[
                styles.floatingIcon,
                style,
                {
                    transform: [{ translateY: animValue }],
                    opacity: 0.6
                }
            ]}
        >
            {children}
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            {/* Toast Message */}
            {showToast && (
                <Animated.View
                    style={[
                        styles.toastContainer,
                        {
                            opacity: toastAnim,
                            transform: [{
                                translateY: toastAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-50, 0],
                                })
                            }]
                        }
                    ]}
                >
                    <View style={styles.toast}>
                        <Text style={styles.toastIcon}>⚡</Text>
                        <Text style={styles.toastText}>
                            Initial data fetch may take up to 90 seconds
                        </Text>
                    </View>
                </Animated.View>
            )}

            <View style={styles.loadingCard}>
                {/* Floating tech icons */}
                <View style={styles.iconsContainer}>
                    <FloatingIcon animValue={floatAnim1} style={styles.icon1}>
                        <Text style={styles.iconText}>⚙️</Text>
                    </FloatingIcon>
                    <FloatingIcon animValue={floatAnim2} style={styles.icon2}>
                        <Text style={styles.iconText}>🔧</Text>
                    </FloatingIcon>
                    <FloatingIcon animValue={floatAnim3} style={styles.icon3}>
                        <Text style={styles.iconText}>📡</Text>
                    </FloatingIcon>
                    <FloatingIcon animValue={floatAnim4} style={styles.icon4}>
                        <Text style={styles.iconText}>💾</Text>
                    </FloatingIcon>
                </View>

                {/* Main icon with pulse animation */}
                <Animated.View
                    style={[
                        styles.mainIconContainer,
                        { transform: [{ scale: pulseAnim }] }
                    ]}
                >
                    <View style={styles.mainIcon}>
                        <Text style={styles.mainIconText}>🖥️</Text>
                    </View>
                    <View style={styles.pulseRing} />
                </Animated.View>

                {/* Spinner */}
                <View style={styles.spinnerContainer}>
                    <Animated.View
                        style={[
                            styles.spinner,
                            { transform: [{ rotate: spinInterpolate }] }
                        ]}
                    >
                        <View style={styles.spinnerInner}>
                            <Text style={styles.codeIcon}>⚡</Text>
                        </View>
                    </Animated.View>
                </View>

                {/* Main loading text */}
                <Text style={styles.loadingText}>
                    Booting up systems{dots}
                </Text>

                {/* Animated subtext */}
                <Animated.View style={[styles.subtextContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.loadingSubtext}>
                        {subtexts[currentSubtextIndex]}
                    </Text>
                </Animated.View>

                {/* Progress indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${Math.min(((currentSubtextIndex + 1) / subtexts.length) * 100, 100)}%`
                                }
                            ]}
                        />
                    </View>
                    <View style={styles.progressTextContainer}>
                        <Text style={styles.progressLabel}>
                            Initializing backend services...
                        </Text>
                        <Text style={styles.progressPercentage}>
                            {Math.round(((currentSubtextIndex + 1) / subtexts.length) * 100)}%
                        </Text>
                    </View>
                </View>

                {/* Status indicators */}
                <View style={styles.statusContainer}>
                    <View style={styles.statusItem}>
                        <View style={[styles.statusDot, styles.tealDot]} />
                        <Text style={styles.statusText}>API Online</Text>
                    </View>
                    <View style={styles.statusItem}>
                        <View style={[styles.statusDot, styles.blueDot]} />
                        <Text style={styles.statusText}>Database Connected</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    toastContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        right: 20,
        zIndex: 1000,
    },
    toast: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    toastIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    toastText: {
        flex: 1,
        fontSize: 14,
        color: '#e2e8f0',
    },
    loadingCard: {
        backgroundColor: 'rgba(30,41,59,0.53)',
        borderRadius: 20,
        paddingVertical: 40,
        paddingHorizontal: 32,
        maxWidth: 380,
        width: '90%',
        minHeight: height * 0.7, // Use minimum height instead of fixed height
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        justifyContent: 'space-between', // Distribute content evenly
    },
    iconsContainer: {
        position: 'relative',
        width: 100,
        height: 80,
        marginBottom: 20,
    },
    floatingIcon: {
        position: 'absolute',
    },
    icon1: {
        top: 0,
        left: 0,
    },
    icon2: {
        top: 0,
        right: 0,
    },
    icon3: {
        bottom: 0,
        left: 0,
    },
    icon4: {
        bottom: 0,
        right: 0,
    },
    iconText: {
        fontSize: 18,
    },
    mainIconContainer: {
        position: 'relative',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainIconText: {
        fontSize: 36,
    },
    pulseRing: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: '#3b82f6',
        opacity: 0.4,
    },
    spinnerContainer: {
        marginBottom: 16,
    },
    spinner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: '#475569',
        borderTopColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerInner: {
        position: 'absolute',
    },
    codeIcon: {
        fontSize: 16,
    },
    loadingText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#f1f5f9',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtextContainer: {
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    loadingSubtext: {
        fontSize: 15,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 20,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 20,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#475569',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
        borderRadius: 4,
    },
    progressTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        fontSize: 12,
        color: '#64748b',
    },
    progressPercentage: {
        fontSize: 12,
        fontWeight: '700',
        color: '#3b82f6',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 'auto',
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    tealDot: {
        backgroundColor: '#3b82f6',
    },
    blueDot: {
        backgroundColor: '#14b8a6',
    },
    statusText: {
        fontSize: 12,
        color: '#94a3b8',
    },
});

export default TechLoadingScreen;