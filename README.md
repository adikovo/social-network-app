# Roomies - Social Network App

A full-stack social networking application built with React and Node.js, designed for roommates and groups to connect, share posts, and communicate.

## Features

### Core Functionality
- **User Authentication** - Secure login/register system
- **User Profiles** - Customizable profiles with bio and profile pictures
- **Groups Management** - Create, join, and manage groups
- **Posts & Media** - Share text posts with images and videos
- **Real-time Chat** - Socket.io powered messaging system
- **Comments System** - Comment on posts with full CRUD operations
- **Search Functionality** - Search users, groups, and posts
- **Notifications** - Real-time notifications for friend requests, group invites, and messages

### Advanced Features
- **File Upload** - Support for images and videos
- **YouTube Integration** - Embed YouTube videos in posts
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - Live notifications and chat
- **Group Administration** - Admin controls for group management
- **Friend System** - Add/remove friends and manage relationships

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI framework
- **React Router DOM 7.9.4** - Client-side routing
- **Bootstrap 5.3.8** - CSS framework
- **Axios 1.12.2** - HTTP client
- **Socket.io Client 4.8.1** - Real-time communication
- **D3.js 7.9.0** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **MongoDB** - Database
- **Mongoose 8.19.1** - ODM for MongoDB
- **Socket.io 4.8.1** - Real-time communication
- **Multer 2.0.2** - File upload handling
- **CORS 2.8.5** - Cross-origin resource sharing


##Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-network-app
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/roomies
   PORT=3001
   ```

4. **Start the application**
   
   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm start
   ```
   
   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001


##API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify user token

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/friend-request` - Send friend request
- `POST /api/users/accept-friend` - Accept friend request

### Groups
- `GET /api/groups/list` - List groups
- `POST /api/groups/create` - Create group
- `POST /api/groups/join` - Join group
- `DELETE /api/groups/leave` - Leave group

### Posts
- `GET /api/posts/feed` - Get feed posts
- `POST /api/posts/create` - Create post
- `PUT /api/posts/like` - Like/unlike post
- `POST /api/posts/comment` - Add comment

### Chat
- `GET /api/conversations` - Get conversations
- `POST /api/conversations` - Create conversation
- `GET /api/messages/:conversationId` - Get messages



## 🚀 Deployment

### Frontend (React)
```bash
cd client
npm run build

### Backend (Node.js)
```bash
cd server

### Database
- Set up MongoDB Atlas for cloud database
- Update connection string in environment variables

