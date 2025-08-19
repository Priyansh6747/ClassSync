import {Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {formatTimetable, get_timetable} from "../Helper/Data";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {getUser} from "../Helper/storage";
import InfoBar from "../Components/InfoBar";
import Loading from "../Components/Loading";
import DaySelector from "../Components/DaySelector";
import Slot from "../Components/Slot";
import Schedule from "../Components/Schedule";


const App = ()=> {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [timetable, setTimetable] = useState(null);
    const [url, setUrl] = useState("");
    const [day, setDay] = useState(new Date().getDay());

    const dayOptions = ["MON","TUES","WED","THUR","FRI","SAT"];

    useEffect(() => {
        const initialfetch = async () => {
            try {
                const [querySnapshot, userData] = await Promise.all([
                    getDocs(collection(db, "URL")),
                    getUser()
                ]);

                let fetchedUrl = '';
                querySnapshot.forEach((doc) => {
                    fetchedUrl = doc.data()["128"];
                });
                setUrl(fetchedUrl);

                if (userData) {
                    setUser(userData);
                }
                if (user && url) {
                    await formatTimetable(url,user).then(timetable => setTimetable(timetable));
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
                alert(err);
            } finally {
                setLoading(false);
            }
        }
        initialfetch();
    },[])

    useEffect(() => {
        const fetch = async () => {
            try {
                if (user && url) {
                    await formatTimetable(url,user).then(timetable => setTimetable(timetable));
                }
            } catch (error) {
                alert(error);
            }
        }
        fetch();
    }, [user, url])

    useEffect(() => {
        console.log(JSON.stringify(timetable));
        console.log(JSON.stringify(user));
    }, [timetable]);


    if (loading || !timetable) {
        return (
            <View style={{flex: 1,justifyContent: "center"}}>
                <Loading />
            </View>
        );
    }

    return (
        <View>
            <InfoBar batch={user?.batch} year={user?.year} name={user?.name} />
            <DaySelector dayIdx = {day} setDayIdx = {setDay} />
            <Schedule timetable={timetable[dayOptions[day]]} />
        </View>
    )
}

export default App;