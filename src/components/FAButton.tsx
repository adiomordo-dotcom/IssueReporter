import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface FAButtonProps {
    title: string;
    onPress: () => void;
    style?: object;
}

const FAButton: React.FC<FAButtonProps> = ({ title, onPress, style }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default FAButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        width: 36,
        height: 36,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: 16,
        bottom: 16,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});