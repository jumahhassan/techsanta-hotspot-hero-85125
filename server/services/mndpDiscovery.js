import dgram from 'dgram';
import { networkInterfaces } from 'os';

const MNDP_PORT = 5678;
const MNDP_MULTICAST = '255.255.255.255';
const DISCOVERY_TIMEOUT = 5000; // 5 seconds

/**
 * Parse MNDP packet to extract router information
 * MNDP packet structure: 4-byte header + Type-Length-Value (TLV) format
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

    console.log(`   Starting parse at offset ${offset}, buffer length: ${buffer.length}`);

    while (offset < buffer.length - 3) {
      const type = buffer.readUInt16BE(offset);
      offset += 2;

      if (offset >= buffer.length) break;

      const length = buffer.readUInt16BE(offset);
      offset += 2;

      console.log(`   -> Type: 0x${type.toString(16).padStart(4, '0')}, Length: ${length}, Offset: ${offset}`);

      if (offset + length > buffer.length) {
        console.log(`   -> Overflow detected: offset(${offset}) + length(${length}) > buffer(${buffer.length})`);
        break;
      }

      const value = buffer.slice(offset, offset + length);
      console.log(`   -> Value (hex): ${value.toString('hex')}`);

      // Parse different TLV types based on MNDP specification
      switch (type) {
        case 0x0001: // MAC Address
          if (length === 6) {
            router.macAddress = Array.from(value)
              .map(b => b.toString(16).padStart(2, '0'))
              .join(':')
              .toUpperCase();
            console.log(`   -> Parsed MAC: ${router.macAddress}`);
          } else {
            console.log(`   -> MAC length mismatch: expected 6, got ${length}`);
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
    console.error('Error parsing MNDP packet:', error);
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
 * This triggers MikroTik routers to respond with their information
 */
function createMNDPRequest() {
  // MNDP discovery request is just an empty packet or a minimal packet
  // MikroTik routers respond to any UDP packet on port 5678
  const buffer = Buffer.alloc(4);
  buffer.writeUInt16LE(0, 0); // Type
  buffer.writeUInt16LE(0, 2); // Length
  return buffer;
}

/**
 * Discover MikroTik routers on the local network using MNDP
 * @returns {Promise<Array>} Array of discovered routers
 */
export async function discoverRouters() {
  return new Promise((resolve) => {
    const discoveredRouters = new Map(); // Use Map to avoid duplicates by MAC
    const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    // Set up socket options
    socket.on('error', (err) => {
      console.error('MNDP Discovery socket error:', err);
      socket.close();
      resolve([]);
    });

    socket.on('message', (msg, rinfo) => {
      try {
        console.log(`📡 Received MNDP packet from ${rinfo.address}:${rinfo.port}`);
        console.log(`   Packet size: ${msg.length} bytes`);
        console.log(`   First 32 bytes (hex): ${msg.slice(0, 32).toString('hex')}`);

        const router = parseMNDPPacket(msg);

        console.log(`   Parsed data:`, JSON.stringify(router, null, 2));

        // Only add if we got meaningful data
        if (router.macAddress && router.identity) {
          // Use source IP from the packet
          router.host = rinfo.address;
          router.discoveredAt = new Date().toISOString();

          // Store by MAC to avoid duplicates
          discoveredRouters.set(router.macAddress, router);
          console.log(`✅ Added router: ${router.identity} (${rinfo.address})`);
        } else {
          console.log(`⚠️  Packet received but no valid MAC/Identity found`);
        }
      } catch (error) {
        console.error('Error processing MNDP message:', error);
      }
    });

    socket.on('listening', () => {
      const address = socket.address();
      console.log(`MNDP Discovery listening on ${address.address}:${address.port}`);

      // Enable broadcast
      socket.setBroadcast(true);

      console.log('Sending MNDP discovery requests...');

      // Send MNDP discovery requests to trigger router responses
      const discoveryPacket = createMNDPRequest();
      const interfaces = getLocalInterfaces();

      if (interfaces.length === 0) {
        console.log('⚠️  No network interfaces found. Trying broadcast to 255.255.255.255');
        // Fallback to general broadcast
        socket.send(discoveryPacket, 0, discoveryPacket.length, MNDP_PORT, '255.255.255.255', (err) => {
          if (err) {
            console.error('Error sending MNDP broadcast:', err);
          } else {
            console.log('📤 Sent MNDP discovery to 255.255.255.255');
          }
        });
      } else {
        // Send to each network interface's broadcast address
        interfaces.forEach(iface => {
          console.log(`📤 Sending MNDP discovery on ${iface.interface} (${iface.address}) to ${iface.broadcast}`);
          socket.send(discoveryPacket, 0, discoveryPacket.length, MNDP_PORT, iface.broadcast, (err) => {
            if (err) {
              console.error(`Error sending to ${iface.broadcast}:`, err);
            }
          });
        });

        // Also send to general broadcast as fallback
        socket.send(discoveryPacket, 0, discoveryPacket.length, MNDP_PORT, '255.255.255.255', (err) => {
          if (err) {
            console.error('Error sending MNDP broadcast:', err);
          } else {
            console.log('📤 Sent MNDP discovery to 255.255.255.255');
          }
        });
      }

      // Send multiple discovery requests over the discovery period
      const sendInterval = setInterval(() => {
        interfaces.forEach(iface => {
          socket.send(discoveryPacket, 0, discoveryPacket.length, MNDP_PORT, iface.broadcast, () => {});
        });
        socket.send(discoveryPacket, 0, discoveryPacket.length, MNDP_PORT, '255.255.255.255', () => {});
      }, 1000); // Send every second

      // Clear interval when discovery completes
      setTimeout(() => {
        clearInterval(sendInterval);
      }, DISCOVERY_TIMEOUT);
    });

    // Bind to MNDP port
    socket.bind(MNDP_PORT);

    // Stop listening after timeout
    setTimeout(() => {
      socket.close();
      const routers = Array.from(discoveredRouters.values());
      console.log(`Discovery complete. Found ${routers.length} MikroTik router(s)`);
      resolve(routers);
    }, DISCOVERY_TIMEOUT);
  });
}

/**
 * Start passive MNDP listener (for continuous monitoring)
 * This is optional - for background discovery
 */
export function startMNDPListener(callback) {
  const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

  socket.on('error', (err) => {
    console.error('MNDP Listener error:', err);
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
      console.error('Error processing MNDP message:', error);
    }
  });

  socket.on('listening', () => {
    const address = socket.address();
    console.log(`MNDP Listener active on ${address.address}:${address.port}`);
    socket.setBroadcast(true);
  });

  socket.bind(MNDP_PORT);

  return socket; // Return socket so it can be closed later if needed
}
