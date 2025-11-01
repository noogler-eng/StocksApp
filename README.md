# 📈 StockApp (React Native) 👋

You can download the latest build of the app here:  
👉 [Expo Build Download Link](https://expo.dev/accounts/0xsharad/projects/StockApp/builds/0b00a65a-aaaf-4769-abef-0ab750b5bac7)

---

👉 you can watch the demo of application here:
[Demo loom video](https://www.loom.com/share/5a53d3a5fecd409ab49a1f3d0cd9d4b8)

---

## 🚀 Get Started

Follow these steps to run or modify the app locally 👇

### 1. Clone the repository
```bash
   git clone https://github.com/noogler-eng/StocksApp
   cd StockApp
```

### 2. Install dependencies
```bash
   npm install
```

### 3. Set up environment variables
Create a .env file in the project root with your API key:
```bash
   PUBLIC_EXPO_STOCK_DATA_API_KEY=your_api_key_here
```

### 4. Start the app in development mode
```bash
   npm run start
```
- Then scan the QR code using the Expo Go app on your mobile device or run in an emulator:
- Press a → Run on Android
- Press i → Run on iOS

---


## 🧱 Folder Structure
```bash
StockApp/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           # Home (Top Movers)
│   │   ├── watchlist.tsx       # Watchlist page
│   │   └── _layout.tsx         # Tabs navigation layout
│   ├── product/
│   │   └── [symbol_price].tsx  # Dynamic stock detail screen
│   └── _layout.tsx             # Root stack layout
│
├── components/
│   ├── StockCard.tsx           # Reusable stock card with actions
│   ├── GainLoss.tsx            # Display gain/loss info
│   └── Avtaar.tsx              # Avatar with stock symbol initials
|   |...... etc
│
├── context/
│   └── ThemeContext.tsx        # Dark/Light theme provider
│
├── hooks/
│   ├── useOverview.ts          # Fetch & cache stock overview
│   ├── useTopMovers.ts         # Get top mover stocks
│   └── useStorage.ts           # AsyncStorage utility
│
├── storage/
│   └── watchlistStorage.ts     # Add/remove/get watchlist data
│
├── api/
│   ├── demoOverview.json       # Local demo data for overview
│   └── demoMovers.json         # Local demo data for movers
│
├── assets/
│   └── images/
│       └── icon.png
│
├── .env                        # Environment variables (API key)
├── app.json                    # Expo app config
├── babel.config.js             # Babel setup (NativeWind + dotenv)
├── package.json
└── README.md
```

## ✨ Features
1. 📊 Real-time Stock Data using custom hooks (useOverview, useTopMovers)
2. 🧾 Watchlist Management — add/remove stocks stored in local AsyncStorage
3. 🌙 Dark & Light Mode — via ThemeContext
4. 🧭 Expo Router Navigation — stack + tabs architecture
5. 🧠 Clean UI Components — with NativeWind (TailwindCSS for RN)
6. ⚙️ Optimized & Modular Codebase
7. 🔐 Environment-secured API key loading


## 🧩 Future Enhancements
1. 📡 Live data updates using WebSocket streams
2. 📊 Historical charts
3. 🔍 Stock search & filter
4. 🔔 Notifications for price changes
5. 💰 Portfolio tracker


## Screenshots
### Homepage(Explore)
![WhatsApp Image 2025-11-01 at 11 41 05](https://github.com/user-attachments/assets/a7246802-ae8f-4f65-a741-8a762ee5d64c)
![WhatsApp Image 2025-11-01 at 11 41 41](https://github.com/user-attachments/assets/d5b91609-2213-4589-9a01-42e82d679673)

### ViewAll
![WhatsApp Image 2025-11-01 at 11 42 04](https://github.com/user-attachments/assets/1df16fb7-cb35-4d39-9ac3-4180e678c103)

### Stock Detial
![WhatsApp Image 2025-11-01 at 11 42 50](https://github.com/user-attachments/assets/eb47ac7f-21a6-4181-abdd-a109f781bfa6)
![WhatsApp Image 2025-11-01 at 11 43 20](https://github.com/user-attachments/assets/fd4a0a0e-cee3-4690-86ef-78e6db780b3c)

### Watchlist
![WhatsApp Image 2025-11-01 at 11 43 49](https://github.com/user-attachments/assets/39817a9c-859e-442f-869a-66bc3b28fdeb)
![WhatsApp Image 2025-11-01 at 11 44 15](https://github.com/user-attachments/assets/88907684-d9d2-45a8-b47a-cadc5a39d1c7)
![WhatsApp Image 2025-11-01 at 11 44 34](https://github.com/user-attachments/assets/f67f1a21-cd8b-458b-ac84-87d3e96ec570)
![WhatsApp Image 2025-11-01 at 11 44 49](https://github.com/user-attachments/assets/915e8f4a-2ed0-4711-87a4-ce0d865d0fa7)
![WhatsApp Image 2025-11-01 at 11 45 08](https://github.com/user-attachments/assets/2b062614-0030-4559-9fa9-e75bac2ec3bf)


## 👨‍💻 Author
- Sharad Poddar
- 📩 [Mail Me](sharadpoddar1001@gmail.com)
- 🌐 [LinkedIn Profile](https://www.linkedin.com/in/sharad-poddar-895985283/)

