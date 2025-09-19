// src/db/schema.js
const { pgTable, uuid, text, varchar, timestamp } = require('drizzle-orm/pg-core');

// Drizzle ORM Foreign Key helper
const { relations } = require('drizzle-orm');

// Users Table (already exists)
exports.users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }),
  course: varchar('course', { length: 255 }),
  year: varchar('year', { length: 50 }),
  contactInfo: varchar('contact_info', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Items Table
exports.items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => exports.users.id, { onDelete: 'cascade' }), // <-- Foreign Key
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: text('price').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  // Drizzle doesn't have a specific `array` type for JS, so we'll use text
  // and store a string representation (e.g., a comma-separated list or JSON)
  images: text('images').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});