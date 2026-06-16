const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../users');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'username y password requeridos' });
    }

    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.hash);

    if (!match) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ success: true, token, username: user.username });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

module.exports = router;
