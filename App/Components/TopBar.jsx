import {View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity} from 'react-native'
import {router} from "expo-router";
import { Ionicons } from '@expo/vector-icons'

const {width: ScreenWidth, height: ScreenHeight} = Dimensions.get('window');

const App = ({Day, setDay}) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


    const handleSettingsPress = () => {
        router.push('./personalise');
    };
    return (
        <View style={styles.container}>
            <View style={styles.settingsContainer}>
                <TouchableOpacity
                    onPress={handleSettingsPress}>
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {days.map((day, index) => (
                    <TouchableOpacity onPress={()=>{setDay(index)}} key={index}
                                      style={Day === index? styles.DaySelected : styles.Day}>
                        <Text>{days[index]}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: ScreenHeight * 0.1,
        width: ScreenWidth,
        backgroundColor: 'transparent',
    },
    settingsContainer: {
        width: ScreenWidth,
        height: '50%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: 'transparent',
    },
    DayScrollView: {
        height:'100%',
        flexDirection: 'row',
    },
    Day:{
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'blue',
        marginHorizontal: '5%',
        height: '100%',
        width: '40%'
    },
    DaySelected: {
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'red',
        marginHorizontal: '5%',
        height: '100%',
        width: '40%'
    }
});
export default App;