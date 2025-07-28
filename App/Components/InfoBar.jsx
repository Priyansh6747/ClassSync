import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import {router} from "expo-router";

const App = ({ name, batch, year }) => {
    const handleSettingsPress = () => {
        router.navigate('./personalise')
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <View style={styles.leftSection}>
                    <Text style={styles.nameText}>{name}</Text>
                    <View style={styles.batchContainer}>
                        <View style={styles.batchBadge}>
                            <Text style={styles.batchText}>Batch {batch}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.rightSection}>
                    <View style={styles.yearContainer}>
                        <Text style={styles.yearText}>{year} year</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
                    <View style={styles.settingsIcon}>
                        <Text style={styles.settingsIconText}>
                            <Ionicons name="settings-outline" size={24} color="white" />
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.gradientOverlay} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    topBar: {
        backgroundColor: 'rgba(99,102,241,0.39)',
        paddingHorizontal: 24,
        paddingVertical: 20,
        paddingTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        pointerEvents: 'none',
    },
    leftSection: {
        flex: 1,
        paddingRight: 16,
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 12,
    },
    nameText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    batchContainer: {
        marginTop: 4,
    },
    batchBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    batchText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    yearContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    yearText: {
        color: '#F1F5F9',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    settingsButton: {
        position: 'absolute',
        top: 10,
        right: 15,
        zIndex: 10,
    },
    settingsIcon: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    settingsIconText: {
        fontSize: 20,
        color: '#FFFFFF',
    },
});

export default App;