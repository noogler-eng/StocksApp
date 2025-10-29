import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { getOverview, getTimeSeries } from "@/api/alphaVantage";
import { getAll, addStock, removeStock } from "@/storage/watchlistStorage";

export default function ProductScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const [overview, setOverview] = useState<any>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  const listName = "Default"; // default list name

  // ✅ Load stock overview + chart data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const overviewData = await getOverview(symbol);
        const timeSeriesData = await getTimeSeries(symbol);

        const series = timeSeriesData["Time Series (60min)"];
        const prices = Object.values(series).map((entry: any) =>
          parseFloat(entry["4. close"])
        );
        setChartData(prices.reverse().slice(-10)); // last 10 points
        setOverview(overviewData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const checkWatchlist = async () => {
      const all = await getAll();
      const list = all[listName] || [];
      setIsInWatchlist(list.includes(symbol));
    };

    fetchData();
    checkWatchlist();
  }, [symbol]);

  // ✅ Toggle add/remove watchlist
  const toggleWatchlist = async () => {
    if (isInWatchlist) {
      await removeStock(listName, symbol);
    } else {
      await addStock(listName, symbol);
    }
    const all = await getAll();
    const list = all[listName] || [];
    setIsInWatchlist(list.includes(symbol));
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.symbol}>{symbol}</Text>
        <TouchableOpacity onPress={toggleWatchlist}>
          <Ionicons
            name={isInWatchlist ? "bookmark" : "bookmark-outline"}
            size={28}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

      {/* Overview Section */}
      {overview && (
        <View style={styles.info}>
          <Text style={styles.name}>{overview.Name}</Text>
          <Text style={styles.detail}>Industry: {overview.Industry}</Text>
          <Text style={styles.detail}>
            Market Cap: $
            {Number(overview.MarketCapitalization).toLocaleString()}
          </Text>
        </View>
      )}

      {/* Chart */}
      <LineChart
        data={{
          labels: Array.from(
            { length: chartData.length },
            (_, i) => `${i + 1}`
          ),
          datasets: [{ data: chartData }],
        }}
        width={Dimensions.get("window").width - 30}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2,
          color: () => "#007AFF",
          labelColor: () => "#555",
          propsForDots: {
            r: "3",
          },
        }}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  symbol: { fontSize: 28, fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "600", marginBottom: 4 },
  info: { marginVertical: 10 },
  detail: { fontSize: 15, color: "#555", marginVertical: 2 },
  chart: { marginTop: 20, borderRadius: 12 },
});
