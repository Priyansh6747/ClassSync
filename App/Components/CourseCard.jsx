import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const App = ({ name, code, handleAdd, user }) => {
    const [isChecked, setIsChecked] = useState(user.subjects.includes(code));

    const toggleCheckbox = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        handleAdd(newCheckedState, code);
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.codeText}>{code}</Text>
            </View>

            <TouchableOpacity
                style={[styles.checkbox, isChecked && styles.checked]}
                onPress={toggleCheckbox}
                activeOpacity={0.7}
            >
                {isChecked && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingVertical: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(20,88,199,0.35)',
        borderRadius: 12,
        marginVertical: 4,
    },
    leftContent: {
        flex: 1,
        justifyContent: 'space-between',
        minHeight: 48,
    },
    nameText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    codeText: {
        fontSize: 14,
        color: '#c9c8c8',
        fontFamily: 'monospace',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderWidth: 2.5,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginLeft: 16,
        transition: 'all 0.2s ease',
    },
    checked: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        transform: [{ scale: 1.05 }],
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default App;