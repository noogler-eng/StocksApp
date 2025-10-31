import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import StockCard from "@/components/StockCard";
import LoadingErrorView from "@/components/LoadingErrorView";
import useTopMovers from "@/hooks/useTopMovers";
import { useTheme } from "@/context/ThemeContext";

export default function Explore() {
  const { isDark } = useTheme();
  const { data, loading, error } = useTopMovers();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#FFFFFF" : "#000000",
    },
    viewAllText: {
      color: isDark ? "#4EA8DE" : "#007AFF",
      fontWeight: "600",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: 8,
    },
  });

  if (loading || error || !data) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  const renderSection = (title: string, list: any[]) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Link
          href={{
            pathname: "/viewall",
            params: {
              title,
              type: title.replace(" ", "_").toLowerCase(),
            },
          }}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </Link>
      </View>
      <View style={styles.grid}>
        {list.slice(0, Math.min(4, list.length)).map((item) => (
          <TouchableOpacity className="w-[48%] mb-4" key={item.ticker}>
            <StockCard
              symbol={item.ticker}
              price={item.price}
              change={item.change_amount}
              isMain={true}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!loading && data && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderSection("Top Gainers", data.top_gainers)}
          {renderSection("Top Losers", data.top_losers)}
          {renderSection("Most Active", data.most_actively_traded)}
        </ScrollView>
      )}
    </View>
  );
}
