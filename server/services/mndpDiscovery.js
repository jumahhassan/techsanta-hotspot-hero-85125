import dgram from 'dgram';
import { networkInterfaces } from 'os';

const MNDP_PORT = 5678;
const DISCOVERY_TIMEOUT = 5000; // 5 seconds

/**
 * Parse MNDP packet to extract router information
 * MNDP uses Little Endian (LE) byte order for TLV fields
 */
function parseMNDPPacket(buffer) {
  const router = {
    macAddress: null,
    identity: null,
    version: null,
    platform: null,
    uptime: null,
    softwareId: null,
    board: null,
    unpack: null,
    ipAddress: null,
    ipv6Address: null,
    interfaceName: null,
  };

  // Skip empty packets (our own discovery requests echoed back)
  if (buffer.length <= 4) {
    return router;
  }

  try {
    // Skip 4-byte header (sequence number)
    let offset = 4;

    while (offset < buffer.length - 3) {
      // Read Type and Length as Little Endian (LE)
      const type = buffer.readUInt16LE(offset);
      offset += 2;

      if (offset >= buffer.length) break;

      const length = buffer.readUInt16LE(offset);
      offset += 2;

      // Validate length
      if (offset + length > buffer.length) {
        console.warn(`MNDP packet parsing stopped: invalid length ${length} at offset ${offset}`);
        break;
      }

      const value = buffer.slice(offset, offset + length);

      // Parse different TLV types based on MNDP specification
      switch (type) {
        case 0x0001: // MAC Address
          if (length === 6) {
            router.macAddress = Array.from(value)
              .map(b => b.toString(16).padStart(2, '0'))
              .join(':')
              .toUpperCase();
          }
          break;
        case 0x0005: // Identity/Name
          router.identity = value.toString('utf8').replace(/\0/g, '');
          break;
        case 0x0007: // Version
          router.version = value.toString('utf8').replace(/\0/g, '');
          break;
        case 0x0008: // Platform
          router.platform = value.toString('utf8').replace(/\0/g, '');
          break;
        case 0x000a: // Uptime
          if (length === 4) {
            router.uptime = value.readUInt32LE(0);
          }
          break;
        case 0x000b: // Software ID
          router.softwareId = value.toString('utf8').replace(/\0/g, '');
          break;
        case 0x000c: // Board name
          router.board = value.toString('utf8').replace(/\0/g, '');
          break;
        case 0x000e: // Unpack
          router.unpack = value.toString('utf8').replace(/\0/g, '');
          break;
        case 0x0010: // IPv4 Address
          if (length === 4) {
            router.ipAddress = Array.from(value).join('.');
          }
          break;
        case 0x0011: // IPv6 Address
          if (length === 16) {
            const ipv6Parts = [];
            for (let i = 0; i < 16; i += 2) {
              ipv6Parts.push(value.readUInt16BE(i).toString(16));
            }
            router.ipv6Address = ipv6Parts.join(':');
          }
          break;
        case 0x0012: // Interface name
          router.interfaceName = value.toString('utf8').replace(/\0/g, '');
          break;
      }

      offset += length;
    }
  } catch (error) {
    console.error('Error parsing MNDP packet:', error.message);
  }

  return router;
}

/**
 * Get all local network interfaces and their broadcast addresses
 */
function getLocalInterfaces() {
  const interfaces = networkInterfaces();
  const broadcastAddresses = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    for (const addr of addrs) {
      // Only IPv4, not internal (loopback)
      if (addr.family === 'IPv4' && !addr.internal) {
        // Calculate broadcast address
        const ip = addr.address.split('.').map(Number);
        const netmask = addr.netmask.split('.').map(Number);
        const broadcast = ip.map((octet, i) => octet | (~netmask[i] & 255));

        broadcastAddresses.push({
          interface: name,
          address: addr.address,
          broadcast: broadcast.join('.'),
        });
      }
    }
  }

  return broadcastAddresses;
}

