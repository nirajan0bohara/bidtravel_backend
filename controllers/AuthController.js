// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { User } = require('../models');
// const { roles } = require('../utils/constants');

// module.exports = {
//   register: async (req, res) => {
//     try {
//       const { email, password, role } = req.body;

//       const existingUser = await User.findOne({ where: { email } });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email already exists' });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = await User.create({
//         email,
//         password: hashedPassword,
//         role,
//         status: role === roles.AGENCY ? 'pending' : 'approved'
//       });

//       res.status(201).json({
//         id: user.id,
//         email: user.email,
//         role: user.role
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   login: async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ where: { email } });

//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }

//       if (user.status !== 'approved') {
//         return res.status(403).json({ message: 'Account not approved' });
//       }

//       const token = jwt.sign(
//         { id: user.id, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: '1d' }
//       );

//       res.json({
//         token,
//         user: { id: user.id, email: user.email, role: user.role }
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// };

const { AuthService } = require("../services/AuthService");
const { RESPONSE_MESSAGES } = require("../utils/constants");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const result = await AuthService.login(email, password, role);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, location, role } = req.body;
    const result = await AuthService.register(
      email,
      password,
      name,
      location,
      role
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};
