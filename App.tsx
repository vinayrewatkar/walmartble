import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useDiscountData } from "./hooks/useDiscountData";
import { setupNotifications } from "./utils/notificationSetup";
import { BLEAdvertisingManager } from "./components/BLEAdvertisingManager";
import { DiscountOfferDisplay } from "./components/DiscountOfferDisplay";

const App = () => {
	const [statusMessage, setStatusMessage] = useState("Not advertising");
	const { discountOffer, error, disconnectWebSocket, connectWebSocket } =
		useDiscountData();

	useEffect(() => {
		setupNotifications();
	}, []);

	if (error) {
		return <Text>Error: {error}</Text>;
	}

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text style={{ fontSize: 20, marginBottom: 20 }}>
					BLE Advertising & Scanning App
				</Text>
				<BLEAdvertisingManager
					statusMessage={statusMessage}
					setStatusMessage={setStatusMessage}
					connectWebSocket={connectWebSocket}
					disconnectWebSocket={disconnectWebSocket}
				/>
				<DiscountOfferDisplay discountOffer={discountOffer} />
			</ScrollView>
		</View>
	);
};

export default App;
