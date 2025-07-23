import { Stack } from 'expo-router';
import {StatusBar} from "react-native";
import BackgroundWrapper from "../Components/BackgroundWrapper";

export default function Layout() {
    return (
        <BackgroundWrapper>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                    headerTintColor: '#ffffff',
                    headerTitle: '',
                    animation: 'fade',
                    contentStyle: { backgroundColor: 'transparent' },
                    headerBackTitleVisible: false,
                    headerTransparent: true,
                }}
            />
        </BackgroundWrapper>
    );
}

