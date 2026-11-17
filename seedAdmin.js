import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Import your Admin model (adjust path if your models folder is elsewhere)
import { Admin } from './models/index.js'; 

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const email = process.env.ADMIN_EMAIL || 'pahujakashish18@gmail.com';
    const plainPassword = process.env.ADMIN_PASSWORD || 'admin@123!';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.log(`Admin user with email "${email}" already exists.`);
      process.exit(0);
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create the admin record
    await Admin.create({
      name: 'Super Admin',
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin'
    });

    console.log(`Successfully created admin user!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${plainPassword}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin user:', err);
    process.exit(1);
  }
}

seedAdmin();