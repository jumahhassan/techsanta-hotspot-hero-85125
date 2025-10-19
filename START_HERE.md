# 🎅 TechSanta - Quick Start Guide

## Your Router Details
- **Name**: SoukJunub
- **IP**: 192.168.1.171
- **Username**: admin
- **Password**: teledata1
- **Port**: 8728

## Getting Started (3 Simple Steps)

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Start the Backend Server

**Open a terminal and run:**
```bash
cd server
node index.js
```

You should see:
```
🎅 TechSanta Hotspot Manager API running on port 3001
📡 Ready to connect to MikroTik routers
```

**Keep this terminal running!**

### Step 3: Start the Frontend

**Open a NEW terminal (keep the backend running) and run:**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 4: Connect Your Router

1. Open http://localhost:5173 in your browser
2. Click **"Routers"** in the navigation menu
3. Click **"Add Router"** button
4. Fill in the form:
   - Router Name: **SoukJunub**
   - IP Address: **192.168.1.171**
   - Username: **admin**
   - Password: **teledata1**
   - API Port: **8728**
5. Click **"Connect"**

## ✅ What Should Happen

Once connected, you'll see:
- ✅ Your router appears in the Connected Routers table
- ✅ Real-time stats: CPU load, memory usage, uptime
- ✅ Active users count
- ✅ Dashboard shows live data from your MikroTik

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check if port 3001 is in use
netstat -an | grep 3001

# Or use a different port
PORT=3002 node index.js
```

### Can't Connect to Router
1. **Check if MikroTik API is enabled:**
   - Login to your router
   - Go to IP > Services
   - Make sure "api" is enabled on port 8728

2. **Check firewall:**
   - Make sure your computer can reach 192.168.1.171
   - Try: `ping 192.168.1.171`

3. **Test manually:**
   - Use MikroTik's Winbox to verify credentials work

### Frontend Can't Reach Backend
- Make sure the backend terminal is still running
- Check the backend URL in console (should be localhost:3001)
- Clear browser cache and reload

## 📱 Features You Can Use

Once connected, you can:
- ✨ View real-time active hotspot users
- 🎫 Create vouchers for internet access
- 👥 Manage hotspot users (create, delete)
- 📊 Monitor router performance
- 🔌 Disconnect active users
- 📈 View usage statistics

## 🆘 Need Help?

Contact: **+211924251197**

---

**Powered by TechSanta**
*Reliable. Community-focused. Tech-savvy.*
