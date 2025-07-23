import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUser = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        console.log(jsonValue);
        await AsyncStorage.setItem('user', jsonValue);
    } catch (e) {
        alert(e)
    }
};

const getUser = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('user');
        console.log(jsonValue);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        alert(e)
    }
};

export { getUser, storeUser };