/**
 * Create MNDP discovery request packet
 */
function createMNDPRequest() {
  // MNDP discovery request is just an empty 4-byte packet
  const buffer = Buffer.alloc(4);
  buffer.writeUInt16LE(0, 0);
  buffer.writeUInt16LE(0, 2);
  return buffer;
}

/**
 * Discover MikroTik routers on the local network using MNDP
 * @returns {Promise<Array>} Array of discovered routers
 */
export async function discoverRouters() {
  return new Promise((resolve) => {
    const discoveredRouters = new Map();
    const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    let isSocketClosed = false;

    socket.on('error', (err) => {
      console.error('MNDP socket error:', err.message);
      if (!isSocketClosed) {
        isSocketClosed = true;
        socket.close();
      }
      resolve([]);
    });

    socket.on('message', (msg, rinfo) => {
      try {
        const router = parseMNDPPacket(msg);

        // Only add if we got meaningful data
        if (router.macAddress && router.identity) {
          router.host = rinfo.address;
          router.discoveredAt = new Date().toISOString();
          discoveredRouters.set(router.macAddress, router);
          console.log(`✅ Discovered: ${router.identity} at ${rinfo.address} (${router.macAddress})`);
        }
      } catch (error) {
        console.error('Error processing MNDP message:', error.message);
      }
    });

    socket.on('listening', () => {
      const address = socket.address();
      console.log(`MNDP Discovery listening on ${address.address}:${address.port}`);

      try {
        socket.setBroadcast(true);
      } catch (err) {
        console.error('Failed to enable broadcast:', err.message);
      }

      const discoveryPacket = createMNDPRequest();
      const interfaces = getLocalInterfaces();

      const sendDiscovery = () => {
        if (isSocketClosed) return;

        if (interfaces.length === 0) {
          socket.send(discoveryPacket, 0, discoveryPacket.length, MNDP_PORT, '255.255.255.255', () => {});
        } else {
          // Send to each interface's broadcast address
          interfaces.forEach(iface => {
            socket.send(discoveryPacket, 0, discoveryPacket.length, MNDP_PORT, iface.broadcast, () => {});
          });
          // Also send to general broadcast
          socket.send(discoveryPacket, 0, discoveryPacket.length, MNDP_PORT, '255.255.255.255', () => {});
        }
      };

      // Send immediately
      sendDiscovery();

      // Send every second during discovery period
      const sendInterval = setInterval(sendDiscovery, 1000);

      setTimeout(() => {
        clearInterval(sendInterval);
      }, DISCOVERY_TIMEOUT);
    });

    // Bind to MNDP port on all interfaces
    socket.bind(MNDP_PORT, '0.0.0.0');

    // Stop after timeout
    setTimeout(() => {
      if (!isSocketClosed) {
        isSocketClosed = true;
        socket.close();
        const routers = Array.from(discoveredRouters.values());
        console.log(`MNDP Discovery complete. Found ${routers.length} router(s)`);
        resolve(routers);
      }
    }, DISCOVERY_TIMEOUT);
  });
}

/**
 * Start passive MNDP listener (for continuous monitoring)
 */
export function startMNDPListener(callback) {
  const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

  socket.on('error', (err) => {
    console.error('MNDP Listener error:', err.message);
  });

  socket.on('message', (msg, rinfo) => {
    try {
      const router = parseMNDPPacket(msg);
      if (router.macAddress && router.identity) {
        router.host = rinfo.address;
        router.discoveredAt = new Date().toISOString();
        callback(router);
      }
    } catch (error) {
      console.error('Error processing MNDP message:', error.message);
    }
  });

  socket.on('listening', () => {
    const address = socket.address();
    console.log(`MNDP Listener active on ${address.address}:${address.port}`);
    socket.setBroadcast(true);
  });

  socket.bind(MNDP_PORT, '0.0.0.0');

  return socket;
}
