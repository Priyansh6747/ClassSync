import {Text, View, StyleSheet} from "react-native";
import Loading from "../Components/Loading";

const app = ()=>{
    return (
        <View style={styles.container}>
            <Loading/>
        </View>
    )
}
export default app;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    }
})