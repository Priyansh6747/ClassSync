import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const UserProfileSetup = ({user, setUser, setMode}) => {
    const [name, setName] = useState(user?.name || "");
    const [year, setYear] = useState(user?.year || "1st");
    const [batch, setBatch] = useState(user?.batch || "");
    const [scaleAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(height));

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            })
        ]).start();
    }, []);

    useEffect(() => {
        setUser(prevState => ({
            ...prevState,
            name,
            year,
            batch: batch.trim()
        }));
    }, [name, year, batch]);

    const yearOptions = [
        { value: '1st', emoji: '🎯', color: '#FF6B6B' },
        { value: '2nd', emoji: '🚀', color: '#4ECDC4' },
        { value: '3rd', emoji: '⭐', color: '#45B7D1' },
        { value: '4th', emoji: '👑', color: '#96CEB4' }
    ];

    const saveUser = async () => {
        return Promise.resolve();
    };

    const isFormValid = name.trim() && year && batch.trim();

    return(
        <View style={styles.container}>
            {/* Animated Background Elements */}
            <View style={styles.backgroundDecor}>
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
                <View style={[styles.circle, styles.circle3]} />
            </View>

            <Animated.View
                style={[
                    styles.content,
                    {
                        transform: [
                            { scale: scaleAnim },
                            { translateY: slideAnim }
                        ]
                    }
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../assets/imgs/bot.png')} style={styles.avatar} />
                        <View style={styles.avatarGlow} />
                    </View>
                    <Text style={styles.greeting}>Hey there! 👋</Text>
                    <Text style={styles.subtitle}>Let's get you set up in style</Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    {/* Name Section */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.inputLabel}>✨ What's your name?</Text>
                        </View>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.nameInput}
                                placeholder="Type your awesome name here..."
                                placeholderTextColor="#B8BCC8"
                                value={name}
                                onChangeText={setName}
                                returnKeyType="next"
                            />
                            <View style={styles.inputUnderline} />
                        </View>
                    </View>

                    {/* Year Section */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.inputLabel}>🎓 Which year are you in?</Text>
                        </View>
                        <View style={styles.yearGrid}>
                            {yearOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.yearCard,
                                        {
                                            backgroundColor: year === option.value ? option.color : '#F8FAFC',
                                            borderColor: year === option.value ? option.color : '#E2E8F0',
                                            transform: year === option.value ? [{ scale: 1.05 }] : [{ scale: 1 }]
                                        }
                                    ]}
                                    onPress={() => setYear(option.value)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.yearEmoji}>{option.emoji}</Text>
                                    <Text style={[
                                        styles.yearText,
                                        { color: year === option.value ? '#FFFFFF' : '#64748B' }
                                    ]}>
                                        {option.value}
                                    </Text>
                                    {year === option.value && (
                                        <View style={styles.selectedIndicator} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Batch Section */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.inputLabel}>🎯 Your batch code</Text>
                        </View>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.batchInput}
                                placeholder="e.g., F1, E15, or any batch code..."
                                placeholderTextColor="#B8BCC8"
                                value={batch}
                                onChangeText={setBatch}
                                returnKeyType="done"
                                autoCapitalize="characters"
                            />
                            <View style={styles.inputUnderline} />
                        </View>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Progress Indicator */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[
                                styles.progressFill,
                                { width: `${(name ? 33 : 0) + (year ? 33 : 0) + (batch ? 34 : 0)}%` }
                            ]} />
                        </View>
                        <Text style={styles.progressText}>
                            {name && year && batch ? "Ready to go! 🎉" : "Almost there..."}
                        </Text>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            {
                                height: height * 0.07,
                                width: width * 0.5,
                                opacity: isFormValid ? 1 : 0.6,
                                backgroundColor: isFormValid ? '#6366F1' : '#94A3B8'
                            }
                        ]}
                        onPress={() => {
                            if (isFormValid) {
                                saveUser().then(r =>
                                    setMode(false)
                                )
                            }
                        }}
                        disabled={!isFormValid}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Let's Go! 🚀</Text>
                        <View style={styles.buttonGlow} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    backgroundDecor: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        opacity: 0.1,
    },
    circle1: {
        width: 200,
        height: 200,
        backgroundColor: '#6366F1',
        top: -50,
        right: -50,
    },
    circle2: {
        width: 150,
        height: 150,
        backgroundColor: '#EC4899',
        bottom: 100,
        left: -30,
    },
    circle3: {
        width: 100,
        height: 100,
        backgroundColor: '#10B981',
        top: '40%',
        right: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: width * 0.06,
        paddingVertical: height * 0.02,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    avatarContainer: {
        position: 'relative',
        marginTop: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#6366F1',
    },
    avatarGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#6366F1',
        opacity: 0.3,
        top: 0,
        left: 0,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    },
    inputGroup: {
        marginBottom: 16,
    },
    labelContainer: {
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    inputWrapper: {
        position: 'relative',
    },
    nameInput: {
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
    },
    batchInput: {
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
    },
    inputUnderline: {
        height: 2,
        backgroundColor: '#6366F1',
        marginTop: 4,
        borderRadius: 1,
    },
    yearGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    yearCard: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    yearEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    yearText: {
        fontSize: 14,
        fontWeight: '600',
    },
    selectedIndicator: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButton: {
        backgroundColor: '#6366F1',
        borderRadius: 35,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    buttonGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 35,
        backgroundColor: '#6366F1',
        opacity: 0.3,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 15,
    },
    bottomSection: {
        alignItems: 'center',
        paddingTop: 10,
    },
    progressContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    progressBar: {
        width: width * 0.6,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
    },
});

export default UserProfileSetup;