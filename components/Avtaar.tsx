import { Text, View } from "react-native";
import useColors from "@/hooks/useColors";
import { useMemo } from "react";

const getRandomColor = (palette: string[]) => {
  return palette[Math.floor(Math.random() * palette.length)];
};

export default function Avtaar({
  initials,
  size = 40,
}: {
  initials: string;
  size?: number;
}) {
  const colors = useColors();

  // useMemo prevents re-randomizing color on every render
  const bgColor = useMemo(() => getRandomColor(colors.avtaarPalette), [colors]);

  return (
    <View
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          color: "black",
          fontWeight: "700",
          fontSize: size * 0.4,
        }}
      >
        {initials.toUpperCase()}
      </Text>
    </View>
  );
}
