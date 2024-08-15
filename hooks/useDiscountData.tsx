import { useState } from "react";
import { SOCKET_URL } from "@env";
import PushNotification from "react-native-push-notification";
import { triggerNotification } from "../utils/notificationUtils";

interface DiscountOffer {
	discount_offer: string;
}

export const useDiscountData = () => {
	const [discountOffer, setDiscountOffer] = useState<DiscountOffer | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);

	const connectWebSocket = () => {
		try {
			const socketUrl = SOCKET_URL;
			console.log(socketUrl);
			const newSocket = new WebSocket(`${socketUrl}12454`);
			setSocket(newSocket);

			newSocket.onopen = () => {
				console.log("WebSocket connection established");
				setError(null);
			};

			newSocket.onmessage = (event) => {
				const data: { discount_offer: string } = JSON.parse(event.data);
				triggerNotification(data.discount_offer);
				setDiscountOffer({ discount_offer: data.discount_offer });
				console.log(data);
			};

			newSocket.onerror = (error) => {
				setError("WebSocket error: " + error.message);
			};

			newSocket.onclose = () => {
				console.log("WebSocket connection closed");
				setError(null);
			};
		} catch (error) {
			setError(
				"Error establishing WebSocket connection: " + (error as Error).message
			);
		}
	};

	const disconnectWebSocket = () => {
		if (socket) {
			socket.close();
			setSocket(null);
		}
	};

	return {
		discountOffer,
		error,
		connectWebSocket,
		disconnectWebSocket,
	};
};
