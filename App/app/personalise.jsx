import {Text, View, StyleSheet} from "react-native";
import Loading from "../Components/Loading";
import {useLayoutEffect, useState} from "react";
import { collection, getDocs } from "firebase/firestore";
import {db} from "../firebaseConfig";
const app = ()=>{
    const [loading, setLoading] = useState(true);
    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "MetaData"));
                querySnapshot.forEach((doc) => {
                    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                });
            } catch (err) {
                alert(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    if (loading)
        return (
            <View style={styles.loadcontainer}>
                <Loading/>
            </View>
        )

    return (
        <View>
            <Text>Hello</Text>
        </View>
    )
}
export default app;

const styles = StyleSheet.create({
    loadcontainer: {
        flex: 1,
        justifyContent: "center",
    }
})