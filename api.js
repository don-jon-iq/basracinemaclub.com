const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb } = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'basra-cinema-club-secret-key-2024';

// Multer config for poster uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, 'img', 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Auth middleware
function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- AUTH ---
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const db = getDb();
  try {
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: admin.username });
  } finally {
    db.close();
  }
});

// --- SEASONS (public) ---
router.get('/seasons', (req, res) => {
  const db = getDb();
  try {
    const seasons = db.prepare('SELECT * FROM seasons ORDER BY sort_order').all();
    const result = seasons.map(season => {
      const films = db.prepare('SELECT * FROM films WHERE season_id = ? ORDER BY sort_order').all(season.id);
      if (season.type === 'director-retrospective') {
        const directors = db.prepare('SELECT * FROM directors WHERE season_id = ? ORDER BY sort_order').all(season.id);
        const directorsWithFilms = directors.map(dir => {
          const dirFilms = db.prepare('SELECT * FROM director_films WHERE director_id = ? ORDER BY sort_order').all(dir.id);
          return { ...dir, films: dirFilms };
        });
        return { ...season, films, directors: directorsWithFilms };
      }
      return { ...season, films };
    });
    res.json(result);
  } finally {
    db.close();
  }
});

// --- SEASONS (admin) ---
router.post('/seasons', authRequired, (req, res) => {
  const { title, country, description, type, sort_order } = req.body;
  if (!title || !country || !description) {
    return res.status(400).json({ error: 'Title, country, and description are required' });
  }
  const db = getDb();
  try {
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM seasons').get();
    const order = sort_order || (maxOrder.max || 0) + 1;
    const result = db.prepare(
      'INSERT INTO seasons (title, country, description, type, sort_order) VALUES (?, ?, ?, ?, ?)'
    ).run(title, country, description, type || 'regular', order);
    const season = db.prepare('SELECT * FROM seasons WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(season);
  } finally {
    db.close();
  }
});

router.put('/seasons/:id', authRequired, (req, res) => {
  const { title, country, description, type, sort_order } = req.body;
  const db = getDb();
  try {
    const existing = db.prepare('SELECT * FROM seasons WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Season not found' });
    db.prepare(
      'UPDATE seasons SET title = ?, country = ?, description = ?, type = ?, sort_order = ? WHERE id = ?'
    ).run(
      title || existing.title,
      country || existing.country,
      description || existing.description,
      type || existing.type,
      sort_order != null ? sort_order : existing.sort_order,
      req.params.id
    );
    const updated = db.prepare('SELECT * FROM seasons WHERE id = ?').get(req.params.id);
    res.json(updated);
  } finally {
    db.close();
  }
});

router.delete('/seasons/:id', authRequired, (req, res) => {
  const db = getDb();
  try {
    const existing = db.prepare('SELECT * FROM seasons WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Season not found' });
    db.prepare('DELETE FROM seasons WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } finally {
    db.close();
  }
});

