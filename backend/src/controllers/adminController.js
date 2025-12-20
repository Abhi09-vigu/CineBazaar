import User from '../models/User.js';

export const listPendingOwners = async (_req, res) => {
  const users = await User.find({ role: 'OWNER', ownerApproved: false }).select('_id name email role ownerApproved createdAt');
  res.json(users);
};

export const approveOwner = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: 'OWNER' });
  if (!user) return res.status(404).json({ message: 'Owner not found' });
  user.ownerApproved = true;
  await user.save();
  res.json({ message: 'Owner approved', user: { id: user._id, name: user.name, email: user.email, role: user.role, ownerApproved: user.ownerApproved } });
};
