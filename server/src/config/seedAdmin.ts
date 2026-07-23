import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

export const seedAdmin = async (): Promise<void> => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('Seeding default Admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        fullName: 'Guild Code Admin',
        email: 'admin@guildcode.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        status: 'active',
        joinDate: new Date()
      });

      await adminUser.save();
      console.log('Default Admin user seeded successfully!');
      console.log('Email: admin@guildcode.com | Password: admin123');
    } else {
      console.log('Admin user already exists in the database.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};
