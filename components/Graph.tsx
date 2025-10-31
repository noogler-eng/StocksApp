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

  // IMPORTANT: All hooks must be called before any conditional returns
  const cardColor = isDark ? "#171717" : "#FFFFFF";
  const textColor = isDark ? "#f5f5f5" : "#111827";
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "#2a2a2d" : "#e5e7eb";

  const chartData = useMemo(() => {
    if (!selectedData) return [];

    try {
      const entries = Object.entries(selectedData);

      if (entries.length === 0) {
        return [];
      }

      const mapped = entries
        .map(([date, v]: any) => {
          // Handle both data formats
          const closeValue = v.close || v["4. close"];
          const parsedClose = parseFloat(closeValue);

          // Validate the parsed value
          if (isNaN(parsedClose)) {
            console.warn(`Invalid close price for date ${date}:`, closeValue);
            return null;
          }

          return {
            date,
            close: parsedClose,
          };
        })
        .filter((item) => item !== null); // Remove invalid entries

      return mapped.reverse();
    } catch (err) {
      console.error("Error processing chart data:", err);
      return [];
    }
  }, [selectedData]);

  // Calculate max zoom based on available data
  const maxZoom = useMemo(() => {
    return Math.min(4, Math.max(1, Math.floor(chartData.length / 3)));
  }, [chartData.length]);

  // Apply zoom by slicing data
  const visibleData = useMemo(() => {
    if (chartData.length === 0) return [];

    const itemsToShow = Math.max(2, Math.ceil(chartData.length / zoomLevel));
    return chartData.slice(-itemsToShow); // Show most recent data
  }, [chartData, zoomLevel]);

  const prices = visibleData.map((item) => item.close);
  const dates = visibleData.map((item) => item.date);

  // NOW it's safe to do conditional returns after all hooks are called
  if (loading || error || !selectedData) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  // Check for minimum data requirements
  if (!chartData.length || chartData.length < 2) {
    return (
      <View
        style={{
          borderRadius: 16,
          padding: 16,
          marginTop: 16,
        }}
        className={`${isDark ? "bg-neutral-900" : "bg-white"} shadow-sm`}
      >
        <View className="flex items-center justify-center h-40">
          <Text style={{ color: textColor, fontSize: 16, fontWeight: "600" }}>
            No Chart Data
          </Text>
          <Text style={{ color: subTextColor, marginTop: 8, fontSize: 12 }}>
            {chartData.length === 0
              ? "No data available for this timeline"
              : "Need at least 2 data points to display chart"}
          </Text>
        </View>
      </View>
    );
  }

  // Format date labels based on timeline
  const formatDateLabel = (dateStr: string, index: number) => {
    try {
      const step = Math.max(1, Math.ceil(dates.length / 5));
      if (index % step !== 0 && dates.length > 10) return "";

      if (timeline === "TIME_SERIES_INTRADAY") {
        // Show time (HH:MM)
        return dateStr.length >= 16 ? dateStr.slice(11, 16) : dateStr;
      } else if (
        timeline === "TIME_SERIES_MONTHLY" ||
        timeline === "TIME_SERIES_MONTHLY_ADJUSTED"
      ) {
        // Show year-month (YYYY-MM)
        return dateStr.length >= 7 ? dateStr.slice(0, 7) : dateStr.slice(5, 7);
      } else {
        // Show month-day (MM-DD)
        return dateStr.length >= 10 ? dateStr.slice(5, 10) : dateStr;
      }
    } catch (err) {
      return "";
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
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
      className={`${isDark ? "bg-neutral-900" : "bg-white"} shadow-sm border border-${isDark ? "neutral-800" : "gray-200"}`}
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
                data: prices.length > 0 ? prices : [0, 1], // Fallback to prevent crash
                color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
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
        {[1, 2, 3, 4].map((level) => {
          const isDisabled = level > maxZoom;
          return (
            <TouchableOpacity
              key={level}
              onPress={() => !isDisabled && setZoomLevel(level)}
              disabled={isDisabled}
              style={{
                backgroundColor: isDisabled
                  ? isDark
                    ? "#1a1a1a"
                    : "#f3f4f6"
                  : zoomLevel === level
                    ? "#f97316"
                    : isDark
                      ? "#2d2d2d"
                      : "#e5e7eb",
                paddingVertical: 4,
                paddingHorizontal: 12,
                borderRadius: 9999,
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: isDisabled
                    ? isDark
                      ? "#4b5563"
                      : "#9ca3af"
                    : zoomLevel === level
                      ? "#fff"
                      : isDark
                        ? "#d1d5db"
                        : "#374151",
                }}
              >
                {level}x
              </Text>
            </TouchableOpacity>
          );
        })}
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
