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
import useColors from "@/hooks/useColors";

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
  const colors = useColors();

  // Chart data processing
  const chartData = useMemo(() => {
    if (!selectedData) return [];

    try {
      const entries = Object.entries(selectedData);
      if (entries.length === 0) return [];

      const mapped = entries
        .map(([date, v]: any) => {
          const closeValue = v.close || v["4. close"];
          const parsedClose = parseFloat(closeValue);
          if (isNaN(parsedClose)) return null;
          return { date, close: parsedClose };
        })
        .filter((item) => item !== null);

      return mapped.reverse();
    } catch {
      return [];
    }
  }, [selectedData]);

  const maxZoom = useMemo(() => {
    return Math.min(4, Math.max(1, Math.floor(chartData.length / 3)));
  }, [chartData.length]);

  const visibleData = useMemo(() => {
    if (chartData.length === 0) return [];
    const itemsToShow = Math.max(2, Math.ceil(chartData.length / zoomLevel));
    return chartData.slice(-itemsToShow);
  }, [chartData, zoomLevel]);

  const prices = visibleData.map((item) => item.close);
  const dates = visibleData.map((item) => item.date);

  if (loading || error || !selectedData) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  if (!chartData.length || chartData.length < 2) {
    return (
      <View
        style={{
          borderRadius: 16,
          padding: 16,
          marginTop: 16,
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        <View className="flex items-center justify-center h-40">
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            No Chart Data
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              marginTop: 8,
              fontSize: 12,
            }}
          >
            {chartData.length === 0
              ? "No data available for this timeline"
              : "Need at least 2 data points to display chart"}
          </Text>
        </View>
      </View>
    );
  }

  const formatDateLabel = (dateStr: string, index: number) => {
    try {
      const step = Math.max(1, Math.ceil(dates.length / 5));
      if (index % step !== 0 && dates.length > 10) return "";

      if (timeline === "TIME_SERIES_INTRADAY") {
        return dateStr.slice(11, 16);
      } else if (
        timeline === "TIME_SERIES_MONTHLY" ||
        timeline === "TIME_SERIES_MONTHLY_ADJUSTED"
      ) {
        return dateStr.slice(0, 7);
      } else {
        return dateStr.slice(5, 10);
      }
    } catch {
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
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        shadowColor: colors.muted,
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text
          style={{ fontSize: 18, fontWeight: "bold", color: colors.textPrimary }}
        >
          {symbol} Price Trend
        </Text>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
          {visibleData.length} points
        </Text>
      </View>

      {/* Chart */}
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
                data: prices.length > 0 ? prices : [0, 1],
                color: (opacity = 1) =>
                  `${colors.accent}${Math.floor(opacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                strokeWidth: 2,
              },
            ],
          }}
          width={chartWidth}
          height={220}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 2,
            color: (opacity = 1) =>
              `${colors.accent}${Math.floor(opacity * 255)
                .toString(16)
                .padStart(2, "0")}`,
            labelColor: (opacity = 1) =>
              `${colors.textSecondary}${Math.floor(opacity * 255)
                .toString(16)
                .padStart(2, "0")}`,
            style: { borderRadius: 16 },
            propsForDots: { r: "0" },
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: colors.border,
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
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>Zoom:</Text>
        {[1, 2, 3, 4].map((level) => {
          const isDisabled = level > maxZoom;
          const isActive = zoomLevel === level;
          return (
            <TouchableOpacity
              key={level}
              onPress={() => !isDisabled && setZoomLevel(level)}
              disabled={isDisabled}
              style={{
                backgroundColor: isDisabled
                  ? colors.surface
                  : isActive
                  ? colors.accent
                  : colors.border,
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
                  color: isActive
                    ? colors.card
                    : isDisabled
                    ? colors.muted
                    : colors.textPrimary,
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
          {Object.keys(timelineLabels).map((t) => {
            const isActive = timeline === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => {
                  setChartTimeline(t);
                  setZoomLevel(1);
                }}
                style={{
                  backgroundColor: isActive ? colors.accent : colors.border,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 9999,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: isActive ? colors.card : colors.textPrimary,
                  }}
                >
                  {timelineLabels[t]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
