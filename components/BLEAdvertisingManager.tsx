import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { startAdvertising, stopAdvertising } from "../utils/bleUtils";

interface BLEAdvertisingManagerProps {
	statusMessage: string;
	setStatusMessage: (message: string) => void;
	connectWebSocket: () => void;
	disconnectWebSocket: () => void;
}

export const BLEAdvertisingManager: React.FC<BLEAdvertisingManagerProps> = ({
	statusMessage,
	setStatusMessage,
	connectWebSocket,
	disconnectWebSocket,
}) => {
	const [isAdvertising, setIsAdvertising] = useState(false);

	const handleStartAdvertising = async () => {
		connectWebSocket();
		try {
			await startAdvertising();
			setIsAdvertising(true);
			setStatusMessage("Advertising started with Major: 12454");
		} catch (error) {
			console.error("Error starting advertising:", error);
			setStatusMessage(`Error: ${error}`);
		}
	};

	const handleStopAdvertising = async () => {
		disconnectWebSocket();
		try {
			await stopAdvertising();
			setIsAdvertising(false);
			setStatusMessage("Advertising stopped");
		} catch (error) {
			console.error("Error stopping advertising:", error);
			setStatusMessage(`Error: ${error}`);
		}
	};

	return (
		<View>
			<Text style={{ fontSize: 16, marginBottom: 10 }}>
				Status: {statusMessage}
			</Text>
			<Button
				title={isAdvertising ? "Stop Advertising" : "Start Advertising"}
				onPress={isAdvertising ? handleStopAdvertising : handleStartAdvertising}
			/>
		</View>
	);
};
