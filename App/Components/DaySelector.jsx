import {Text, View, StyleSheet, TouchableOpacity} from 'react-native'
import {useState} from "react";
import AntDesign from '@expo/vector-icons/AntDesign';

const App = ({dayIdx,setDayIdx}) => {
    const dayOptions = ["MON","TUES","WED","THUR","FRI","SAT"];

    const dayIncrement = () => {
        let newIdx = (dayIdx + 1) % dayOptions.length;
        setDayIdx(newIdx);
    }

    const dayDecrement = () => {
        let newIdx = (dayIdx + 5) % dayOptions.length;
        setDayIdx(newIdx);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.navigationButton}
                onPress={dayDecrement}
                activeOpacity={0.7}
            >
                <Text style={styles.navigationText}>
                    <AntDesign name="caretleft" size={24} color="black" />
                </Text>
            </TouchableOpacity>

            <View style={styles.dayContainer}>
                <Text style={styles.dayText}>{dayOptions[dayIdx]}</Text>
            </View>

            <TouchableOpacity
                style={styles.navigationButton}
                onPress={dayIncrement}
                activeOpacity={0.7}
            >
                <Text style={styles.navigationText}>
                    <AntDesign name="caretright" size={24} color="black" />
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginTop: 20,
        marginHorizontal: 5,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    navigationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    dayContainer: {
        backgroundColor: 'rgba(255,255,255,0.42)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#007AFF',
        minWidth: '60%',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fdfdff',
        letterSpacing: 0.5,
    }
})

export default App;