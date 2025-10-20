# TechSanta Hotspot Hero

A full-stack MikroTik hotspot management application with separate frontend and backend services.

## Project Structure

```
techsanta-hotspot-hero/
├── frontend/          # React + Vite frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── server/           # Express.js backend API
│   ├── index.js      # Main server file
│   └── package.json  # Backend dependencies
├── render.yaml       # Render deployment configuration
└── package.json      # Root package.json for development scripts
```

## Technologies Used

**Frontend:**
- React + TypeScript
- Vite
- shadcn-ui
- Tailwind CSS

**Backend:**
- Node.js + Express
- routeros-client (MikroTik RouterOS API)

## Local Development

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd techsanta-hotspot-hero

# Install root dependencies (for concurrently)
npm install

# Install both frontend and backend dependencies
npm run install:all
```

### Running in Development Mode

```sh
# Run both frontend and backend concurrently
npm run dev
```

This will start:
- Frontend at `http://localhost:8080`
- Backend API at `http://localhost:3001`

### Running Services Separately

```sh
# Run only frontend
npm run dev:frontend

# Run only server (backend)
npm run dev:server
```

## Deployment to Render

This project is configured for easy deployment to Render with separate frontend and backend services.

### Automatic Deployment (Recommended)

1. **Push your code to GitHub**

2. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and create two services:
     - `techsanta-backend` (API service)
     - `techsanta-frontend` (Static site)

3. **Configure Environment Variables**:

   **Backend Service (`techsanta-backend`):**
   - `NODE_ENV`: `production` (auto-set)
   - `PORT`: `10000` (auto-set)
   - `FRONTEND_URL`: Set to your frontend URL (e.g., `https://techsanta-frontend.onrender.com`)

   **Frontend Service (`techsanta-frontend`):**
   - `VITE_API_URL`: Set to your backend URL + `/api` (e.g., `https://techsanta-backend.onrender.com/api`)

4. **Deploy**: Render will automatically build and deploy both services

### Manual Deployment

If you prefer to deploy services separately:

**Backend:**
- Service Type: Web Service
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

**Frontend:**
- Service Type: Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

### Environment Variables

Check `.env.example` files in both directories for required environment variables:
- `frontend/.env.example` - Frontend configuration
- `server/.env.example` - Backend/Server configuration

## Production Build Locally

To test the production build locally:

```sh
# Build both services
npm run build

# Start both services
npm start
```

## Application Features

- Connect to MikroTik routers via RouterOS API
- View active hotspot users
- Manage hotspot users (create, delete)
- Monitor router statistics (CPU, memory, uptime)
- Disconnect active users
- View hotspot profiles
