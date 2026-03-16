import express from 'express';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// MySQL Connection Pool
let pool = null;

async function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'barber_db',
        port: parseInt(process.env.DB_PORT || '3306'),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      console.log('MySQL Pool created');
    } catch (error) {
      console.error('Failed to create MySQL pool:', error);
    }
  }
  return pool;
}

// Initialize Database (Mock data if connection fails or tables missing)
async function initDb() {
  const p = await getPool();
  if (!p) return;

  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        duration INT NOT NULL,
        photoURL TEXT
      )
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS barbers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        speciality VARCHAR(255),
        experience VARCHAR(255),
        photoURL TEXT
      )
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        userName VARCHAR(255),
        barberId INT,
        barberName VARCHAR(255),
        serviceId INT,
        serviceName VARCHAR(255),
        date DATE,
        slot VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        price DECIMAL(10, 2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if empty and seed
    const [rows] = await p.query('SELECT COUNT(*) as count FROM services');
    if (rows[0].count === 0) {
      console.log('Seeding database...');
      await p.query(`
        INSERT INTO services (name, description, price, duration, photoURL) VALUES
        ('Signature Haircut', 'Precise fading and styling tailored to your face shape.', 45.00, 45, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800'),
        ('Beard Sculpting', 'Line-up, trim, and hot towel treatment for the modern beard.', 30.00, 30, 'https://images.unsplash.com/photo-1621605815841-aa88c82b0248?auto=format&fit=crop&q=80&w=800'),
        ('Premium Headwash', 'Relaxing scalp massage and premium deep conditioning treatment.', 25.00, 20, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'),
        ('Hair Coloring', 'Professional hair coloring using premium products for a stylish modern look.', 55.00, 60, 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800'),
        ('Kids Haircut', 'Stylish and comfortable haircuts for kids.', 20.00, 25, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800'),
        ('Hair & Beard Combo', 'Complete grooming package including haircut and beard styling.', 60.00, 60, 'https://images.unsplash.com/photo-1593702295094-ada74bc4a149?auto=format&fit=crop&q=80&w=800'),
        ('Luxury Shave', 'Traditional hot towel shave with premium grooming products.', 35.00, 30, 'https://images.unsplash.com/photo-1503951458645-643d53efd90f?auto=format&fit=crop&q=80&w=800'),
        ('Scalp Treatment', 'Deep scalp treatment for healthy hair and relaxation.', 40.00, 35, 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800')
      `);

      await p.query(`
        INSERT INTO barbers (name, speciality, experience, photoURL) VALUES
        ('Alex', 'Fade Specialist', '8+ Years', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800'),
        ('David', 'Classic Cuts', '12+ Years', 'https://images.unsplash.com/photo-1512690196252-741d2fd36ad0?auto=format&fit=crop&q=80&w=800'),
        ('Marcus', 'Beard Styling', '6+ Years', 'https://images.unsplash.com/photo-1622286332618-f2802b9c74bc?auto=format&fit=crop&q=80&w=800')
      `);
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/services', async (req, res) => {
  console.log('GET /api/services');
  try {
    const p = await getPool();
    if (!p) throw new Error('No DB connection');
    const [rows] = await p.query('SELECT * FROM services');
    res.json(rows);
  } catch (error) {
    console.error('Error in GET /api/services:', error);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
});

app.get('/api/barbers', async (req, res) => {
  console.log('GET /api/barbers');
  try {
    const p = await getPool();
    if (!p) throw new Error('No DB connection');
    const [rows] = await p.query('SELECT * FROM barbers');
    res.json(rows);
  } catch (error) {
    console.error('Error in GET /api/barbers:', error);
    res.status(500).json({ error: 'Failed to fetch barbers', details: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  console.log('POST /api/bookings', req.body);
  try {
    const p = await getPool();
    if (!p) throw new Error('No DB connection');
    const { userId, userName, barberId, barberName, serviceId, serviceName, date, slot, price } = req.body;
    const [result] = await p.query(
      'INSERT INTO bookings (userId, userName, barberId, barberName, serviceId, serviceName, date, slot, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, userName, barberId, barberName, serviceId, serviceName, date, slot, price]
    );
    res.json({ id: result.insertId, status: 'success' });
  } catch (error) {
    console.error('Error in POST /api/bookings:', error);
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
});

app.get('/api/bookings/:userId', async (req, res) => {
  console.log(`GET /api/bookings/${req.params.userId}`);
  try {
    const p = await getPool();
    if (!p) throw new Error('No DB connection');
    const [rows] = await p.query('SELECT * FROM bookings WHERE userId = ? ORDER BY createdAt DESC', [req.params.userId]);
    res.json(rows);
  } catch (error) {
    console.error(`Error in GET /api/bookings/${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
});

app.patch('/api/bookings/:id/cancel', async (req, res) => {
  console.log(`PATCH /api/bookings/${req.params.id}/cancel`);
  try {
    const p = await getPool();
    if (!p) throw new Error('No DB connection');
    await p.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [req.params.id]);
    res.json({ status: 'success' });
  } catch (error) {
    console.error(`Error in PATCH /api/bookings/${req.params.id}/cancel:`, error);
    res.status(500).json({ error: 'Failed to cancel booking', details: error.message });
  }
});

// Vite Integration
async function startServer() {
  await initDb();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
