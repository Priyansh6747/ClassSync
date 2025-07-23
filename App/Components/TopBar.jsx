import {View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity} from 'react-native'
import {router} from "expo-router";
import { Ionicons } from '@expo/vector-icons'

const {width: ScreenWidth, height: ScreenHeight} = Dimensions.get('window');

const App = ({setDay}) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handleDayPress = (index) => {
        setDay(index);
    };

    const handleSettingsPress = () => {
        router.push('./personalise');
    };

    return (
        <View style={styles.container}>
            <View style={styles.settingsContainer}>
                <TouchableOpacity
                    onPress={handleSettingsPress}
                >
                    <Ionicons name="settings-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: ScreenHeight * 0.5,
        width: ScreenWidth,
        backgroundColor: 'rgba(255,255,255,0.91)',
        paddingTop: 5,
    },
    settingsContainer: {
        width: ScreenWidth,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
});

export default App;