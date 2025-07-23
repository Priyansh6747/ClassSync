import {Text, View, StyleSheet, Dimensions, ScrollView} from "react-native";
import Loading from "../Components/Loading";
import React, {useEffect, useLayoutEffect, useState} from "react";
import { collection, getDocs } from "firebase/firestore";
import {db} from "../firebaseConfig";
import Button from "../Components/Button";
import CC from "../Components/CourseContainer";
import User from "../Components/UserInfo";
import {getUser, storeUser} from "../Helper/storage";
import {router} from "expo-router";

const { height, width } = Dimensions.get('window');

const app = ()=>{
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState(null);
    const [user, setUser] = useState({
        batch: "F1",
        subjects:[]
    });

    const saveUser = async ()=>{
        try {
            await storeUser(user)
        }catch(err){
            alert(err)
        }
    }

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [querySnapshot, user,] = await Promise.all([
                    getDocs(collection(db, "MetaData")),
                    getUser()
                ]);

                querySnapshot.forEach((doc) => {
                    setMetadata(doc.data());
                });

                if (user) {
                    setUser(user);
                }
            } catch (err) {
                alert(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);


    if (loading)
        return (
            <View style={styles.loadContainer}>
                <Loading/>
            </View>
        )

    return (
        <View style={styles.container}>
            <ScrollView style={{flex:1}}>
                <User user={user} setUser={setUser} />
                <CC setUser={setUser} dep="cs" courses={metadata.data.subjects.cs} user={user} />
                <CC setUser={setUser} dep="ec" courses={metadata.data.subjects.ec} user={user}/>
                <CC setUser={setUser} dep="hs" courses={metadata.data.subjects.hs} user={user}/>
                <CC setUser={setUser} dep="ph" courses={metadata.data.subjects.ph} user={user}/>
                <CC setUser={setUser} dep="ma" courses={metadata.data.subjects.ma} user={user}/>
                <CC setUser={setUser} dep="oth" courses={metadata.data.subjects.oth}/>
                <View style={styles.button}>
                    <Button height={height * 0.07} width={width*0.5} text="Apply"
                            onPress={()=>{
                                saveUser().then(r =>
                                router.navigate('./timetable')
                                )
                            }}
                    />
                </View>
            </ScrollView>

        </View>
    )
}
export default app;

const styles = StyleSheet.create({
    loadContainer: {
        flex: 1,
        justifyContent: "center",
    },
    container: {
        flex: 1,
        justifyContent: "flex-end",
    },
    button: {
        marginVertical: '5%',
        justifyContent: "center",
        alignItems: "center",
        zIndex:9,
    },
})