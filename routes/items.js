// routes/items.js

const express = require('express');
const { db } = require('../src/db/db');
const { items, users } = require('../src/db/schema');
const { eq, and } = require('drizzle-orm');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// --- GET all items (public) ---
router.get('/', async (req, res) => {
  try {
    const allItems = await db.select().from(items);
    res.status(200).json(allItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- GET single item by ID (public) ---
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- POST new item (protected) ---
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, price, category, images } = req.body;
  const userId = req.user.userId; // Get userId from the authenticated user token

  try {
    const [newItem] = await db.insert(items).values({
      userId,
      title,
      description,
      price,
      category,
      images,
    }).returning();

    res.status(201).json({ message: 'Item created successfully!', item: newItem });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- PUT update item by ID (protected) ---
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { title, description, price, category, images } = req.body;

  try {
    // Find the item and ensure the authenticated user is the owner
    const [existingItem] = await db.select().from(items).where(and(eq(items.id, id), eq(items.userId, userId)));

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found or you do not have permission to edit it.' });
    }

    const [updatedItem] = await db.update(items).set({
      title,
      description,
      price,
      category,
      images,
    }).where(eq(items.id, id)).returning();

    res.status(200).json({ message: 'Item updated successfully!', item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- DELETE item by ID (protected) ---
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Ensure the authenticated user is the owner
    const [existingItem] = await db.select().from(items).where(and(eq(items.id, id), eq(items.userId, userId)));
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found or you do not have permission to delete it.' });
    }
    
    // Delete the item
    await db.delete(items).where(eq(items.id, id));

    res.status(200).json({ message: 'Item deleted successfully!' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;