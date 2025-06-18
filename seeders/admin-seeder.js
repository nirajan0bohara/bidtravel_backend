const bcrypt = require('bcrypt');
const { models } = require('../models');

async function seedAdmin() {
  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // Change this in production!
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin already exists
    const existingAdmin = await models.User.findOne({
      where: { email: adminEmail, role: 'admin' }
    });

    if (!existingAdmin) {
      await models.User.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Default Admin',
        role: 'admin',
        status: 'approved', // Admins are auto-approved
        location: null,
        rating: 0,
        credits: 0
      });
      console.log('Default admin created successfully!');
    } else {
      console.log('Default admin already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

module.exports = { seedAdmin };