import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { getTopMovers } from "@/api/alphaVantage";
import StockCard from "@/components/StockCard";
import LoadingErrorView from "@/components/LoadingErrorView";

export default function ViewAll() {
  const { title } = useLocalSearchParams();
  const router = useRouter();

  const [stocks, setStocks] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTopMovers();
        if (data?.top_gainers || data?.top_losers) {
          const list =
            title === "Top Gainers"
              ? data.top_gainers
              : title === "Top Losers"
                ? data.top_losers
                : data.most_actively_traded;
          setStocks(list);
          setFiltered(list);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [title]);

  const handleSearch = (text: string) => {
    setQuery(text);
    const filteredList = stocks.filter((item) =>
      item.ticker.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredList);
  };

  if (loading || error) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">
          {title || "View All"}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <View className="flex-row items-center bg-gray-100 mx-4 mt-3 px-3 py-2 rounded-xl">
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search stocks..."
          placeholderTextColor="#888"
          className="ml-2 flex-1 text-base text-black"
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="text-gray-500 mt-2">Loading {title}...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-row flex-wrap justify-between px-4 mt-5">
            {filtered.map((item) => (
              <Link key={item.ticker} href={`/product/${item.ticker}`} asChild>
                <TouchableOpacity className="w-[48%] mb-4">
                  <StockCard
                    symbol={item.ticker}
                    price={item.price}
                    change={item.change_percentage}
                  />
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
