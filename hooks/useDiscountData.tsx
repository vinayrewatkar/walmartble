import { useState } from "react";

import { SOCKET_URL } from "@env";

interface DiscountOffer {
	discount_offer: string;
}

export const useDiscountData = () => {
	const [discountOffer, setDiscountOffer] = useState<DiscountOffer | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);

	let socket: WebSocket | null = null;
	const socketUrl = SOCKET_URL;
	const connectWebSocket = () => {
		try {
			if (socketUrl) {
				socket = new WebSocket(`${socketUrl}12454`);
				socket.onopen = () => {
					console.log("WebSocket connection established");

					setError(null);
				};
				socket.onmessage = (event) => {
					const data: { discount_offer: string } = JSON.parse(event.data);
					setDiscountOffer({ discount_offer: data.discount_offer });
					console.log(data);
				};
				socket.onerror = (error) => {
					setError("WebSocket error: " + error.message);
				};
				socket.onclose = () => {
					console.log("WebSocket connection closed");
					setError(null);
				};
			}
		} catch (error) {
			setError(
				"Error establishing WebSocket connection: " + (error as Error).message
			);
		}
	};

	const disconnectWebSocket = () => {
		return () => {
			if (socket) {
				socket.close();
			}
		};
	};

	return { discountOffer, connectWebSocket, disconnectWebSocket, error };
};
