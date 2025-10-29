import { Text, View } from "react-native";

const getRandomColor = () => {
  const colors = ["#FEE2E2", "#FEF9C3", "#DCFCE7", "#E0E7FF", "#F3E8FF"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function Avtaar({
  initials,
  size,
}: {
  initials: string;
  size?: number;
}) {
  const bgColor = getRandomColor();

  return (
    <View
      className="w-12 h-12 rounded-full items-center justify-center mb-2 "
      style={{
        backgroundColor: bgColor,
        width: size ?? 40,
        height: size ?? 40,
      }}
    >
      <Text className="text-lg font-bold text-gray-800">{initials}</Text>
    </View>
  );
}
