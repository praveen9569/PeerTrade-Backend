// drizzle.config.js

require('dotenv').config({ path: './.env' });
const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});