// --- FILMS (admin) ---
router.post('/seasons/:id/films', authRequired, upload.single('poster'), (req, res) => {
  const { title, director, year_decade, description } = req.body;
  if (!title || !director || !year_decade || !description) {
    return res.status(400).json({ error: 'All film fields are required' });
  }
  const db = getDb();
  try {
    const season = db.prepare('SELECT * FROM seasons WHERE id = ?').get(req.params.id);
    if (!season) return res.status(404).json({ error: 'Season not found' });
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM films WHERE season_id = ?').get(req.params.id);
    const order = (maxOrder.max || 0) + 1;
    const posterImage = req.file ? `img/uploads/${req.file.filename}` : '';
    const result = db.prepare(
      'INSERT INTO films (season_id, title, director, year_decade, description, poster_image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(req.params.id, title, director, year_decade, description, posterImage, order);
    const film = db.prepare('SELECT * FROM films WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(film);
  } finally {
    db.close();
  }
});

router.put('/films/:id', authRequired, upload.single('poster'), (req, res) => {
  const { title, director, year_decade, description } = req.body;
  const db = getDb();
  try {
    const existing = db.prepare('SELECT * FROM films WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Film not found' });
    const posterImage = req.file ? `img/uploads/${req.file.filename}` : existing.poster_image;
    db.prepare(
      'UPDATE films SET title = ?, director = ?, year_decade = ?, description = ?, poster_image = ? WHERE id = ?'
    ).run(
      title || existing.title,
      director || existing.director,
      year_decade || existing.year_decade,
      description || existing.description,
      posterImage,
      req.params.id
    );
    const updated = db.prepare('SELECT * FROM films WHERE id = ?').get(req.params.id);
    res.json(updated);
  } finally {
    db.close();
  }
});

router.delete('/films/:id', authRequired, (req, res) => {
  const db = getDb();
  try {
    const existing = db.prepare('SELECT * FROM films WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Film not found' });
    db.prepare('DELETE FROM films WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } finally {
    db.close();
  }
});

// --- DIRECTORS (admin, for retrospective seasons) ---
router.post('/seasons/:id/directors', authRequired, upload.single('portrait'), (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    return res.status(400).json({ error: 'Name and bio are required' });
  }
  const db = getDb();
  try {
    const season = db.prepare('SELECT * FROM seasons WHERE id = ?').get(req.params.id);
    if (!season) return res.status(404).json({ error: 'Season not found' });
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM directors WHERE season_id = ?').get(req.params.id);
    const order = (maxOrder.max || 0) + 1;
    const portrait = req.file ? `img/uploads/${req.file.filename}` : '';
    const result = db.prepare(
      'INSERT INTO directors (season_id, name, bio, portrait_image, sort_order) VALUES (?, ?, ?, ?, ?)'
    ).run(req.params.id, name, bio, portrait, order);
    const director = db.prepare('SELECT * FROM directors WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(director);
  } finally {
    db.close();
  }
});

router.put('/directors/:id', authRequired, upload.single('portrait'), (req, res) => {
  const { name, bio } = req.body;
  const db = getDb();
  try {
    const existing = db.prepare('SELECT * FROM directors WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Director not found' });
    const portrait = req.file ? `img/uploads/${req.file.filename}` : existing.portrait_image;
    db.prepare(
      'UPDATE directors SET name = ?, bio = ?, portrait_image = ? WHERE id = ?'
    ).run(name || existing.name, bio || existing.bio, portrait, req.params.id);
    const updated = db.prepare('SELECT * FROM directors WHERE id = ?').get(req.params.id);
    res.json(updated);
  } finally {
    db.close();
  }
});

router.delete('/directors/:id', authRequired, (req, res) => {
  const db = getDb();
  try {
    const existing = db.prepare('SELECT * FROM directors WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Director not found' });
    db.prepare('DELETE FROM directors WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } finally {
    db.close();
  }
});

// --- DIRECTOR FILMS ---
router.post('/directors/:id/films', authRequired, upload.single('poster'), (req, res) => {
  const { title, year, description } = req.body;
  if (!title || !year || !description) {
    return res.status(400).json({ error: 'Title, year, and description are required' });
  }
  const db = getDb();
  try {
    const director = db.prepare('SELECT * FROM directors WHERE id = ?').get(req.params.id);
    if (!director) return res.status(404).json({ error: 'Director not found' });
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM director_films WHERE director_id = ?').get(req.params.id);
    const order = (maxOrder.max || 0) + 1;
    const posterImage = req.file ? `img/uploads/${req.file.filename}` : '';
    const result = db.prepare(
      'INSERT INTO director_films (director_id, title, year, description, poster_image, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(req.params.id, title, year, description, posterImage, order);
    const film = db.prepare('SELECT * FROM director_films WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(film);
  } finally {
    db.close();
  }
});

router.put('/director-films/:id', authRequired, upload.single('poster'), (req, res) => {
  const { title, year, description } = req.body;
  const db = getDb();
  try {
    const existing = db.prepare('SELECT * FROM director_films WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Director film not found' });
    const posterImage = req.file ? `img/uploads/${req.file.filename}` : existing.poster_image;
    db.prepare(
      'UPDATE director_films SET title = ?, year = ?, description = ?, poster_image = ? WHERE id = ?'
    ).run(title || existing.title, year || existing.year, description || existing.description, posterImage, req.params.id);
    const updated = db.prepare('SELECT * FROM director_films WHERE id = ?').get(req.params.id);
    res.json(updated);
  } finally {
    db.close();
  }
});

router.delete('/director-films/:id', authRequired, (req, res) => {
  const db = getDb();
  try {
    const existing = db.prepare('SELECT * FROM director_films WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Director film not found' });
    db.prepare('DELETE FROM director_films WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } finally {
    db.close();
  }
});

module.exports = router;
