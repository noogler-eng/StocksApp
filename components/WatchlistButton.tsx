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
import useColors from "@/hooks/useColors";

export default function WatchlistButton({ symbol, price }: any) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlists, setWatchlists] = useState<{ [key: string]: any[] }>({});
  const [newListName, setNewListName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);

  const colors = useColors();

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

  return (
    <View>
      {/* Floating Bookmark Button */}
      <TouchableOpacity
        onPress={toggleWatchlist}
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
        className="p-2 rounded-full border active:opacity-70"
      >
        <Ionicons
          name={isInWatchlist ? "bookmark" : "bookmark-outline"}
          size={26}
          color={isInWatchlist ? colors.accent : colors.textSecondary}
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
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
          className="rounded-t-2xl p-6 max-h-[60%] border-t"
        >
          {/* Title */}
          <View
            style={{ borderColor: colors.border }}
            className="border-b pb-3 mb-4"
          >
            <Text
              style={{ color: colors.textPrimary }}
              className="text-lg font-semibold text-center"
            >
              Add to Watchlist
            </Text>
          </View>

          {/* List of Watchlists */}
          {Object.keys(watchlists).length > 0 ? (
            <FlatList
              data={Object.keys(watchlists)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleAddToList(item)}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  className="p-4 rounded-xl mb-3 border active:opacity-80"
                >
                  <Text
                    style={{ color: colors.textPrimary }}
                    className="text-center text-base font-medium"
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text
              style={{ color: colors.textSecondary }}
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
                placeholderTextColor={colors.muted}
                style={{
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
                className="border rounded-xl p-3 mb-3"
              />
              <TouchableOpacity
                style={{ backgroundColor: colors.accent }}
                className="p-4 rounded-xl active:opacity-80"
                onPress={handleCreateNewList}
              >
                <Text className="text-white text-center text-base font-semibold">
                  Create & Add
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{ backgroundColor: colors.accent }}
              className="p-4 rounded-xl mt-3 active:opacity-80"
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
