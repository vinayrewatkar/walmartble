import React, { useEffect, useState } from "react";
import {
	Button,
	NativeModules,
	PermissionsAndroid,
	Platform,
	Text,
	View,
	ScrollView,
} from "react-native";
import { useDiscountData } from "./hooks/useDiscountData";

const { BLEAdvertiser } = NativeModules;

const App = () => {
	const [isAdvertising, setIsAdvertising] = useState(false);
	const [statusMessage, setStatusMessage] = useState("Not advertising");
	const { discountOffer, error, connectWebSocket, disconnectWebSocket } =
		useDiscountData();

	useEffect(() => {
		if (!BLEAdvertiser) {
			console.error("BLEAdvertiser module is not available");
			setStatusMessage("BLEAdvertiser module is not available");
			return;
		}

		requestPermissions();
	}, []);

	const requestPermissions = async () => {
		if (Platform.OS === "android" && Platform.Version >= 23) {
			try {
				await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
				]);
				console.log("Permissions requested");
			} catch (error) {
				console.error("Error requesting permissions:", error);
			}
		}
	};

	const startAdvertising = async () => {
		requestPermissions();
		connectWebSocket();
		try {
			if (!BLEAdvertiser) {
				throw new Error("BLEAdvertiser module is not available");
			}

			const uuid = "00000000-0000-0000-0000-000000000000"; // This remains the same
			const companyId = 0x004c; // Example Company ID
			const major = 12454;
			const minor = 0;
			const payload = "1"; // No additional payload for simplicity

			await BLEAdvertiser.broadcast(uuid, major, minor, companyId, payload);
			setIsAdvertising(true);
			setStatusMessage("Advertising started with Major: 12454");
		} catch (error) {
			console.error("Error starting advertising:", error);
			setStatusMessage(`Error: ${error}`);
		}
	};

	const stopAdvertising = async () => {
		disconnectWebSocket();
		try {
			if (!BLEAdvertiser) {
				throw new Error("BLEAdvertiser module is not available");
			}
			await BLEAdvertiser.stopBroadcast();
			setIsAdvertising(false);
			setStatusMessage("Advertising stopped");
		} catch (error) {
			console.error("Error stopping advertising:", error);
			setStatusMessage(`Error: ${error}`);
		}
	};

	if (error) {
		return <Text>Error: {error}</Text>;
	}

	return (
		<ScrollView>
			<View
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text style={{ fontSize: 20, marginBottom: 20 }}>
					BLE Advertising & Scanning App
				</Text>
				<Text style={{ fontSize: 16, marginBottom: 10 }}>
					Status: {statusMessage}
				</Text>
				<Button
					title={isAdvertising ? "Stop Advertising" : "Start Advertising"}
					onPress={isAdvertising ? stopAdvertising : startAdvertising}
				/>
				{discountOffer ? (
					<Text>{discountOffer.discount_offer}</Text>
				) : (
					<>
						<Text>Discount Offer</Text>
						<Text>No discount offer available</Text>
					</>
				)}
			</View>
		</ScrollView>
	);
};

export default App;
