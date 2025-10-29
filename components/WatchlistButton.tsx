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
import { getAll, addStock, createList } from "@/storage/watchlistStorage"; // <-- your file path

export default function WatchlistButton({ symbol, price }: any) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlists, setWatchlists] = useState<{ [key: string]: any[] }>({});
  const [newListName, setNewListName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);

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
      <TouchableOpacity
        onPress={toggleWatchlist}
        className="bg-blue-100 p-2 rounded-full"
      >
        <Ionicons
          name={isInWatchlist ? "bookmark" : "bookmark-outline"}
          size={26}
          color="#007AFF"
        />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-white rounded-t-2xl p-6 max-h-[60%]">
          <View className="border-b border-gray-200 pb-3 mb-3">
            <Text className="text-lg font-semibold text-gray-800 text-center">
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
                  className="bg-gray-100 p-4 rounded-xl mb-3"
                >
                  <Text className="text-gray-800 text-center text-base font-medium">
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text className="text-center text-gray-500 mb-3">
              No watchlists found.
            </Text>
          )}

          {/* Toggle Create Input */}
          {showCreateInput ? (
            <View className="mt-4">
              <TextInput
                value={newListName}
                onChangeText={setNewListName}
                placeholder="Enter new watchlist name"
                className="border border-gray-300 rounded-xl p-3 mb-3"
              />
              <TouchableOpacity
                className="bg-blue-500 p-4 rounded-xl"
                onPress={handleCreateNewList}
              >
                <Text className="text-white text-center text-base font-medium">
                  Create & Add
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-xl mt-3"
              onPress={() => setShowCreateInput(true)}
            >
              <Text className="text-white text-center text-base font-medium">
                Create New Watchlist
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
}
