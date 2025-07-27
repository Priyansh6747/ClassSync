import {Text, View} from "react-native";
import {useEffect, useState} from "react";
import {formatTimetable, get_timetable} from "../Helper/Data";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {getUser} from "../Helper/storage";


const App = ()=> {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [timetable, setTimetable] = useState(null);
    const [url, setUrl] = useState("");

    const fetchData = async () => {
        try {
            let data = await get_timetable(url,user.year);
            setTimetable(data);

        }catch(error){
            alert( "Error " + error)
        }finally {
            setLoading(false);
        }
    }


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
    return (
        <View>
            <Text>Hello</Text>
        </View>
    )
}

export default App;