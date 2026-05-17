import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useIssueStore } from "../store";
import { IssueStackParams } from "../navigation/types";

const IssueDetailsScreen = () => {
    const route = useRoute<RouteProp<IssueStackParams, 'IssueDetails'>>()
    const { issueId } = route.params
    const issue = useIssueStore(state => state.issues[issueId])

    if (!issue) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Issue not found</Text>
            </View>
        );
    }

    const { title, room, severity, createdAt, status, reportedBy } = issue;
    const severityColors = {
        low: '#2E7D32',
        medium: '#EF6C00',
        high: '#C62828',
    };

    const statusLabels = {
        open: 'Open',
        in_progress: 'In Progress',
        resolved: 'Resolved',
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.pageLabel}>Issue Details</Text>
                <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Status</Text>
                    <Text style={styles.metaValue}>{statusLabels[status]}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Severity</Text>
                    <View style={styles.severityRow}>
                        <View style={[styles.severityDot, { backgroundColor: severityColors[severity] }]} />
                        <Text style={styles.metaValue}>{severity}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.infoSection}>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Room</Text>
                    <Text style={styles.rowValue}>{room}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Reported by</Text>
                    <Text style={styles.rowValue}>{reportedBy}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Created at</Text>
                    <Text style={styles.rowValue}>{new Date(createdAt).toLocaleString()}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default IssueDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 32,
    },
    headerSection: {
        marginBottom: 18,
    },
    pageLabel: {
        color: '#6B7280',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 36,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    metaItem: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    metaLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.7,
        color: '#6B7280',
        marginBottom: 3,
    },
    metaValue: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '600',
    },
    severityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    infoSection: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    row: {
        paddingVertical: 14,
    },
    rowLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.7,
        color: '#6B7280',
        marginBottom: 3,
    },
    rowValue: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
}); 