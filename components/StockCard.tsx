import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Avtaar from "./Avtaar";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function StockCard({
  symbol,
  price,
  change,
  isMain = true,
  onRemove,
}: {
  symbol: string;
  price: number;
  change?: number;
  isMain?: boolean;
  onRemove?: (symbol: string) => void;
}) {
  const { isDark } = useTheme();
  const router = useRouter();

  const gainColor =
    change === undefined
      ? isDark
        ? "#AAAAAA"
        : "#6B7280"
      : change > 0
        ? "#22C55E"
        : change < 0
          ? "#EF4444"
          : isDark
            ? "#AAAAAA"
            : "#6B7280";

  const styles = StyleSheet.create({
    card: {
      backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
      borderColor: isDark ? "#2D2D2D" : "#E5E7EB",
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      alignItems: "flex-start",
      width: 150,
      marginHorizontal: 8,
      marginVertical: 6,
      shadowColor: isDark ? "#000" : "#00000020",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
      position: "relative",
    },
    symbol: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#1F2937",
      marginTop: 6,
    },
    price: {
      fontSize: 14,
      color: isDark ? "#AAAAAA" : "#6B7280",
      marginTop: 2,
    },
    change: {
      fontSize: 13,
      marginTop: 6,
      fontWeight: "600",
      color: gainColor,
    },
    selectedOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark
        ? "rgba(249,115,22,0.08)"
        : "rgba(249,115,22,0.06)",
      borderRadius: 16,
    },
    iconButton: {
      position: "absolute",
      top: 8,
      backgroundColor: isDark ? "#2D2D2D" : "#F3F4F6",
      borderRadius: 12,
      padding: 4,
    },
    crossButton: {
      right: 32,
    },
    arrowButton: {
      right: 8,
    },
  });

  const handlePress = () => {
    if (!isMain) {
      if (!onRemove) {
        return;
      }
    }
    const symbol_price = `${symbol}_${price}`;
    router.push(`/product/${symbol_price}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={onRemove ? 1 : 0.9}
    >
      {onRemove && (
        <View className="absolute top-2 right-2 flex flex-col justify-between h-16 z-10">
          <TouchableOpacity
            onPress={() => onRemove(symbol)}
            activeOpacity={0.8}
            className={`w-7 h-7 rounded-full items-center justify-center shadow 
        ${isDark ? "bg-red-500/20" : "bg-red-200/80"}`}
          >
            <Ionicons
              name="close"
              size={16}
              color={isDark ? "#FCA5A5" : "#DC2626"}
            />
          </TouchableOpacity>
        </View>
      )}

      <Avtaar initials={symbol?.[0] ?? "?"} />
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.price}>${Number(price).toFixed(2)}</Text>
      {change !== undefined && (
        <Text style={styles.change}>
          {change > 0 ? "+" : ""}
          {Number(change).toFixed(2)}%
        </Text>
      )}
    </TouchableOpacity>
  );
}
