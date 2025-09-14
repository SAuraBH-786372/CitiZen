# CivicTrack - Civic Issue Tracking Application

A full-stack web application for tracking and managing civic issues, built with Node.js, Express, React, and MongoDB.

## Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Role-based Access**: Citizens can report issues, Officials can manage them
- **Issue Management**: Create, view, update, and track civic issues
- **File Uploads**: Attach images to issue reports
- **Interactive Maps**: Location-based issue reporting with Leaflet maps
- **Real-time Notifications**: Stay updated on issue status changes
- **Responsive Design**: Modern UI with TailwindCSS and shadcn/ui

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React 18 with TypeScript
- Vite build system
- TailwindCSS with shadcn/ui components
- React Router for navigation
- Axios for API communication
- Leaflet for interactive maps

## Deployment on Render

This application is configured for deployment on Render using the `render.yaml` configuration file.

### Prerequisites

1. **MongoDB Atlas Account**: Create a free MongoDB Atlas cluster
2. **Render Account**: Sign up for a free Render account

### Deployment Steps

1. **Fork/Clone this repository** to your GitHub account

2. **Set up MongoDB Atlas**:
   - Create a new cluster on MongoDB Atlas
   - Create a database user
   - Get your connection string
   - Whitelist Render's IP addresses (or use 0.0.0.0/0 for all IPs)

3. **Deploy to Render**:
   - Connect your GitHub repository to Render
   - Render will automatically detect the `render.yaml` file
   - The configuration will deploy both backend and frontend services
   - Set up the MongoDB connection in Render's dashboard

4. **Environment Variables**:
   The following environment variables will be automatically configured:
   - `MONGO_URI`: From your MongoDB Atlas connection
   - `JWT_SECRET`: Auto-generated secure secret
   - `CLIENT_ORIGIN`: Auto-linked to frontend URL
   - `VITE_API_URL`: Auto-linked to backend URL

### Manual Deployment (Alternative)

If you prefer manual deployment:

#### Backend Deployment
1. Create a new Web Service on Render
2. Connect your repository
3. Set root directory to `backend`
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables from `.env.example`

#### Frontend Deployment
1. Create a new Static Site on Render
2. Connect your repository
3. Set root directory to `frontend`
4. Set build command: `npm install && npm run build`
5. Set publish directory: `dist`
6. Add environment variable: `VITE_API_URL` pointing to your backend URL

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd CivicTrack
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend URL
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## Project Structure

```
CivicTrack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── uploads/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
├── render.yaml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Issues
- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get specific issue
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue

### File Uploads
- `POST /api/upload` - Upload files

## User Roles

- **Citizen**: Can report issues, view their own issues, and track status
- **Official**: Can view all issues, update status, and manage assignments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
