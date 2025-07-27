import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card from './CourseCard';

const CourseContainer = ({ title, courses, user, setUser }) => {
    const handleAdd = (isChecked, courseCode) => {
        setUser(prevUser => {
            if (isChecked) {
                // Add course to subjects if not already present
                if (prevUser.subjects && !prevUser.subjects.includes(courseCode)) {
                    return {
                        ...prevUser,
                        subjects: [...prevUser.subjects, courseCode]
                    };
                }
            } else {
                // Remove course from subjects
                return {
                    ...prevUser,
                    subjects: prevUser.subjects ? prevUser.subjects.filter(code => code !== courseCode) : []
                };
            }
            return prevUser;
        });
    };

    if (!courses || courses.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noCoursesText}>No courses available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.departmentTitle}>{title ? title.toUpperCase() : 'COURSES'}</Text>
            </View>
            {courses.map((course, index) => (
                <Card
                    key={`${course.Code}-${index}`}
                    name={course.Subject}
                    code={course.Code}
                    handleAdd={handleAdd}
                    user={user}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(65,94,245,0)',
        paddingHorizontal: 16,
    },
    header: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 16,
    },
    departmentTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    noCoursesText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginTop: 50,
    },
});

export default CourseContainer;