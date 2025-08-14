import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  if (method === 'POST') {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: hashedPassword,
      });

      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}