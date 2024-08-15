import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { styles, colors, spacing, borderRadius } from "../styles/styles";
import Navbar from "./Navbar";

export const DiscountCard = () => {
	return (
		<View>
			<Text
				style={[styles.textMedium, styles.textRegular, styles.marginBottom]}
			>
				Previously
			</Text>
			<View
				style={[
					styles.card,
					{ backgroundColor: colors.primary, padding: 0, overflow: "hidden" },
				]}
			>
				<View style={styles.row}>
					<Image
						source={{ uri: "https://example.com/image.jpg" }}
						style={{
							width: 100,
							height: "100%",
							marginRight: spacing.md,
						}}
					/>
					<View
						style={{
							flex: 1,
							padding: spacing.md,
							justifyContent: "space-between",
						}}
					>
						<Text
							style={[
								styles.textRegular,
								styles.textBold,
								{ color: colors.white, marginBottom: spacing.md },
							]}
						>
							30% discount on all home decoration products
						</Text>
						<TouchableOpacity
							style={[
								{
									alignSelf: "stretch",
									backgroundColor: colors.secondary,
									paddingVertical: spacing.sm,
									borderRadius: borderRadius.round,
								},
							]}
						>
							<Text
								style={[
									styles.buttonText,
									styles.textRegular,
									{ color: colors.black },
								]}
							>
								GET NOW
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
};
