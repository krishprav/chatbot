# System Architecture

## Overview
This project is a full-stack web chatbot designed to handle e-commerce queries. It follows a **Client-Server** architecture with a clear separation of concerns.

## Data Flow
1.  **User Interaction**: User types a message in the `ChatInterface` (Next.js).
2.  **API Request**: The frontend sends the message to `POST /api/chat/message`.
3.  **Authentication**: The request includes a JWT (if logged in) to identify the user.
4.  **Intent Detection**: The backend `nlp.js` module analyzes the text to determine the User Intent (`DEALS`, `ORDERS`, `PAYMENT`, `REGISTER`).
5.  **Data Retrieval**:
    *   If **MongoDB** is connected: Data is fetched from the database.
    *   If **MongoDB** is disconnected: Data is fetched from the in-memory `mockDb` store.
6.  **Response**: The backend constructs a structured JSON response containing text and rich data (cards/lists).
7.  **Rendering**: The frontend parses the response type and renders the appropriate UI component (Carousel, List, Table).

## Tech Stack Choices

### Frontend: Next.js + Tailwind CSS
*   **Next.js (App Router)**: Chosen for its server-side rendering capabilities and robust routing, making the app SEO-friendly and fast.
*   **Tailwind CSS**: Used for rapid UI development. The **Monochrome** theme is implemented using CSS variables and Tailwind's `dark` mode class strategy for seamless theme switching.
*   **Lucide React**: Lightweight, consistent icon set that adapts perfectly to the monochrome theme.

### Backend: Node.js + Express
*   **Express**: Minimalist framework perfect for building RESTful APIs.
*   **Mongoose**: ODM for MongoDB, providing schema validation to ensure data integrity.
*   **JWT**: Stateless authentication mechanism, ideal for scalable applications.

## Resilience Strategy
A key feature of this application is its **Offline Tolerance**. The `isDbConnected()` helper checks the database state before every operation. This ensures that the application **never crashes** due to database connectivity issues, a critical trait for production-grade software.
