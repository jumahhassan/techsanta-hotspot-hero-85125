# TechSanta Hotspot Manager - Quick Start

## What You Have Now

✅ **Backend API Server** - Node.js + Express server that communicates with MikroTik routers
✅ **Frontend Application** - React app with modern UI to manage routers
✅ **Router CRUD Operations** - Connect, monitor, and control your MikroTik routers
✅ **Hotspot User Management** - Create, delete, and disconnect hotspot users
✅ **Real-time Monitoring** - CPU, memory, active users, uptime

## Start the Application

### Option 1: Run Everything (Recommended)
```bash
npm run dev:all
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Option 2: Run Separately

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
cd server
npm start
```

## First Time Setup

1. **Enable MikroTik API** (on your router):
   ```
   /ip service
   set api port=8728 disabled=no
   ```

2. **Open the app**: http://localhost:5173

3. **Go to "Routers" page** and click "Add Router"

4. **Enter your router details**:
   - Router Name: "My Hotspot" (or any name)
   - Host: Your router IP (e.g., 192.168.88.1)
   - Username: admin (or your router username)
   - Password: Your router password
   - Port: 8728 (default)

5. **Click "Connect"** - You should see your router appear with live stats!

## Available API Endpoints

Once connected, you can:

### Router Operations
- View router info (CPU, memory, uptime)
- Monitor active connections
- Disconnect from router

### Hotspot User Management
- View all hotspot users
- Create new users
- Delete users
- View active users
- Disconnect active users

### Get Profiles
- List available hotspot profiles

## Example: Create a User Programmatically

```javascript
// Using the API directly
fetch('http://localhost:3001/api/router/YOUR_ROUTER_ID/hotspot/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'user123',
    password: 'pass123',
    profile: 'default'
  })
});
```

## Troubleshooting

### Cannot connect to router?
1. Check if API is enabled on router: `/ip service print`
2. Test from router terminal: `/tool api print`
3. Check firewall rules allow port 8728
4. Verify username/password are correct

### Backend not starting?
1. Make sure port 3001 is not in use
2. Check that dependencies are installed: `cd server && npm install`

### CORS errors?
- Make sure backend is running on port 3001
- Backend is configured to accept requests from any origin in development

## Security Warning

⚠️ **This is a development setup!** For production:
- Use HTTPS
- Use MikroTik API-SSL (port 8729)
- Implement proper authentication
- Don't expose port 3001 to the internet
- Use environment variables for sensitive config

## Next Steps

Now that you can connect to routers, you can:
1. Integrate live router data into the Dashboard
2. Connect Voucher generation to actually create users on the router
3. Add batch user creation
4. Implement bandwidth usage tracking
5. Create automated voucher generation scripts

## Need Help?

Check SETUP.md for detailed documentation.
