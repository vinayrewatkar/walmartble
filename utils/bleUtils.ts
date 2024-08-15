import { requestPermissions } from "./permissionUtils";
import BLEAdvertiser from "react-native-ble-advertiser";

export const startAdvertising = async () => {
	await requestPermissions();

	// UUID for our hypothetical contact tracing service
	const UUID = "C19CE516-0000-1000-8000-00805F9B34FB";
	// Manufacturer data
	const MANUFACTURER_DATA: number[] = [
		0x02, // Protocol version (version 2)
		0xc1,
		0x9a, // Short identifier for our app (16-bit)
		0x3f, // Transmit power level (63 in decimal, used for distance estimation)
		0x12,
		0x34,
		0x56,
		0x78, // First part of rotating identifier (changes periodically)
		0x9a,
		0xbc,
		0xde,
		0xf0, // Second part of rotating identifier
	];

	BLEAdvertiser.setCompanyId(0x00e0); // Googles's company ID as an example

	try {
		await BLEAdvertiser.broadcast(UUID, MANUFACTURER_DATA, {});
		console.log("Broadcasting started successfully,", "UUID:", UUID);
		console.log();
	} catch (error) {
		console.log("Broadcasting error", error);
	}
};

export const stopAdvertising = async () => {
	try {
		await BLEAdvertiser.stopBroadcast();
		console.log("Broadcasting stopped successfully");
	} catch (error) {
		console.log("Stop broadcasting error", error);
	}
};
