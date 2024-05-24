// netlify/functions/login.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, password } = JSON.parse(event.body);

  try {
    const player = await prisma.player.findUnique({
      where: {
        name,
      },
    });

    if (player && player.password === password) { // In production, use bcrypt to compare the hashed password
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful', player: player }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error logging in' }),
    };
  } finally {
    await prisma.$disconnect();
  }
};