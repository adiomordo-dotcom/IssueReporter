import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useIssueStore } from "../store";

const SUMMARY_ITEMS = [
    { key: 'open', label: 'Open', color: '#DC2626' },
    { key: 'in_progress', label: 'In Progress', color: '#D97706' },
    { key: 'resolved', label: 'Resolved', color: '#16A34A' },
] as const;

const SummaryScreen = () => {
    const issues = useIssueStore(state => state.issues);

    const counts = React.useMemo(() => {
        return Object.values(issues).reduce(
            (acc, issue) => {
                acc[issue.status] += 1;
                return acc;
            },
            { open: 0, in_progress: 0, resolved: 0 }
        );
    }, [issues]);

    const total = counts.open + counts.in_progress + counts.resolved;

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.title}>Summary</Text>
                <Text style={styles.subtitle}>Current issue distribution</Text>
            </View>

            <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total Issues</Text>
                <Text style={styles.totalValue}>{total}</Text>
            </View>

            <View style={styles.listCard}>
                {SUMMARY_ITEMS.map((item, index) => (
                    <React.Fragment key={item.key}>
                        <View style={styles.row}>
                            <View style={styles.rowLabelWrap}>
                                <View style={[styles.dot, { backgroundColor: item.color }]} />
                                <Text style={styles.rowLabel}>{item.label}</Text>
                            </View>
                            <Text style={styles.rowValue}>{counts[item.key]}</Text>
                        </View>
                        {index < SUMMARY_ITEMS.length - 1 ? <View style={styles.divider} /> : null}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
};

export default SummaryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 28,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 22,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: 0.2,
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: '#6B7280',
    },
    totalCard: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: 14,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        color: '#6B7280',
        marginBottom: 6,
    },
    totalValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
    },
    listCard: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        backgroundColor: '#FFFFFF',
    },
    row: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowLabelWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 10,
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111827',
    },
    rowValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        minWidth: 36,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
    },
});
