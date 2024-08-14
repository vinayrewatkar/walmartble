import { useState, useEffect } from "react";
import { SOCKET_URL } from "@env";

interface DiscountOffer {
	discount_offer: string;
}

export const useDiscountData = () => {
	const [discountOffer, setDiscountOffer] = useState<DiscountOffer | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		const socketUrl = SOCKET_URL;
		const newSocket = new WebSocket(`${socketUrl}12454`);
		setSocket(newSocket);

		newSocket.onopen = () => {
			console.log("WebSocket connection established");
			setError(null);
		};

		newSocket.onmessage = (event) => {
			const data: { discount_offer: string } = JSON.parse(event.data);
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

		return () => {
			newSocket.close();
		};
	}, []);

	const disconnectWebSocket = () => {
		if (socket) {
			socket.close();
			console.log("WebSocket connection closed");
			setSocket(null);
		}
	};

	return {
		discountOffer,
		error,
		disconnectWebSocket,
	};
};
