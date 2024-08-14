module.exports = {
	presets: ["module:@react-native/babel-preset"],
	plugins: [
		[
			"module:react-native-dotenv",
			{
				envName: "SOCKET_URL",
				moduleName: "@env",
				path: ".env",
			},
		],
	],
};
