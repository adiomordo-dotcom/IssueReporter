import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useWebSocket } from "../hooks";
import { IssueSeverity } from "../types";

const SEVERITIES: IssueSeverity[] = ['low', 'medium', 'high'];

const CreateIssueModal = () => {
    const navigation = useNavigation();
    const { send } = useWebSocket();

    const [title, setTitle] = useState('');
    const [room, setRoom] = useState('');
    const [reportedBy, setReportedBy] = useState('');
    const [severity, setSeverity] = useState<IssueSeverity | null>(null);

    const isValid = title.trim() && room.trim() && reportedBy.trim() && severity;

    const handleSubmit = () => {
        if (!isValid) return;
        send({
            type: 'NEW_ISSUE',
            issue: {
                id: Date.now().toString(),
                title: title.trim(),
                room: room.trim(),
                reportedBy: reportedBy.trim(),
                severity,
                status: 'open',
                createdAt: Date.now(),
            }
        });
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>New Issue</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} placeholder="e.g. Crack in wall" value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Room</Text>
            <TextInput style={styles.input} placeholder="e.g. Room 101" value={room} onChangeText={setRoom} />

            <Text style={styles.label}>Reported By</Text>
            <TextInput style={styles.input} placeholder="Your name" value={reportedBy} onChangeText={setReportedBy} />

            <Text style={styles.label}>Severity</Text>
            <View style={styles.severityRow}>
                {SEVERITIES.map(s => (
                    <Pressable
                        key={s}
                        style={[styles.severityBtn, severity === s && styles.severitySelected]}
                        onPress={() => setSeverity(s)}
                    >
                        <Text style={[styles.severityText, severity === s && styles.severityTextSelected]}>
                            {s}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Pressable style={[styles.button, !isValid && styles.buttonDisabled]} onPress={handleSubmit} disabled={!isValid}>
                <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
        </View>
    );
};

export default CreateIssueModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    input: {
        height: 44,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    severityRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    severityBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    severitySelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    severityText: {
        fontSize: 14,
        color: '#333',
        textTransform: 'capitalize',
    },
    severityTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
