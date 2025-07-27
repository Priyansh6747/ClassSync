import { Text, View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Loading from "../Components/Loading";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Button from "../Components/Button";
import CC from "../Components/CourseContainer";
import User from "../Components/UserInfo";
import { getUser, storeUser } from "../Helper/storage";
import { router } from "expo-router";
import { getSubjects } from "../Helper/Data";

const { height, width } = Dimensions.get('window');

const app = () => {
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState(null);
    const [mode, setMode] = useState(true);
    const [url, setUrl] = useState("");
    const [user, setUser] = useState({
        name: "",
        year: "1",
        batch: "F1",
        subjects: []
    });

    const saveUser = async () => {
        try {
            await storeUser(user);
        } catch (err) {
            alert(err);
        }
    };
    const fetchSubjects = async () => {
        if (!url || !user.year) {
            return;
        }

        try {
            const subjects = await getSubjects(url, user.year);
            setMetadata(subjects);
        } catch (err) {
            alert('Failed to fetch subjects: ' + err.message);
        }
    };


    useEffect(() => {
        const fetchInitialData = async () => {
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
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchSubjects()

    }, [url, user.year]);
    useEffect(() => {
        console.log("metadata " + JSON.stringify(metadata));
    },[metadata])

    if (loading) {
        return (
            <View style={styles.loadContainer}>
                <Loading />
            </View>
        );
    }

    if (mode) {
        return (
            <View style={styles.loadContainer}>
                <User user={user} setUser={setUser} setMode={setMode} fetchSubjects={fetchSubjects} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                <CC courses={metadata} setUser={setUser} user={user} title="Courses" />
                <View style={styles.button}>
                    <Button
                        height={height * 0.07}
                        width={width * 0.5}
                        text="Apply"
                        onPress={() => {
                            saveUser().then(() => {
                                router.navigate('./timetable');
                            });
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

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
        zIndex: 9,
    },
    subjectsContainer: {
        padding: 20,
        margin: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    subjectsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subjectItem: {
        fontSize: 16,
        marginVertical: 2,
        paddingLeft: 10,
    },
});