
# 🗨️ NestJS Chat App

A real-time chat application built with **NestJS** and **Socket.io**. This document provides all necessary information to interact with the server via REST APIs and Socket.io.

---
## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the server in development mode
npm run start:dev
```

Make sure you create a `.env` file with your environment variables like:

```
PORT=3000

DB_URI='yout-db-url/chat'

JWT_SECRET='my-secret'
JWT_EXPIRATION='1d'

SUPER_ADMIN_EMAIL='admin@gmail.com'
SUPER_ADMIN_NAME='admin'
SUPER_ADMIN_PASSWORD='123456789'
```

---

## 📡 REST API Overview

### 🔐 Registration

#### `POST /user`
Registers a new user.

**Example**
```json
{
  "name": "abood",
  "email": "abood@gmail.com",
  "password": "123456789"
}
```
#### `POST /admin-register`
Make a request for register a new admin, the request approved by the super admin

**Example**
```json
{
  "name": "new admin",
  "email": "new-admin@gmail.com",
  "password": "123456789"
}
```

---
### 🔐 Auth
#### `POST /auth/login`
Logs in an existing user and returns a JWT.

**Example**
```json
{
  "email": "abood@gmail.com",
  "password": "132456789"
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
Fetch the currently authenticated user's info.

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
    "roles": [
        "user"
    ]
}
```
---

## ⚡ Socket.IO Events

> 🛡️ **Note:** To connect to the Socket.IO server, you must authorize yourself by including your JWT token.
>
> Use either of the following approaches on the client side:
> 
> - `socket.io('http://localhost:3000', { auth: { token: '<accessToken>' } })`
> - or send it in headers: `socket.io('http://localhost:3000', { transportOptions: { polling: { extraHeaders: { token: '<accessToken>' } } } })`
> - if you use Postman: add token = "accessToken" into Headers
> 
> The server expects the token at either `handshake.auth.token` or `handshake.headers.token`.


### ✅ Client → Server Events

#### 🔌 `joinChat`
User start a new chat with another user.

```json
{
  "senderId": "senderId123",
  "recieverId": "recieverId321",
}
```

---

#### 💬 `privateMessage`
User send message to a chat.
(the server will validate if the sender is a member in the chat)
```json
{
  "message": "hello",
  "chatId": "chatId222",
  "recieverId": "recieverId123",
}
```

---

#### 💬 `myChats`
Returns the current user chats, return the chats by emit myChats event for the client with payload {chats:[...]}

---

#### 💬 `chatMessages`
For get chat messages, this will emit a client event => chatMessages with payload {chatId,messages}.
```json
{
  "chatId": "chatId123",
  "limit": 50,
  "page": 1
}
```

---

#### `markAsOpenedMessage`
When the user read message mark it as opened.
(Validations: you should be a member in the chat and the reciever of this message)
```json
{
  "chatId": "chatId123",
  "messageId" : "messageId321"
}
```

---

### 📥 Server → Client Events

#### 👋 `newChat`
Triggered when a user starts a new chat with you.

```json
{
  "chatId" : "chatId123",
  "users" : ["senderId","recieverId"]
}
```

---

#### 📩 `userJoined`
Triggered when a user sends new message for your chats.

```json
{
  "message": {
    "content" : "hello",
    "chatId" : "chatId",
    "sender" : "senderId",
    "reciever" : "recieverId",
    "timestamp" : "",
    "opened" : false,
  }
}
```

---

#### 🗨️ `myChats`
Triggered as a response when you trigger myChats event.

```json
{
  "chats": [
    {
      "_id":"chatId",
      "room":"roomName",
      "users":[{"senderUser"},{"recieverUser"}]
    }
    ],
}
```

---

#### 🖊️ `chatMessages`
Triggered as a response when you trigger chatMessages event.

```json
{
  "chatId": "chatId",
  "messages":[
    {
    "content" : "hello",
    "chatId" : "chatId",
    "sender" : "senderId",
    "reciever" : "recieverId",
    "timestamp" : "",
    "opened" : false,
  }
  ] 
}
```

---

#### ✋ `messageOpened`
Triggered when a reciever user read your message.

```json
{
  "chatId": "chatId123",
  "messageId": "messageId123"
}
```

---

## 🛠 Tech Stack

- **NestJS** – Backend framework
- **Socket.io** – Real-time communication
- **MongoDB** – Data storage
- **JWT** – Authentication

---

---

## 🌐 Deployment
App already deployed,
Try it : https://chat-api-nestjs.onrender.com

---
