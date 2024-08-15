import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { NotificationCard } from "./components/DiscountCard"; // Make sure this path is correct
import { colors, styles } from "./styles/styles"; // Make sure this path is correct

const App = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{
                flex: 1,
                paddingVertical: 50,
                paddingHorizontal: 30,
            }}>
                <Text style={styles.textLarge}>My App</Text>
                <NotificationCard />
            </View>
        </SafeAreaView>
    );
};

export default App;