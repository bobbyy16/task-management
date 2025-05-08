# Task Management App 📝

A full-stack Task Management application built using the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: Secure login and signup functionality
- **Task Management**: Create, read, update, and delete tasks
- **Task Status**: Mark tasks as completed or incomplete
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Data Persistence**: All tasks are stored in MongoDB

## Tech Stack

### Frontend

- **React.js**: UI components and state management
- **React Router**: Navigation and routing
- **Axios**: API requests
- **CSS/SCSS**: Styling

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication mechanism

## Folder Structure

```
task-management/
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source files
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── services/      # API services
│   │   └── App.js         # Main App component
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── index.js           # Entry point
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/task-management.git
   cd task-management
   ```

2. **Set up environment variables**

   Create a `.env` file in the server directory with the following content:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd server
   npm start
   ```

   The server will run on `http://localhost:5000`.

2. **Start the frontend development server**
   ```bash
   cd client
   npm start
   ```
   The application will open in your browser at `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Tasks

- `GET /api/tasks/my` - Get tasks assigned to the authenticated user
- `GET /api/tasks/all` - Get all tasks (admin only)
- `POST /api/tasks` - Create a new task (admin only)
- `PATCH /api/tasks/:taskId` - Update task status
- `DELETE /api/tasks/:taskId` - Delete a task (admin only)
- `PUT /api/tasks/:taskId/assign` - Assign users to a task (admin only)
- `POST /api/tasks/:taskId/comments` - Add comment to a task
- `GET /api/tasks/:taskId/comments` - Get comments for a specific task

### Notifications

- `GET /api/notifications` - Get all notifications for the authenticated user

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/profile` - Get authenticated user's profile

## Deployment

### Frontend

The React frontend can be deployed to Netlify, Vercel, or any static site hosting service:

```bash
cd client
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Developed with ❤️ by [Abhishek](https://github.com/bobbyy16)
