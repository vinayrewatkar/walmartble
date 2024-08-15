import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { styles, colors, spacing, borderRadius } from "../styles/styles";

import { DiscountCard } from "../components/DiscountCard";
import Navbar from "../components/Navbar";

export const DiscountScreen = () => {
	return (
		<ScrollView
			style={[styles.container, { paddingVertical: 50, paddingHorizontal: 30 }]}
		>
			<Navbar screen="Discounts" />
			<DiscountCard />
		</ScrollView>
	);
};
