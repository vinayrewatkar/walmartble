import PushNotification from "react-native-push-notification";
import { Platform } from "react-native";
import { requestNotificationPermission } from "./permissionUtils";

export const setupNotifications = () => {
	PushNotification.configure({
		onNotification: function (notification) {
			console.log("Notification:", notification);
		},
		requestPermissions: Platform.OS === "ios",
	});

	PushNotification.createChannel(
		{
			channelId: "discount-alerts",
			channelName: "Default Alerts",
			channelDescription: "A channel for sending discount alert notifications.",
		},
		(created) => console.log(`CreateChannel returned '${created}'`)
	);

	requestNotificationPermission();
};
