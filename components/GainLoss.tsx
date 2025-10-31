import { Text, View } from "react-native";

export default function GainLoss({
  price,
  average,
}: {
  price: Number;
  average: Number;
}) {
  const currentPrice = Number(price);
  const movingAvg = Number(average);

  const difference = currentPrice - movingAvg;
  const percentChange = (difference / movingAvg) * 100;
  const isPositive = difference >= 0;

  return (
    <Text
      className={`text-xs font-semibold mt-1 ${
        isPositive ? "text-green-400" : "text-red-400"
      }`}
    >
      {isPositive ? "+" : ""}
      {difference.toFixed(2)} ({percentChange.toFixed(2)}%)
    </Text>
  );
}
