module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "STOCK_DATA_API_KEY",
          moduleName: "@env",
          path: ".env",
        },
      ],
    ],
  };
};
