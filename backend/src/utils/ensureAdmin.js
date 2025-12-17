import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  let user = await User.findOne({ email });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = await User.create({ name: 'Administrator', email, password: hash, role: 'ADMIN' });
    console.log(`👑 Admin user created: ${email}`);
    return;
  }
  if (user.role !== 'ADMIN') {
    user.role = 'ADMIN';
    await user.save();
    console.log(`👑 User promoted to admin: ${email}`);
  } else {
    console.log(`👑 Admin present: ${email}`);
  }
};
