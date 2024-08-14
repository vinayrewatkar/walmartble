import React from "react";
import { Text, View } from "react-native";

interface DiscountOfferDisplayProps {
	discountOffer: { discount_offer: string } | null;
}

export const DiscountOfferDisplay: React.FC<DiscountOfferDisplayProps> = ({
	discountOffer,
}) => {
	return (
		<View>
			{discountOffer ? (
				<Text>{discountOffer.discount_offer}</Text>
			) : (
				<>
					<Text>Discount Offer</Text>
					<Text>No discount offer available</Text>
				</>
			)}
		</View>
	);
};
