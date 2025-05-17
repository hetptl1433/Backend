// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./src/models/User');
const Room     = require('./src/models/Room');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Remove old data (optional)
  await User.deleteMany({});
  await Room.deleteMany({});

  // Create users for each role
  await User.create([
    { number: '101', password: 'pass123', role: 'housekeeping' },
    { number: '201', password: 'front123',    role: 'frontdesk'  },
    { number: '301', password: 'admin123',    role: 'admin'      }
  ]);

  // Create 10 rooms (101–110)
  for (let i = 101; i <= 110; i++) {
    await Room.create({ number: `${i}`, status: 'dirty' });
  }

  console.log('✔️  Seed complete');
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
