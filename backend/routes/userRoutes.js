const express = require('express');
const router = express.Router();
const { createUser, getUser } = require('../controllers/userController');

// POST /api/users - Create or get user
router.post('/', createUser);

// GET /api/users/:id - Get user profile
router.get('/:id', getUser);

module.exports = router;
