import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { startAdvertising, stopAdvertising } from "../utils/bleUtils";
import { styles } from "../styles/styles";

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
		<View style={{ maxWidth: 300 }}>
			<Text style={[styles.textRegular, styles.marginBottom]}>
				Status: {statusMessage}
			</Text>
			<TouchableOpacity
				style={[styles.buttonPrimary, isAdvertising && styles.buttonSecondary]}
				onPress={isAdvertising ? handleStopAdvertising : handleStartAdvertising}
			>
				<Text style={styles.buttonText}>
					{isAdvertising ? "Stop Advertising" : "Start Advertising"}
				</Text>
			</TouchableOpacity>
		</View>
	);
};
