const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('../models');
const { RESPONSE_MESSAGES } = require('../utils/constants');

class AuthService {
  static async login(email, password, role) {
    const user = await models.User.findOne({ where: { email, role } });
    if (!user) throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    
    if (!await bcrypt.compare(password, user.password)) {
      throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }
    
    if (role === 'agency' && user.status !== 'approved') {
      throw new Error('Agency not approved');
    }
    
    const token = jwt.sign(
      { id: user.id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return { success: true, token, user };
  }

  static async register(email, password, name, location, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await models.User.create({
        email,
        password: hashedPassword,
        name,
        location: role === 'agency' ? location : null,
        role,
        status: role === 'agency' ? 'pending' : 'approved'
      });
      return { success: true, id: user.id };
    } catch (err) {
      throw new Error('Email already exists');
    }
  }
}

module.exports = { AuthService };