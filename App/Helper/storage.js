import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUser = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('user', jsonValue);
    } catch (e) {
        alert(e)
    }
};

const getUser = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('user');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        alert(e)
    }
};

export { getUser, storeUser };