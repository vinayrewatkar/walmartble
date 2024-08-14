import { useEffect, useState } from "react";
import Config from 'react-native-config';

interface DiscountOffer {
    discount_offer: string;
}

export const useDiscountData = () => {
    const [discountOffer, setDiscountOffer] = useState<DiscountOffer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let socket: WebSocket | null = null;

        const connectWebSocket = () => {
            try {
                // Access environment variable
                const socketUrl = Config.SOCKET_URL;
                console.log(socketUrl);

                if (socketUrl) {
                    socket = new WebSocket(`${socketUrl}12454`);
                    socket.onopen = () => {
                        console.log("WebSocket connection established");
                        setIsLoading(false);
                        setError(null);
                    };
                    socket.onmessage = (event) => {
                        const data: { discount_offer: string } = JSON.parse(event.data);
                        setDiscountOffer({ discount_offer: data.discount_offer });
                        console.log(data);
                    };
                    socket.onerror = (error) => {
                        setError("WebSocket error: " + error.message);
                        setIsLoading(false);
                    };
                    socket.onclose = () => {
                        console.log("WebSocket connection closed");
                        setError(null);
                    };
                }
            } catch (error) {
                setError("Error establishing WebSocket connection: " + (error as Error).message);
                setIsLoading(false);
            }
        };

        connectWebSocket();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    return { discountOffer, isLoading, error };
};