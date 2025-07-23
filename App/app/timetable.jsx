import {View,Text} from 'react-native'
import React, {useEffect} from "react";
import {getUser} from "../Helper/storage";
import {router} from "expo-router";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebaseConfig";
import Loading from "../Components/Loading";
import Bar from "../Components/TopBar";

const App = ()=>{
    const [user, setUser] = React.useState(null);
    const [metadata, setMetadata] = React.useState(null);
    const [timetable, setTimetable] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [day, setDay] = React.useState(0);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [querySnapshotMetaData, user,querySnapshotTimeTable] = await Promise.all([
                    getDocs(collection(db, "MetaData")),
                    getUser(),
                    getDocs(collection(db, "Timetable")),
                ]);

                querySnapshotMetaData.forEach((doc) => {
                    setMetadata(doc.data());
                });

                querySnapshotTimeTable.forEach((doc) => {
                    setTimetable(doc.data());
                })

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
            <View style={{flex: 1, justifyContent: "center",}}>
                <Loading/>
            </View>
        )
    return (
        <View>
            <Bar setDay={setDay}/>
        </View>
    )
}
export default App;