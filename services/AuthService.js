const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { models } = require("../models");
const { RESPONSE_MESSAGES } = require("../utils/constants");

class AuthService {
  static async login(email, password, role) {
    const user = await models.User.findOne({ where: { email, role } });

    if (!user) throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);

    if (!(await bcrypt.compare(password, user.password))) {
      console.log("password milena");
      throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }

    if (role === "agency" && user.status !== "approved") {
      throw new Error("Agency not approved");
    }

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return { success: true, token, user };
  }

  static async register(email, password, name, location, role) {
    console.log("Register input:", { email, name, location, role });

    // Input validation
    if (!email || !password || !name || !role) {
      console.log("Missing required fields");
      throw new Error("Missing required fields");
    }

    // Role validation
    const validRoles = ["user", "agency", "admin"];
    if (!validRoles.includes(role)) {
      console.log("Invalid role:", role);
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Creating user with hashed password");

      const user = await models.User.create({
        email,
        password: hashedPassword,
        name,
        location: role === "agency" ? location : null,
        role,
        status: role === "agency" ? "pending" : "approved",
      });

      console.log("User created successfully:", user.id);
      return { success: true, id: user.id };
    } catch (err) {
      console.error("Registration error:", err);
      if (err.name === "SequelizeUniqueConstraintError") {
        throw new Error("Email already exists");
      } else if (err.name === "SequelizeValidationError") {
        const messages = err.errors.map((e) => e.message).join(", ");
        throw new Error(`Validation error: ${messages}`);
      } else {
        throw new Error(err.message || "Registration failed");
      }
    }
  }
}

module.exports = { AuthService };
