import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Avtaar from "./Avtaar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useColors from "@/hooks/useColors";

type StockCardProps = {
  symbol: string;
  price: number;
  change?: number;
  isMain?: boolean;
  onRemove?: (symbol: string) => void;
};

export default function StockCard({
  symbol,
  price,
  change,
  isMain = true,
  onRemove,
}: StockCardProps) {
  const colors = useColors();
  const router = useRouter();

  // ✅ Compute change color dynamically from theme
  const gainColor =
    change === undefined
      ? colors.textSecondary
      : change > 0
      ? colors.success
      : change < 0
      ? colors.danger
      : colors.textSecondary;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      alignItems: "flex-start",
      width: 150,
      marginHorizontal: 8,
      marginVertical: 6,
      shadowColor: colors.muted,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
      position: "relative",
    },
    symbol: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginTop: 6,
    },
    price: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    change: {
      fontSize: 13,
      marginTop: 6,
      fontWeight: "600",
      color: gainColor,
    },
    removeButtonWrapper: {
      position: "absolute",
      top: 8,
      right: 8,
      zIndex: 10,
    },
    removeButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${colors.danger}20`,
    },
  });

  const handlePress = () => {
    if (!isMain && !onRemove) return;
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
        <View style={styles.removeButtonWrapper}>
          <TouchableOpacity
            onPress={() => onRemove(symbol)}
            activeOpacity={0.8}
            style={styles.removeButton}
          >
            <Ionicons name="close" size={16} color={colors.danger} />
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
