const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Resource = require('../models/Resource');
const authMiddleware = require('../middlewares/auth');
const cacheMiddleware = require('../middlewares/cache');

const router = express.Router();

// Get all resources
router.get('/', authMiddleware,cacheMiddleware, async (req, res, next) => {
    try {
      const { page, limit, sortField, sortOrder } = req.query;
  
      const skipCount = (page - 1) * limit;
      const sortOptions = { [sortField]: sortOrder };
  
      const resources = await Resource.find()
        .skip(skipCount)
        .limit(parseInt(limit))
        .sort(sortOptions);
  
      res.json(resources);
    } catch (error) {
      next(error);
    }
  });

// Create a new resource
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Extract the authenticated user ID from the token
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    const user = await User.findById(userId);

    // Create the resource using the authenticated user's data
    const { title, content } = req.body;
    const resource = { title, content, createdBy: user };

    // Save the resource to the database
    // ...

    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
});

// Update a resource
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const { title, content } = req.body;

    // Update the resource in the database
    // ...

    res.json({ message: 'Resource updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete a resource
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const resourceId = req.params.id;

    // Delete the resource from the database
    // ...

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
