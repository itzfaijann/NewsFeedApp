# 📰 Smart News Feed App

A **React Native** news reader app powered by the **TechCrunch** API.  
Includes **offline mode**, **search functionality**, skeleton loading UI, and responsive scaling across devices using custom utility functions.

---

## 🚀 Features

- 📲 Fetches latest articles from [TechCrunch](https://techcrunch.com)
- 🔍 Real-time **search** functionality
- 📴 **Offline mode** using `AsyncStorage`
- 🔄 Pull-to-refresh and infinite scroll
- 💀 Skeleton loader while fetching
- 📱 Fully responsive UI using `moderateScale` and `fontSize` utils
- 📤 Tap on a card to read the full article in browser

---

## 🛠️ Tech Stack

- **React Native CLI**
- **AsyncStorage** for caching
- **FlatList** for performance
- **TextInput**, **TouchableOpacity** for UI interaction
- **NewsAPI** for fetching articles

---

## 📁 Folder Structure

NewsFeedApp/
│
├── app/
│ └── NewsFeedScreen.js # Main News Feed Screen
├── utils/
│ └── metrix.js # Scaling & Font utils
├── android/ # Native Android code
├── ios/ # Native iOS code
├── package.json
├── README.md

yaml
Copy
Edit

---

## 📦 Installation & Running

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/NewsFeedApp.git
cd NewsFeedApp
2. Install dependencies
bash
Copy
Edit
npm install
3. Run on Android
bash
Copy
Edit
npx react-native run-android
4. Run on iOS (macOS only)
bash
Copy
Edit
npx react-native run-ios
⚙️ Configuration
This app uses NewsAPI with TechCrunch as the domain source. You can replace API_KEY in NewsFeedScreen.js with your own:

js
Copy
Edit
const API_KEY = 'YOUR_NEWS_API_KEY';
Get yours at 👉 https://newsapi.org

📡 Offline Mode Logic
When online, the app:

Fetches articles from NewsAPI

Stores them in AsyncStorage under @articles

When offline, the app:

Loads articles from AsyncStorage

Shows a fallback message if no data is cached

🧠 Utility: metrix.js
A custom utility file for consistent and responsive UI:

js
Copy
Edit
moderateScale(size) // scales size by screen size
fontSize(size)      // scales font size respecting fontScale
🔍 Search Logic
User enters a keyword (3+ characters)

Pressing Search button triggers article filtering via NewsAPI

Search uses q parameter of the API

📷 UI Screens
News Feed	Skeleton Loading	Offline Mode

(Replace with your own screenshots in the screens/ folder)

📃 License
MIT License. Feel free to fork, modify, and use it for your learning or projects.

✍️ Author
Mohmmed Faijan
React Native Developer

