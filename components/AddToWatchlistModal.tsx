import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { getAll, addStock, createList } from "../storage/watchlistStorage";

export default function AddToWatchlistModal({ visible, onClose, symbol }: any) {
  const [lists, setLists] = useState({});
  const [newList, setNewList] = useState("");

  useEffect(() => {
    if (visible) load();
  }, [visible]);

  const load = async () => {
    setLists(await getAll());
  };

  const handleCreate = async () => {
    if (!newList.trim()) return;
    await createList(newList);
    await addStock(newList, symbol);
    setNewList("");
    onClose();
  };

  const handleSelect = async (name: any) => {
    await addStock(name, symbol);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Add {symbol}</Text>

          <TextInput
            value={newList}
            onChangeText={setNewList}
            placeholder="New watchlist name"
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 10 }}
          />
          <TouchableOpacity
            onPress={handleCreate}
            style={{ backgroundColor: "#007bff", padding: 10, borderRadius: 6, alignItems: "center" }}
          >
            <Text style={{ color: "#fff" }}>Create & Add</Text>
          </TouchableOpacity>

          <FlatList
            data={Object.keys(lists)}
            keyExtractor={(i) => i}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)} style={{ padding: 10 }}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No existing watchlists</Text>}
          />

          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 10, backgroundColor: "#999", padding: 10, borderRadius: 6, alignItems: "center" }}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
