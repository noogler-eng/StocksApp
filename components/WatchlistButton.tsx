import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { getAll, addStock, createList } from "@/storage/watchlistStorage";
import { useTheme } from "@/context/ThemeContext";

export default function WatchlistButton({ symbol, price }: any) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlists, setWatchlists] = useState<{ [key: string]: any[] }>({});
  const [newListName, setNewListName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);

  const { isDark } = useTheme();

  const loadWatchlists = async () => {
    const data = await getAll();
    setWatchlists(data);
  };

  const toggleWatchlist = async () => {
    await loadWatchlists();
    setModalVisible(true);
  };

  const handleAddToList = async (listName: string) => {
    await addStock(listName, symbol, price);
    setModalVisible(false);
    setIsInWatchlist(true);
  };

  const handleCreateNewList = async () => {
    if (!newListName.trim()) return;
    await createList(newListName.trim());
    await addStock(newListName.trim(), symbol, price);
    setNewListName("");
    setShowCreateInput(false);
    await loadWatchlists();
    setModalVisible(false);
    setIsInWatchlist(true);
  };

  // 🎨 OLED-Optimized Dark Mode Colors
  const bgColor = isDark ? "#000000" : "#FFFFFF";
  const cardColor = isDark ? "#111111" : "#F3F4F6";
  const textColor = isDark ? "#FFFFFF" : "#111827";
  const placeholderColor = isDark ? "#6B7280" : "#9CA3AF";
  const borderColor = isDark ? "#1F2937" : "#E5E7EB";

  return (
    <View>
      {/* Floating Bookmark Button */}
      <TouchableOpacity
        onPress={toggleWatchlist}
        className={`p-2 rounded-full border ${
          isDark ? "border-gray-700 bg-black" : "border-gray-300 bg-gray-100"
        } active:bg-neutral-800`}
      >
        <Ionicons
          name={isInWatchlist ? "bookmark" : "bookmark-outline"}
          size={26}
          color={isInWatchlist ? "#3B82F6" : isDark ? "#9CA3AF" : "#475569"}
        />
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropTransitionOutTiming={0}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{ backgroundColor: bgColor, borderColor }}
          className="rounded-t-2xl p-6 max-h-[60%] border-t"
        >
          <View style={{ borderColor }} className="border-b pb-3 mb-4">
            <Text
              style={{ color: textColor }}
              className="text-lg font-semibold text-center"
            >
              Add to Watchlist
            </Text>
          </View>

          {Object.keys(watchlists).length > 0 ? (
            <FlatList
              data={Object.keys(watchlists)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleAddToList(item)}
                  style={{
                    backgroundColor: cardColor,
                    borderColor,
                  }}
                  className="p-4 rounded-xl mb-3 border active:bg-neutral-900"
                >
                  <Text
                    style={{ color: textColor }}
                    className="text-center text-base font-medium"
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text
              style={{ color: placeholderColor }}
              className="text-center mb-3"
            >
              No watchlists found.
            </Text>
          )}

          {/* Create New Watchlist Section */}
          {showCreateInput ? (
            <View className="mt-4">
              <TextInput
                value={newListName}
                onChangeText={setNewListName}
                placeholder="Enter new watchlist name"
                placeholderTextColor={placeholderColor}
                style={{
                  color: textColor,
                  borderColor,
                  backgroundColor: isDark ? "#111111" : "#F9FAFB",
                }}
                className="border rounded-xl p-3 mb-3"
              />
              <TouchableOpacity
                className="bg-blue-500 p-4 rounded-xl active:bg-blue-600"
                onPress={handleCreateNewList}
              >
                <Text className="text-white text-center text-base font-semibold">
                  Create & Add
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-xl mt-3 active:bg-blue-600"
              onPress={() => setShowCreateInput(true)}
            >
              <Text className="text-white text-center text-base font-semibold">
                Create New Watchlist
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
}
