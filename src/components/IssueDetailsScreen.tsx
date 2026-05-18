import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useWebSocket } from "../hooks";
import { useIssueStore } from "../store";
import { IssueStackParams } from "../navigation/types";
import { SEVERITY_COLORS, STATUS_LABELS, STATUS_ORDER } from "../constants";
import { IssueStatus } from "../types";

const Divider = () => <View style={styles.divider} />;

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
    </View>
);

const DeleteButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.deleteSection}>
        <Text style={styles.deleteText}>Delete Issue</Text>
    </TouchableOpacity>
);

const StatusButton = ({ onPress, disabled, nextStatus }: { onPress: () => void; disabled: boolean; nextStatus: IssueStatus | null }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.statusButton, disabled && styles.statusButtonDisabled]}
    >
        <Text>{nextStatus ? `Mark as ${STATUS_LABELS[nextStatus]}` : 'Resolved'}</Text>
    </TouchableOpacity>
);

const IssueDetailsScreen = () => {
    const { send } = useWebSocket();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<IssueStackParams, 'IssueDetails'>>()
    const { issueId } = route.params

    const issue = useIssueStore(state => state.issues[issueId])
    const deleteIssue = useIssueStore(state => state.removeIssue)

    const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(issue?.status) + 1]

    const handleStatusUpdate = () => {
        if (!nextStatus) return
        useIssueStore.getState().updateIssue({ ...issue, status: nextStatus }) // optimistic
        send({ type: 'UPDATE_STATUS', issueId, status: nextStatus })
    }


    const handleDelete = () => {
        navigation.goBack()
        deleteIssue(issueId)
    }

    const opacity = useSharedValue(1);

    const isMounted = React.useRef(false)

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }
        opacity.value = withTiming(0, { duration: 150 }, () => {
            opacity.value = withTiming(1, { duration: 150 })
        })
    }, [issue?.status])

    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

    if (!issue) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Issue not found</Text>
            </View>
        );
    }

    const { title, room, severity, createdAt, status, reportedBy } = issue;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.pageLabel}>Issue Details</Text>
                <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Status</Text>
                    <Animated.Text style={[styles.metaValue, animatedStyle]}>{STATUS_LABELS[status]}</Animated.Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Severity</Text>
                    <View style={styles.severityRow}>
                        <View style={[styles.severityDot, { backgroundColor: SEVERITY_COLORS[severity] }]} />
                        <Text style={styles.metaValue}>{severity}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.infoSection}>
                <InfoRow label="Room" value={room} />
                <Divider />
                <InfoRow label="Reported by" value={reportedBy} />
                <Divider />
                <InfoRow label="Created at" value={new Date(createdAt).toLocaleString()} />
            </View>

            <StatusButton onPress={handleStatusUpdate} disabled={!nextStatus} nextStatus={nextStatus} />
            <DeleteButton onPress={handleDelete} />
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
    deleteSection: {
        bottom: 0,
        margin: 10,
        marginTop: 24,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        paddingVertical: 12,
        backgroundColor: '#FFF5F5',
    },
    deleteText: {
        color: '#C62828',
        fontSize: 16,
        fontWeight: '600',
    },
    statusButton: {
        margin: 10,
        marginTop: 24,
        backgroundColor: '#E3F2FD',
        borderColor: '#90CAF9',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    statusButtonDisabled: {
        backgroundColor: '#F1F5F9',
        borderColor: '#E5E7EB',
    },
}); 