import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { TimelineType } from "@/utils/types";
import usePrices from "@/hooks/usePrices";
import LoadingErrorView from "./LoadingErrorView";
import { useTheme } from "@/context/ThemeContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Graph({
  timeline,
  symbol,
  setChartTimeline,
}: {
  timeline: TimelineType;
  symbol: string;
  setChartTimeline: any;
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const { data: selectedData, loading, error } = usePrices(timeline, symbol);

  const { isDark } = useTheme();

  const bgColor = isDark ? "#0d0d0d" : "#ffffff";
  const textColor = isDark ? "#f5f5f5" : "#111827";
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";
  const cardColor = isDark ? "#1c1c1e" : "#ffffff";
  const borderColor = isDark ? "#2a2a2d" : "#e5e7eb";

  if (loading || error || !selectedData) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  const chartData = useMemo(() => {
    const entries = Object.entries(selectedData);
    const mapped = entries.map(([date, v]: any) => ({
      date,
      close: parseFloat(v.close),
    }));
    return mapped.reverse();
  }, [selectedData]);

  // Apply zoom by slicing data
  const visibleData = useMemo(() => {
    const itemsToShow = Math.ceil(chartData.length / zoomLevel);
    return chartData.slice(-itemsToShow); // Show most recent data
  }, [chartData, zoomLevel]);

  const prices = visibleData.map((item) => item.close);
  const dates = visibleData.map((item) => item.date);

  if (!chartData.length) {
    return (
      <View className="flex items-center justify-center h-40">
        <Text style={{ color: subTextColor, marginTop: 8, fontSize: 12 }}>
          No chart data available
        </Text>
      </View>
    );
  }

  // Format date labels based on timeline
  const formatDateLabel = (dateStr: string, index: number) => {
    const step = Math.max(1, Math.ceil(dates.length / 5));
    if (index % step !== 0) return "";

    if (timeline === "TIME_SERIES_INTRADAY") {
      return dateStr.slice(11, 16);
    } else if (
      timeline === "TIME_SERIES_MONTHLY" ||
      timeline === "TIME_SERIES_MONTHLY_ADJUSTED"
    ) {
      return dateStr.slice(5, 7);
    } else {
      return dateStr.slice(5, 10);
    }
  };

  const timelineLabels: Record<string, string> = {
    TIME_SERIES_INTRADAY: "5min",
    TIME_SERIES_DAILY: "Daily",
    TIME_SERIES_WEEKLY: "Weekly",
    TIME_SERIES_MONTHLY: "Monthly",
  };

  const chartWidth = SCREEN_WIDTH - 60 + (zoomLevel - 1) * (SCREEN_WIDTH - 60);

  return (
    <View
      style={{
        backgroundColor: cardColor,
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text style={{ fontSize: 18, fontWeight: "bold", color: textColor }}>
          {symbol} Price Trend
        </Text>
        <Text style={{ fontSize: 12, color: subTextColor }}>
          {visibleData.length} points
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 40 }}
      >
        <LineChart
          data={{
            labels: dates.map((d, i) => formatDateLabel(d, i)),
            datasets: [
              {
                data: prices,
                color: (opacity = 1) =>
                  isDark
                    ? `rgba(249, 115, 22, ${opacity})`
                    : `rgba(249, 115, 22, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={chartWidth}
          height={220}
          chartConfig={{
            backgroundColor: cardColor,
            backgroundGradientFrom: cardColor,
            backgroundGradientTo: cardColor,
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
            labelColor: (opacity = 1) =>
              isDark
                ? `rgba(229, 231, 235, ${opacity})`
                : `rgba(107, 114, 128, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "0" },
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: borderColor,
              strokeWidth: 1,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          fromZero={false}
          yAxisLabel="$"
          yAxisSuffix=""
          segments={5}
        />
      </ScrollView>

      {/* Zoom Controls */}
      <View className="flex-row justify-center items-center gap-3 mt-3 mb-2">
        <Text style={{ fontSize: 12, color: subTextColor }}>Zoom:</Text>
        {[1, 2, 3, 4].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setZoomLevel(level)}
            style={{
              backgroundColor:
                zoomLevel === level
                  ? "#f97316"
                  : isDark
                    ? "#2d2d2d"
                    : "#e5e7eb",
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 9999,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color:
                  zoomLevel === level ? "#fff" : isDark ? "#d1d5db" : "#374151",
              }}
            >
              {level}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timeline Buttons */}
      <View className="mt-2 flex items-center">
        <View className="flex-row gap-2">
          {Object.keys(timelineLabels).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setChartTimeline(t);
                setZoomLevel(1);
              }}
              style={{
                backgroundColor:
                  timeline === t ? "#f97316" : isDark ? "#2d2d2d" : "#e5e7eb",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 9999,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color:
                    timeline === t ? "#fff" : isDark ? "#d1d5db" : "#374151",
                }}
              >
                {timelineLabels[t]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
