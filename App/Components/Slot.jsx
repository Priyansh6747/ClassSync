import { View, Text, StyleSheet } from 'react-native'

// Sample data structure:
// {
//     "type": "L",
//     "name": "Matrix Computations",
//     "code": "16B1NMA533",
//     "room": "254",
//     "teacher": "AMB",
//     "time": "09:00 - 10:30"
// }

const App = ({ data, time }) => {
    if (!data) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No course data available</Text>
                </View>
            </View>
        )
    }

    const getTypeLabel = (type) => {
        switch(type) {
            case 'L': return 'Lecture'
            case 'P': return 'Practical'
            case 'T': return 'Tutorial'
            default: return type
        }
    }

    const getTypeColor = (type) => {
        switch(type) {
            case 'L': return { bg: '#e8f5e8', text: '#2e7d32', border: '#2e7d32' }
            case 'P': return { bg: '#fff3e0', text: '#f57c00', border: '#f57c00' }
            case 'T': return { bg: '#e3f2fd', text: '#1976d2', border: '#1976d2' }
            default: return { bg: '#f5f5f5', text: '#666', border: '#666' }
        }
    }

    const typeColors = getTypeColor(data.type)
    const displayTime = time || data.time

    return (
        <View style={[styles.container, { borderLeftColor: typeColors.border }]}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.titleSection}>
                    <Text style={styles.courseName}>{data?.name}</Text>
                    <Text style={styles.courseCode}>{data?.code}</Text>
                </View>
                <View style={[styles.typeContainer, { backgroundColor: typeColors.bg }]}>
                    <Text style={[styles.typeText, { color: typeColors.text }]}>
                        {getTypeLabel(data?.type)}
                    </Text>
                </View>
            </View>

            {/* Time Section */}
            {displayTime && (
                <View style={styles.timeSection}>
                    <Text style={styles.timeText}>{displayTime}</Text>
                </View>
            )}

            {/* Details Section */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Room:</Text>
                    <Text style={styles.detailValue}>{data?.room}</Text>
                </View>

                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Teacher:</Text>
                    <Text style={styles.detailValue}>{data?.teacher}</Text>
                </View>
            </View>

            {/* Status Indicator */}
            <View style={styles.statusIndicator} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        padding: 12,
        margin: 6,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 3,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    titleSection: {
        flex: 1,
        marginRight: 8,
    },
    courseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 18,
        marginBottom: 2,
    },
    courseCode: {
        fontSize: 11,
        color: '#666',
        fontFamily: 'monospace',
    },
    typeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    timeSection: {
        marginBottom: 6,
    },
    timeText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#888',
        marginRight: 4,
    },
    detailValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    statusIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CAF50',
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    errorText: {
        fontSize: 14,
        color: '#d32f2f',
        textAlign: 'center',
        fontWeight: '500',
    },
})

export default App