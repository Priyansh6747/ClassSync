import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const UserProfileSetup = ({user, setUser }) => {
    const [batch, setBatch] = useState(user?user.batch:"F1");

    useEffect(() => {
        setUser(prevState => ({
            ...prevState,
            batch
        }));
    }, [batch]);

    const batchOptions = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8','F9','F10','F11','E15','E16','E17'];

    return(
        <View style={styles.container}>
            <Image source={require('../assets/imgs/bot.png')} style={styles.img} />
            <View style={styles.inputContainer}>
                <View style={styles.batchContainer}>
                    <Text style={styles.batchLabel}>Batch:</Text>
                    <View style={styles.batch}>
                        <Text style={styles.arrows}>{"<"}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.batchScroll}>
                            {batchOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.batchOption,
                                        batch === option && styles.selectedBatch
                                    ]}
                                    onPress={() => setBatch(option)}
                                >
                                    <Text style={[
                                        styles.batchText,
                                        batch === option && styles.selectedBatchText
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Text style={styles.arrows}>{">"}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        height: screenHeight * 0.19,
        width: screenWidth * 0.9,
        marginTop: '5%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    inputContainer: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    batchContainer: {
        marginTop: 10,
    },
    batch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    arrows: {
        fontSize: 32,
        color: 'white',
    },
    batchLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    batchScroll: {
        flexDirection: 'row',
    },
    batchOption: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedBatch: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    batchText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    selectedBatchText: {
        color: '#fff',
    },
});

export default UserProfileSetup;