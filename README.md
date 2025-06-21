
# 🗨️ NestJS Chat App

A real-time chat application built with **NestJS** and **Socket.io**.

---
## 🌐 Demo

You can try the demo chat app (with react pages) here:

💡 Hint: You can sign up with any fake email and password to test the chat functionality.

https://chat-app-react-ebon.vercel.app
---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the server in development mode
npm run start:dev
```

Create a `.env` file with the following variables:

```
PORT=3000

DB_URI='your-db-url/chat'

JWT_SECRET='my-secret'
JWT_EXPIRATION='1d'

SUPER_ADMIN_EMAIL='admin@gmail.com'
SUPER_ADMIN_NAME='admin'
SUPER_ADMIN_PASSWORD='123456789'
```

---

## 📡 REST API Endpoints

### 🔐 Registration

#### `POST /user`

Register a new user.

**Example**

```json
{
  "name": "abood",
  "email": "abood@gmail.com",
  "password": "123456789"
}
```

#### `POST /admin-register`

Request to register a new admin, pending approval by the super admin.

```json
{
  "name": "new admin",
  "email": "new-admin@gmail.com",
  "password": "123456789"
}
```

---

### 🔐 Login

#### `POST /auth/login`

Login and receive a JWT token.

```json
{
  "email": "abood@gmail.com",
  "password": "123456789"
}
```

**Response**

```json
{
  "accessToken": "jwt-token"
}
```

---

### 👤 User Info

#### `GET /user/me`

Fetch the current authenticated user's information.

**Headers**

```
Authorization: Bearer <accessToken>
```

**Response**

```json
{
  "_id": "67f6bba3113365ea3d696bdd",
  "name": "abood",
  "email": "abood@gmail.com",
  "roles": ["user"]
}
```

---

## ⚡ Socket.IO

> 🛡️ **Note:** You must include a JWT token when connecting:
>
> * Using auth:
>
> ```js
> io('https://chat-api-nestjs.onrender.com', {
>   auth: { token: '<accessToken>' }
> });
> ```
>
> * Using headers:
>
> ```js
> io('https://chat-api-nestjs.onrender.com', {
>   transportOptions: {
>     polling: {
>       extraHeaders: { token: '<accessToken>' }
>     }
>   }
> });
> ```

---

### ✅ Client → Server Events

#### `joinChat`

Start a new chat.

```json
{
  "recieverEmail": "user2@example.com"
}
```

**Response (event: `newChat`)**

```json
{
  "chat": {
    "_id": "chatId",
    "room": "roomName",
    "users": ["user1", "user2"]
  }
}
```

---

#### `privateMessage`

Send a message.

```json
{
  "chatId": "chatId123",
  "message": "Hello!",
  "recieverId": "user2Id"
}
```

**Response (event: `newMessage`)**

```json
{
  "message": {
    "_id": "messageId",
    "chatId": "chatId123",
    "sender": "user1Id",
    "reciever": "user2Id",
    "content": "Hello!",
    "opened": false,
    "timestamp": "2025-06-21T12:00:00.000Z"
  },
  "chat": {...},
  "recieverId": "user2Id"
}
```

---

#### `myChats`

Retrieve all user chats.

```json
{}
```

**Response**

```json
{
  "chats": [ ... ]
}
```

---

#### `chatMessages`

Get messages for a specific chat.

```json
{
  "chatId": "chatId123",
  "page": 1,
  "limit": 50
}
```

**Response**

```json
{
  "chatId": "chatId123",
  "messages": [ ... ]
}
```

---

#### `chatUsers`

Get users in a specific chat.

```json
{
  "chatId": "chatId123"
}
```

**Response**

```json
{
  "users": [ ... ]
}
```

---

#### `markAsOpenedMessage`

Mark a message as opened.

```json
{
  "chatId": "chatId123",
  "messageId": "messageId321"
}
```

**Response**

```json
{
  "chatId": "chatId123",
  "messageId": "messageId321"
}
```

---

### 📥 Server → Client Events

#### `newChat`

Triggered when someone starts a chat with you.

```json
{
  "chat": { ... }
}
```

#### `newMessage`

Triggered when a new message is received.

```json
{
  "message": { ... },
  "chat": { ... },
  "recieverId": "..."
}
```

#### `myChats`

Response to `myChats` event.

```json
{
  "chats": [ ... ]
}
```

#### `chatMessages`

Response to `chatMessages` event.

```json
{
  "chatId": "...",
  "messages": [ ... ]
}
```

#### `chatUsers`

Response to `chatUsers` event.

```json
{
  "users": [ ... ]
}
```

#### `messageOpened`

Triggered when a user opens your message.

```json
{
  "chatId": "chatId123",
  "messageId": "messageId321"
}
```

---

## 🛠 Tech Stack

* **NestJS** – Backend framework
* **Socket.io** – Real-time communication
* **MongoDB** – Database
* **JWT** – Authentication

---

