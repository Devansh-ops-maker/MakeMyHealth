import crypto from 'crypto';
import User from '../models/user.js';
import { createToken } from '../utils/tokens.js';

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    res.json({ 
      message: 'Reset token sent',
      resetURL 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token: resetToken } = req.params;  
    const { password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)  
      .digest('hex');
    
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    const jwtToken = createToken(user._id);
    
    res.json({
      token: jwtToken,
      user: user.profile
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
