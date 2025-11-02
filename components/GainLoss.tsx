import { Text } from "react-native";
import useColors from "@/hooks/useColors";

export default function GainLoss({
  price,
  average,
}: {
  price: number;
  average: number;
}) {
  const colors = useColors();
  const currentPrice = Number(price);
  const movingAvg = Number(average);

  const difference = currentPrice - movingAvg;
  const percentChange = (difference / movingAvg) * 100;
  const isPositive = difference >= 0;

  return (
    <Text
      style={{
        color: isPositive ? colors.success : colors.danger,
        fontSize: 12,
        fontWeight: "600",
        marginTop: 4,
      }}
    >
      {isPositive ? "+" : ""}
      {difference.toFixed(2)} ({percentChange.toFixed(2)}%)
    </Text>
  );
}
