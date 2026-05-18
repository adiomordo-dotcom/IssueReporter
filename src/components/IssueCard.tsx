import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIssueStore } from "../store";
import { IssueStackParams } from "../navigation/types";
import { SEVERITY_COLORS, STATUS_LABELS } from "../constants";

interface IssueCardProps {
    issueId: string;
}

const IssueCard = ({ issueId }: IssueCardProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<IssueStackParams>>();
    const issue = useIssueStore(state => state.issues[issueId]);

    if (!issue) {
        return null;
    }

    const { title, room, severity, status } = issue;

    return (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.room}>Status: {STATUS_LABELS[status]}</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.room}>{room}</Text>
                <View style={styles.severityContainer}>
                    <Text style={styles.severityText}>{severity}</Text>
                    <View style={[styles.severityIndicator, { backgroundColor: SEVERITY_COLORS[severity] }]}></View>
                </View>
            </View>
            <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('IssueDetails', { issueId })}>
                    <Text style={styles.detailsLink}>View Details</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};

export default memo(IssueCard);

const styles = StyleSheet.create({
    card: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5EAF3',
        marginBottom: 8,
        flexDirection: 'row',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 24,
    },
    room: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    severityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    severityIndicator: {
        width: 30,
        height: 10,
        borderRadius: 5,
        marginLeft: 8,
    },
    severityText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        color: '#374151',
    },
    detailsLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
        letterSpacing: 0.2,
    },
}); 