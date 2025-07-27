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
        const fetchSubjects = async () => {
            if (!url || !user.year) {
                console.log('URL or user year not available yet');
                return;
            }

            try {
                console.log('Fetching subjects with URL:', url, 'and year:', user.year);
                const subjects = await getSubjects(url, user.year);
                console.log('Fetched subjects:', subjects);

                setMetadata(subjects);

                setUser(prevUser => ({
                    ...prevUser,
                    subjects: subjects
                }));
            } catch (err) {
                console.error('Error fetching subjects:', err);
                alert('Failed to fetch subjects: ' + err.message);
            }
        };

        fetchSubjects();
    }, [url, user.year]);

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
                <User user={user} setUser={setUser} setMode={setMode} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                {/* Display subjects if available */}
                {metadata && metadata.length > 0 && (
                    <View style={styles.subjectsContainer}>
                        <Text style={styles.subjectsTitle}>Available Subjects:</Text>
                        {metadata.map((subject, index) => (
                            <Text key={index} style={styles.subjectItem}>
                                {subject}
                            </Text>
                        ))}
                    </View>
                )}

                <View style={styles.button}>
                    <Button
                        height={height * 0.07}
                        width={width * 0.5}
                        text="Apply"
                        onPress={() => {
                            saveUser().then(() =>
                                router.navigate('./timetable')
                            );
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