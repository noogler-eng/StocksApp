import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "WATCHLISTS";

export const getAll = async () => {
  const s = await AsyncStorage.getItem(KEY);
  return s ? JSON.parse(s) : {};
};

export const createList = async (name: string) => {
  const data = await getAll();
  if (!data[name]) data[name] = [];
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const addStock = async (
  listName: string,
  symbol: string,
  price: number
) => {
  const data = await getAll();
  if (!data[listName]) data[listName] = [];

  const alreadyExists = data[listName].some(
    (item: any) => item.symbol === symbol
  );

  if (!alreadyExists) {
    data[listName].push({ symbol, price });
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  }
};

export const removeStock = async (listName: string, symbol: string) => {
  const data = await getAll();
  if (data[listName]) {
    data[listName] = data[listName].filter(
      (item: any) => item.symbol !== symbol
    );
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  }
};

export const deleteList = async (listName: string) => {
  const data = await getAll();
  if (data[listName]) {
    delete data[listName];
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  }
};
