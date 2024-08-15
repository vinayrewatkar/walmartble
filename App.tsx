import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BLEAdvertisingManager } from "./components/BLEAdvertisingManager";
import { DiscountOfferDisplay } from "./components/DiscountOfferDisplay";
import { useDiscountData } from "./hooks/useDiscountData";
import { colors, styles } from "./styles/styles";
import { setupNotifications } from "./utils/notificationSetup";

const App = () => {
	const [statusMessage, setStatusMessage] = useState("Not advertising");
	const { discountOffer, error, disconnectWebSocket, connectWebSocket } =
		useDiscountData();

	useEffect(() => {
		setupNotifications();
	}, []);

	if (error) {
		return (
			<Text
				style={[styles.textMedium, styles.textBold, { color: colors.error }]}
			>
				Error: {error}
			</Text>
		);
	}

	return (
		<View style={[styles.container, styles.centerContent]}>
			<ScrollView
				contentContainerStyle={[
					styles.container,
					styles.centerContent,
					styles.paddingHorizontal,
				]}
			>
				<Text
					style={[
						styles.textLarge,
						styles.textBold,
						styles.marginBottom,
						{ color: colors.primary },
					]}
				>
					Blue Retail
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
