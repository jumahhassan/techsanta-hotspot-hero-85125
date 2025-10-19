import express from 'express';
import cors from 'cors';
import { RouterOSClient } from 'routeros-client';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Store active router connections (in-memory, no database)
const connectedRouters = new Map();

// Helper function to connect to a MikroTik router
async function connectToRouter(host, username, password, port = 8728) {
  const client = new RouterOSClient({
    host: host,
    user: username,
    password: password,
    port: port,
    timeout: 10,
  });

  // Add error handler to prevent crashes
  client.on('error', (err) => {
    console.error('RouterOS Client Error:', err.message);
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    // Provide more helpful error messages
    let errorMessage = 'Failed to connect to router';

    if (error.errno === 'SOCKTMOUT' || error.message.includes('Timed out')) {
      errorMessage = 'Connection timeout. Check if router IP is correct and API is enabled on port ' + port;
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Connection refused. Make sure API service is running on the router';
    } else if (error.message.includes('authentication')) {
      errorMessage = 'Authentication failed. Check username and password';
    } else {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}

// API Routes

// Test router connection
app.post('/api/router/test', async (req, res) => {
  const { host, username, password, port } = req.body;

  try {
    const conn = await connectToRouter(host, username, password, port);

    // Get system identity to verify connection
    const identity = await conn.write('/system/identity/print');

    await conn.close();

    res.json({
      success: true,
      message: 'Connection successful',
      identity: identity[0]?.name || 'Unknown',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Add/Connect to a router
app.post('/api/router/connect', async (req, res) => {
  const { id, name, host, username, password, port } = req.body;

  try {
    const conn = await connectToRouter(host, username, password, port);

    // Get router information
    const [identity, resource, routerboard] = await Promise.all([
      conn.write('/system/identity/print'),
      conn.write('/system/resource/print'),
      conn.write('/system/routerboard/print').catch(() => [{}]),
    ]);

    const routerInfo = {
      id: id || `router_${Date.now()}`,
      name: name || identity[0]?.name || 'Unknown Router',
      host,
      username,
      password,
      port: port || 8728,
      identity: identity[0]?.name || 'Unknown',
      uptime: resource[0]?.uptime || 'Unknown',
      version: resource[0]?.version || 'Unknown',
      model: routerboard[0]?.model || 'Unknown',
      cpuLoad: parseInt(resource[0]?.['cpu-load']) || 0,
      freeMemory: parseInt(resource[0]?.['free-memory']) || 0,
      totalMemory: parseInt(resource[0]?.['total-memory']) || 0,
      connectedAt: new Date().toISOString(),
    };

    connectedRouters.set(routerInfo.id, {
      ...routerInfo,
      connection: conn,
    });

    // Remove sensitive data before sending to client
    const { password: _, connection: __, ...safeRouterInfo } = connectedRouters.get(routerInfo.id);

    res.json({
      success: true,
      router: safeRouterInfo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all connected routers
app.get('/api/routers', (req, res) => {
  const routers = Array.from(connectedRouters.values()).map(router => {
    const { password, connection, ...safeRouter } = router;
    return safeRouter;
  });

  res.json({
    success: true,
    routers,
  });
});

// Get single router info
app.get('/api/router/:id', async (req, res) => {
  const { id } = req.params;
  const router = connectedRouters.get(id);

  if (!router) {
    return res.status(404).json({
      success: false,
      message: 'Router not found',
    });
  }

  try {
    // Get fresh data from router
    const [resource, hotspotActive] = await Promise.all([
      router.connection.write('/system/resource/print'),
      router.connection.write('/ip/hotspot/active/print').catch(() => []),
    ]);

    const { password, connection, ...safeRouter } = router;

    res.json({
      success: true,
      router: {
        ...safeRouter,
        cpuLoad: parseInt(resource[0]?.['cpu-load']) || 0,
        freeMemory: parseInt(resource[0]?.['free-memory']) || 0,
        totalMemory: parseInt(resource[0]?.['total-memory']) || 0,
        uptime: resource[0]?.uptime || 'Unknown',
        activeUsers: hotspotActive.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Disconnect from router
app.delete('/api/router/:id', async (req, res) => {
  const { id } = req.params;
  const router = connectedRouters.get(id);

  if (!router) {
    return res.status(404).json({
      success: false,
      message: 'Router not found',
    });
  }

  try {
    await router.connection.close();
    connectedRouters.delete(id);

    res.json({
      success: true,
      message: 'Router disconnected successfully',
    });
  } catch (error) {
    connectedRouters.delete(id);
    res.json({
      success: true,
      message: 'Router disconnected',
    });
  }
});

// Get hotspot active users
app.get('/api/router/:id/hotspot/active', async (req, res) => {
  const { id } = req.params;
  const router = connectedRouters.get(id);

  if (!router) {
    return res.status(404).json({
      success: false,
      message: 'Router not found',
    });
  }

  try {
    const activeUsers = await router.connection.write('/ip/hotspot/active/print');

    res.json({
      success: true,
      users: activeUsers.map(user => ({
        id: user['.id'],
        user: user.user,
        address: user.address,
        mac: user['mac-address'],
        loginBy: user['login-by'],
        uptime: user.uptime,
        bytesIn: user['bytes-in'],
        bytesOut: user['bytes-out'],
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get hotspot users (all users, not just active)
app.get('/api/router/:id/hotspot/users', async (req, res) => {
  const { id } = req.params;
  const router = connectedRouters.get(id);

  if (!router) {
    return res.status(404).json({
      success: false,
      message: 'Router not found',
    });
  }

  try {
    const users = await router.connection.write('/ip/hotspot/user/print');

    res.json({
      success: true,
      users: users.map(user => ({
        id: user['.id'],
        name: user.name,
        password: user.password,
        profile: user.profile,
        uptime: user.uptime,
        bytesIn: user['bytes-in'],
        bytesOut: user['bytes-out'],
        disabled: user.disabled === 'true',
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create hotspot user
app.post('/api/router/:id/hotspot/users', async (req, res) => {
  const { id } = req.params;
  const { name, password, profile, comment } = req.body;
  const router = connectedRouters.get(id);

  if (!router) {
    return res.status(404).json({
      success: false,
      message: 'Router not found',
    });
  }

  try {
    const params = {
      name,
      password,
    };

    if (profile) params.profile = profile;
    if (comment) params.comment = comment;

    await router.connection.write('/ip/hotspot/user/add', params);

    res.json({
      success: true,
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete hotspot user
app.delete('/api/router/:id/hotspot/users/:userId', async (req, res) => {
  const { id, userId } = req.params;
  const router = connectedRouters.get(id);

  if (!router) {
    return res.status(404).json({
      success: false,
      message: 'Router not found',
    });
  }

  try {
    await router.connection.write('/ip/hotspot/user/remove', { '.id': userId });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Disconnect active user
app.post('/api/router/:id/hotspot/active/:userId/disconnect', async (req, res) => {
  const { id, userId } = req.params;
  const router = connectedRouters.get(id);

  if (!router) {
    return res.status(404).json({
      success: false,
      message: 'Router not found',
    });
  }

  try {
    await router.connection.write('/ip/hotspot/active/remove', { '.id': userId });

    res.json({
      success: true,
      message: 'User disconnected successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get hotspot profiles
app.get('/api/router/:id/hotspot/profiles', async (req, res) => {
  const { id } = req.params;
  const router = connectedRouters.get(id);

  if (!router) {
    return res.status(404).json({
      success: false,
      message: 'Router not found',
    });
  }

  try {
    const profiles = await router.connection.write('/ip/hotspot/user/profile/print');

    res.json({
      success: true,
      profiles: profiles.map(profile => ({
        id: profile['.id'],
        name: profile.name,
        sharedUsers: profile['shared-users'],
        rateLimit: profile['rate-limit'],
        sessionTimeout: profile['session-timeout'],
        idleTimeout: profile['idle-timeout'],
        keepaliveTimeout: profile['keepalive-timeout'],
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    connectedRouters: connectedRouters.size,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Process error handlers to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`🎅 TechSanta Hotspot Manager API running on port ${PORT}`);
  console.log(`📡 Ready to connect to MikroTik routers`);
});
