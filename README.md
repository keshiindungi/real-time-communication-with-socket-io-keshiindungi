## 🚀 Neon Chat - Real-Time Chat Application
A modern, real-time chat application built with Node.js, Socket.io, and vanilla JavaScript featuring both group and private messaging with a stunning neon-themed UI.

## ✨ Features

## 💬 Group Chat
. Real-time Messaging: Instant message delivery across all connected clients

 .Online User List: See who's currently online in real-time

 .Typing Indicators: Visual feedback when users are typing

 .Message History: Persistent message storage per room

 # 🔒 Private Messaging
 .One-on-One Conversations: Secure private chats between users

 .User Selection: Choose any online user to start a private conversation

 .Active Chat Highlighting: Visual indication of current private chat

 .Message History: Private conversation history persistence

 .Real-time Notifications: Instant delivery of private messages

# 🎨 User Experience
 .Modern Neon Design: Eye-catching cyan and magenta color scheme

 .Responsive Layout: Works perfectly on desktop and mobile devices

 .Intuitive Navigation: Clean flow from registration to chat selection

 .Real-time Updates: Live user status and message updates

 .Smooth Animations: Hover effects and transitions

 # 🛠️ Technology Stack
 .Backend: Node.js + Express.js

 .Real-time Communication: Socket.io

 .Frontend: Vanilla JavaScript + HTML5 + CSS3

 .Styling: Custom CSS with neon effects and glassmorphism

 .No Database: In-memory storage for simplicity (easily extendable)

 # 🚀 Quick Start
Prerequisites
Node.js (v14 or higher)

npm or yarn

# Installation
1.Clone or create the project
  mkdir real-time-communication
  cd real-time-communication

  # 🎯 Usage Guide
  1.Registration
     Enter your username and email

Click "Join Chat" to proceed

   2. Chat Selection
Group Chat: Join public rooms for community discussions

Private Messages: Start one-on-one conversations

  3. Group Chat Features
Select different rooms from the sidebar

See all online users

Start private chats from group interface

Real-time message broadcasting

  4. Private Chat Features
Click "Chat" next to any user to start private conversation

Input field becomes enabled when user is selected

Private messages are only visible to participants

Active chat is highlighted in the user list


# API Events 🌐
Client to Server
user-registered: User registration

send-group-message: Send public message

send-private-message: Send private message

join-room: Join specific chat room

get-private-conversation: Load private message history

typing-start/typing-stop: Typing indicators

Server to Client
login-success: Registration confirmation

new-message: New public message

new-private-message: New private message

users-update: Online users list update

room-changed: Room switch confirmation

private-conversation-loaded: Private chat history