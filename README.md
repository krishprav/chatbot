# Mobo Deal Bot - Full Stack Web Chatbot

A smart web chatbot built with React (Next.js) and Node.js that simulates an e-commerce assistant. It helps users find deals, check order history, and view payment status through an intuitive chat interface.

## Features

- **Smart NLP Intent Detection**: Understands natural language queries like "Show me deals", "Where are my orders?", "Payment status".
- **Rich UI Cards**: Displays deals and orders as interactive cards with images.
- **Micro-interactions**: Premium animations, hover effects, and voice search capabilities.
- **User Authentication**: Phone number based login and registration flow with JWT authentication.
- **Persistent Data**: Uses MongoDB to store Users, Deals, Orders, and Payments.
- **Responsive Design**: Full-screen chat interface optimized for mobile and desktop.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT (JSON Web Tokens).
- **Other**: Web Speech API for voice search.

## Project Structure

```
chatbot/
├── client/                 # Next.js Frontend
│   ├── app/                # App Router & Pages
│   ├── components/         # UI Components (ChatInterface, etc.)
│   └── public/             # Static Assets
├── server/                 # Express Backend
│   ├── models.js           # Mongoose Schemas (User, Deal, Order, Payment)
│   ├── nlp.js              # NLP Logic & Intent Processing
│   ├── routes.js           # API Routes
│   └── server.js           # Server Entry Point
└── README.md               # Project Documentation
```

## Setup & Installation

**Prerequisites**: Node.js (v18+) and MongoDB installed/running.

### 1. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the backend server (runs on `http://localhost:5000`):
    ```bash
    npm run dev
    ```
    *Note: The server will automatically connect to MongoDB at `mongodb://localhost:27017/chatbot`. Ensure MongoDB is running.*

### 2. Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server (runs on `http://localhost:3000`):
    ```bash
    npm run dev
    ```

### 3. Seed Database (Optional)

To populate the database with sample Deals, Orders, and a Demo User (`9999999999`):

Open your browser and visit: `http://localhost:5000/api/seed`

## Usage Guide

1.  **Login/Register**:
    *   Open `http://localhost:3000`.
    *   Enter a phone number. If it's new, you'll be prompted to register.
    *   **Demo User**: Use phone `9999999999` (created via seed).

2.  **Chat commands**:
    *   **Deals**: "Show me new deals", "Any offers today?"
    *   **Orders**: "Where is my order?", "Order history"
    *   **Payments**: "Payment status", "Do I have pending bills?"
    *   **General**: "Hi", "Help", "Menu"

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/check-user` | Check if phone exists |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/chat/message` | Send message to bot (NLP) |
| `GET` | `/api/deals` | Get all deals |
| `GET` | `/api/orders?userId=...` | Get orders for user |
| `GET` | `/api/payments?userId=...`| Get payments for user |

## Author
**Krish** - Full Stack Developer Assignment
