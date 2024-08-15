import { Image, Text, View } from "react-native";
import { colors, styles } from "../styles/styles";
import profile from "../assets/icons/profile.png";
import search from "../assets/icons/search.png";

const Navbar = () => {
	return (
		<View
			style={[
				styles.container,
				{
					maxHeight: 70,
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 50,
				},
			]}
		>
			<Image style={{ width: 30, height: 30 }} source={profile}></Image>
			<Text
				style={[styles.textMedium, styles.textBold, { color: colors.black }]}
			>
				Home
			</Text>
			<Image style={{ width: 30, height: 30 }} source={search}></Image>
		</View>
	);
};

export default Navbar;
