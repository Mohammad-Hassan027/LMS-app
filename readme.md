# PathOS - Modern Learning Management System (LMS)

PathOS is a modern, production-grade Learning Management System (LMS) designed to connect instructors and students. It is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js) and TypeScript. It bridges the gap between instructors and students with a seamless, interactive educational environment powered by the latest web technologies.

<!-- ![PathOS Banner](/client/public/Hero.png) -->

## Deployed working URL

[https://path-os.vercel.app](https://path-os.vercel.app/)

![Github top language](https://img.shields.io/github/languages/top/Mohammad-Hassan027/PathOS?color=56BEB8)
![Github language count](https://img.shields.io/github/languages/count/Mohammad-Hassan027/PathOS?color=56BEB8)
![Repository size](https://img.shields.io/github/repo-size/Mohammad-Hassan027/PathOS?color=56BEB8)
![License](https://img.shields.io/github/license/Mohammad-Hassan027/PathOS?color=56BEB8)
![Github issues](https://img.shields.io/github/issues/Mohammad-Hassan027/PathOS?color=56BEB8)
![Github forks](https://img.shields.io/github/forks/Mohammad-Hassan027/PathOS?color=56BEB8)
![Github stars](https://img.shields.io/github/stars/Mohammad-Hassan027/PathOS?color=56BEB8)

## 🚀 Key Features

### 🎓 Student Experience

- **Smart Course Discovery:** Filter and search courses by category and level.
- **Interactive Video Learning:** Custom video player with progress tracking.
- **My Learning Dashboard:** Track purchased courses and completion status.
- **Secure Payments:** Integrated PayPal gateway for safe transactions.

### 👨‍🏫 Instructor Tools

- **Course Studio:** Create and manage courses with a multi-step builder.
- **Curriculum Management:** Drag-and-drop organization for chapters and lectures.
- **Media Hub:** Seamless image and video uploads powered by Cloudinary.
- **Instructor Dashboard:** Track course performance and sales.

### 🛡️ Security & Architecture

- **Role-Based Access (RBAC):** Strict separation between Student and Instructor views.
- **Modern Auth:** Secure authentication powered by Clerk.
- **Type Safety:** Built completely with TypeScript for robust reliability.

---

## 🛠️ Tech Stack

### Client (Frontend)

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + Radix UI
- **State Management:** TanStack Query + Context API
- **Routing:** React Router DOM v7
- **Authentication:** Clerk
- **Media:** React Player + Media Chrome

### Server (Backend)

- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Storage:** Cloudinary (Video/Image)
- **Payments:** PayPal Server SDK
- **Email:** Nodemailer + Gmail

---

## ⚙️ Environment Variables

Create `.env` files in both `client` and `server` directories with the following keys:

**Client (`/client/.env`)**

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_BACKEND_URI=http://localhost:5000
# fallback urls
VITE_CLERK_SIGN_IN_URL=/login
VITE_CLERK_SIGN_UP_URL=/register
VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/
VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

**Server (`/server/.env`)**

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
GMAIL_USER=your.email@gmail.com
GMAIL_PASS=xxxx xxxx xxxx xxxx  <-- Your 16-char App Password
CLIENT_URL=http://localhost:5173
```

## 🏃‍♂️ Getting Started

### 1. Clone the Repository

```bash
# Clone this project
$ git clone https://github.com/mohammad-hassan027/pathos.git
$ cd pathos
```

### 2. Backend Setup

```bash
$ cd server
$ npm install
# Configure your .env file
$ npm run dev
```

### 3. Frontend Setup

```bash
$ cd client
$ npm install
# Configure your .env file
$ npm run dev
# Access the app at http://localhost:5173
```

## 📂 Project Structure

```Plaintext

pathos/
├── client/                 # React 19 Frontend
│   ├── src/
│   │   ├── components/     # UI & Feature Components
│   │   ├── pages/          # Student & Instructor Pages
│   │   ├── service/        # API Calls
│   │   └── contexts/       # Global State
│   └── package.json
│
└── server/                 # Node.js Backend
    ├── src/
    │   ├── controllers/    # Request Handlers
    │   ├── models/         # Database Schemas
    │   └── routes/         # API Endpoints
    └── package.json
```

<!-- ## 📄 License

This project is licensed under the ISC License. -->

### Built with ❤️ by [Mohammad Hassan Shaikh](https://github.com/Mohammad-Hassan027)

[Back to top](#top)
