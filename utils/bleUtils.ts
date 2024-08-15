import { NativeModules } from "react-native";
import { requestPermissions } from "./permissionUtils";

const { BLEAdvertiser } = NativeModules;

export const startAdvertising = async () => {
	await requestPermissions();
	if (!BLEAdvertiser) {
		throw new Error("BLEAdvertiser module is not available");
	}

	const uuid = "00000000-0000-0000-0000-000000000000";
	const companyId = 0x004c;
	const major = 12454;
	const minor = 0;
	const payload = "1";

	await BLEAdvertiser.broadcast(uuid, major, minor, companyId, payload);
};

export const stopAdvertising = async () => {
	if (!BLEAdvertiser) {
		throw new Error("BLEAdvertiser module is not available");
	}
	await BLEAdvertiser.stopBroadcast();
};
