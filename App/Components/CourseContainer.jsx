import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card from './CourseCard';

const App = ({ dep, courses,user, setUser }) => {
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
                    subjects: prevUser.subjects.filter(code => code !== courseCode)
                };
            }
            return prevUser;
        });
    };

    if (!courses || courses.length === 0) {
        return null
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.departmentTitle}>{dep.toUpperCase()} Courses</Text>
            </View>
            {courses.map((course, index) => (
                <Card
                    key={index}
                    name={course.name}
                    code={course.code}
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
});

export default App;