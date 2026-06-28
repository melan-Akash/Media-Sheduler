# 📅 Media Scheduler

An advanced, AI-powered social media scheduling and automation platform. This application allows users to compose posts using cutting-edge AI, generate matching images, link multiple social media accounts, and schedule posts to be published automatically in the background across platforms like Twitter, LinkedIn, Facebook, and Instagram.

---

## 🚀 Key Features

*   **🤖 AI Post Composer**: Generate high-quality social media posts using OpenRouter's `owl-alpha` model, tailored to specific tones, with automatic hashtag generation.
*   **🎨 AI Image Generation**: Generate stunning, context-aware visuals for your posts using Leonardo.ai, with automatic hosting via Cloudinary.
*   **🔗 Unified Social Account Linking**: Connect and manage multiple social media profiles (LinkedIn, Twitter/X, Facebook, Instagram) in one place using the **Zernio API**.
*   **📅 Automated Background Scheduler**: Schedule posts for any future date/time. A background cron service continuously checks and publishes them automatically.
*   **📊 Interactive Analytics Dashboard**: Track recently published posts, schedule queues, and logs of all system activities.
*   **🖼️ Media Uploads**: Upload local images or videos directly to posts, stored securely in the cloud.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React (TypeScript) + Vite
*   **Styling**: Tailwind CSS (sleek, modern dark-themed UI with glassmorphic elements)
*   **Routing**: React Router DOM

### Backend
*   **Runtime**: Node.js (TypeScript) + Express
*   **Runner/Watcher**: `tsx` (TypeScript Execute) for fast ESM execution
*   **Database**: MongoDB + Mongoose (for users, accounts, posts, generations, and activity logs)
*   **Authentication**: JWT (JSON Web Tokens) + bcrypt (password hashing)
*   **API Integrations**:
    *   **Zernio SDK (`@zernio/node`)**: For unified social media publishing and profile connection.
    *   **OpenRouter SDK**: To power text generation via `openrouter/owl-alpha`.
    *   **Leonardo.ai API**: For AI image generation.
    *   **Cloudinary**: For cloud media storage.
*   **Task Scheduling**: `node-cron` (running a background publishing worker every minute)

---

## 📂 Project Structure

```text
Media Sheduler/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── assets/         # Icons, images, and static assets
│   │   ├── components/     # Reusable UI components (Sidebar, Navbar, Layout)
│   │   ├── context/        # App state context
│   │   ├── pages/          # Pages (Dashboard, Accounts, Scheduler, AI Composer, Login)
│   │   └── App.tsx         # App routing and entry
│   └── package.json
│
└── server/                 # Backend Node.js API & Services
    ├── config/             # DB, Cloudinary, Multer, and Zernio configurations
    ├── controllers/        # Request handlers (Auth, Accounts, Posts, Activity)
    ├── middlewares/        # Express Middlewares (JWT Authentication guard)
    ├── models/             # Mongoose schemas (User, Account, Post, ActivityLog, Generation)
    ├── routes/             # API Router endpoints
    ├── services/           # Background scheduler worker (node-cron)
    ├── server.ts           # Express application entry point
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB Database (Local or MongoDB Atlas)

### Installation

1.  **Clone or navigate to the project directory**:
    ```bash
    cd "C:\Users\ASUS\Desktop\Media Sheduler"
    ```

2.  **Set up the Backend**:
    ```bash
    cd server
    npm install
    ```

3.  **Set up the Frontend**:
    ```bash
    cd ../client
    npm install
    ```

---

## 🔒 Environment Variables

Create a `.env` file inside the `server/` directory and populate it with your keys:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_signing_secret

# Social Media Integration (Zernio)
ZIO_API_KEY=your_zernio_api_key

# AI Integrations
OPENROUTER_API_KEY=your_openrouter_api_key
LEONARDO_API_KEY=your_leonardo_ai_key

# Media Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server
From the `server/` directory:
```bash
npm run server
```
*Runs the server at `http://localhost:3000` with hot-reloading using `tsx watch`.*

### 2. Start the Frontend Development Server
From the `client/` directory:
```bash
npm run dev
```
*Runs the frontend at `http://localhost:5173/`.*

---

## 🔌 API Endpoints

### 🔐 Authentication
*   `POST /api/auth/register` - Register a new user.
*   `POST /api/auth/login` - Authenticate user and receive a JWT.

### 🔗 Social Accounts
*   `GET /api/auth/:platform/url` - Get the Zernio OAuth link to connect a platform (Twitter, LinkedIn, etc.).
*   `GET /api/auth/sync` - Sync connected social profiles from Zernio to the local database.
*   `GET /api/accounts` - Fetch all connected accounts for the logged-in user.
*   `DELETE /api/accounts/:id` - Disconnect and delete a social account.

### 📝 Posts & AI Generation
*   `POST /api/posts/generate` - Generate post text (OpenRouter) and optional images (Leonardo.ai).
*   `GET /api/posts/generations` - Fetch history of AI generations.
*   `POST /api/posts` - Schedule a new post (supports local file upload via Multer).
*   `GET /api/posts` - Get all posts (scheduled, published, failed) for the user.

### 📊 Activity Logs
*   `GET /api/activity` - Get the recent activity logs for the dashboard.
