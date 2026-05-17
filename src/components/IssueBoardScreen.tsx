import React, { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useShallow } from 'zustand/react/shallow'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IssueStackParams } from '../navigation/types'
import { useIssueStore } from "../store";
import { IssueCard } from "./index";
import FAButton from "./FAButton";

const IssueBoardScreen = () => {
    const issues = useIssueStore(useShallow(state => Object.values(state.issues).map(i => i.id)));
    const isLoading = useIssueStore(state => state.isLoading);

    const navigation = useNavigation<NativeStackNavigationProp<IssueStackParams>>()

    const renderItem = useCallback(({ item: issueId }: { item: string }) => (
        <IssueCard issueId={issueId} />
    ), []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text>Loading issues...</Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <>
                    <FlatList
                        data={issues}
                        keyExtractor={(item) => item}
                        renderItem={renderItem}
                    />
                    <FAButton title="+" onPress={() => navigation.navigate('CreateIssue')} style={{ marginTop: 16 }} />
                </>
            )}
        </View>
    );
};

export default IssueBoardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});