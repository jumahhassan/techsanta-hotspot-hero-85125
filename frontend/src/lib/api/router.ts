// API client for router operations
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Router {
  id: string;
  name: string;
  host: string;
  username: string;
  port: number;
  identity: string;
  uptime: string;
  version: string;
  model: string;
  cpuLoad: number;
  freeMemory: number;
  totalMemory: number;
  connectedAt: string;
  activeUsers?: number;
}

export interface HotspotUser {
  id: string;
  name: string;
  password: string;
  profile: string;
  uptime: string;
  bytesIn: string;
  bytesOut: string;
  disabled: boolean;
}

export interface ActiveUser {
  id: string;
  user: string;
  address: string;
  mac: string;
  loginBy: string;
  uptime: string;
  bytesIn: string;
  bytesOut: string;
}

export interface HotspotProfile {
  id: string;
  name: string;
  sharedUsers: string;
  rateLimit: string;
  sessionTimeout: string;
  idleTimeout: string;
  keepaliveTimeout: string;
}

export const routerAPI = {
  // Test router connection
  async testConnection(host: string, username: string, password: string, port: number = 8728) {
    const response = await fetch(`${API_BASE_URL}/router/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, username, password, port }),
    });
    return response.json();
  },

  // Connect to a router
  async connect(params: {
    id?: string;
    name: string;
    host: string;
    username: string;
    password: string;
    port?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/router/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // Get all connected routers
  async getAll(): Promise<{ success: boolean; routers: Router[] }> {
    const response = await fetch(`${API_BASE_URL}/routers`);
    return response.json();
  },

  // Get single router info
  async getRouter(id: string): Promise<{ success: boolean; router: Router }> {
    const response = await fetch(`${API_BASE_URL}/router/${id}`);
    return response.json();
  },

  // Disconnect router
  async disconnect(id: string) {
    const response = await fetch(`${API_BASE_URL}/router/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Get hotspot active users
  async getActiveUsers(routerId: string): Promise<{ success: boolean; users: ActiveUser[] }> {
    const response = await fetch(`${API_BASE_URL}/router/${routerId}/hotspot/active`);
    return response.json();
  },

  // Get all hotspot users
  async getHotspotUsers(routerId: string): Promise<{ success: boolean; users: HotspotUser[] }> {
    const response = await fetch(`${API_BASE_URL}/router/${routerId}/hotspot/users`);
    return response.json();
  },

  // Create hotspot user
  async createUser(
    routerId: string,
    params: {
      name: string;
      password: string;
      profile?: string;
      comment?: string;
    }
  ) {
    const response = await fetch(`${API_BASE_URL}/router/${routerId}/hotspot/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // Delete hotspot user
  async deleteUser(routerId: string, userId: string) {
    const response = await fetch(`${API_BASE_URL}/router/${routerId}/hotspot/users/${userId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Disconnect active user
  async disconnectUser(routerId: string, userId: string) {
    const response = await fetch(
      `${API_BASE_URL}/router/${routerId}/hotspot/active/${userId}/disconnect`,
      {
        method: 'POST',
      }
    );
    return response.json();
  },

  // Get hotspot profiles
  async getProfiles(routerId: string): Promise<{ success: boolean; profiles: HotspotProfile[] }> {
    const response = await fetch(`${API_BASE_URL}/router/${routerId}/hotspot/profiles`);
    return response.json();
  },
};
