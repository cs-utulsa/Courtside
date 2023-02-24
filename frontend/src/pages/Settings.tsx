import { DangerButton, ThemeSelector } from '@components/index';
import { useAuth } from '@hooks/index';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

/**
 * This component allows the user to access settings about the app and to log out of the app.
 */
export const Settings = () => {
    const { signOut, clearData } = useAuth();

    return (
        <View style={styles.pageContainer}>
            <View style={styles.pageContainer}>
                <Text style={styles.heading}>Account Information</Text>
            </View>
            <Text style={styles.heading}>Appearance</Text>
            <ThemeSelector />
            <Text style={styles.heading}>Actions</Text>
            <DangerButton text="Clear Data" onPress={clearData} />
            <DangerButton text="Log Out" onPress={signOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 24,
    },
});
