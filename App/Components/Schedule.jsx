import {View, Text, ScrollView, Dimensions} from 'react-native'
import Slot from './Slot'

const {height, width} = Dimensions.get('window')

const timeFix = (time) => {
    if (typeof time === 'number') {
        return `${time.toString().padStart(2, '0')}:00`;
    }

    if (typeof time === 'string') {
        const match = time.match(/^(\d{1,2}):(\d{2})$/);
        if (match) {
            let [_, hours, minutes] = match;
            hours = hours.padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    }
    return null;
};


const App = ({timetable}) => {
    return (
        <ScrollView
            style={{padding: 16 , height: height * 0.7}}
            contentContainerStyle={{paddingBottom: 20}}
            showsVerticalScrollIndicator={true}
        >
            {Object.entries(timetable).map(([timeSlot, classes]) => (
                <View key={timeSlot} style={{marginBottom: 16}}>
                    {classes.map((classData, index) => (
                        <Slot
                            key={`${timeSlot}-${index}`}
                            data={classData}
                            time={timeSlot.split('-')[0].split(' ')[0]}
                        />
                    ))}
                </View>
            ))}
        </ScrollView>
    )
}

export default App