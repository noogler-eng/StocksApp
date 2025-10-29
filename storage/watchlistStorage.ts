import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "WATCHLISTS";

export const getAll = async () => {
  const s = await AsyncStorage.getItem(KEY);
  return s ? JSON.parse(s) : {};
};

export const addStock = async (listName: any, symbol: any) => {
  const data = await getAll();
  if (!data[listName]) data[listName] = [];
  if (!data[listName].includes(symbol)) data[listName].push(symbol);
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const createList = async (name: any) => {
  const data = await getAll();
  if (!data[name]) data[name] = [];
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const removeStock = async (listName: any, symbol: any) => {
  const data = await getAll();
  if (data[listName]) {
    data[listName] = data[listName].filter((s: any) => s !== symbol);
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  }
};
