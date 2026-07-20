# Daily News Digest 📰

A modern, responsive full-stack web application that delivers the latest news across various categories (Technology, Sports, Business, AI, World). 

## 🌟 Features
- **Real-Time News:** Integrates with the GNews API to fetch live headlines.
- **Dynamic Hero Section:** Automatically rotating carousel for top news stories.
- **Category Filtering:** Easily navigate between different news topics.
- **Authentication:** Secure Google Sign-In using Firebase Authentication.
- **Offline/Mock Mode:** Gracefully falls back to an in-memory database and seeded mock data when the API limit is reached, ensuring the app never breaks.
- **Responsive Design:** A beautiful, glassmorphism-inspired UI that works perfectly on desktop, tablet, and mobile devices.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with `mongodb-memory-server` for seamless local testing and offline support)
- **APIs:** GNews API v4, Google OAuth 2.0 (Firebase)
- **Deployment:** Vercel (Frontend), Render (Backend)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- NPM or Yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DEVKUMAR9012/news.git
   cd news
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=memory
   JWT_SECRET=your_jwt_secret
   GNEWS_API_KEY=your_gnews_api_key
   FRONTEND_URL=http://localhost:5500
   ```

4. **Run the Backend Server:**
   ```bash
   npm start
   ```
   *The server will start on `http://localhost:5000`.*

5. **Run the Frontend:**
   Use any local server (like `http-server` or VS Code Live Server) to serve the root directory on port `5500`.
   ```bash
   npx http-server -p 5500 -c-1
   ```
   *Open your browser and navigate to `http://localhost:5500`.*

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is open-source and available under the MIT License.
