const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");

class AuthService {
  async register(userData) {
    userData.password = await bcrypt.hash(userData.password, 10);
    return await UserRepository.createUser(userData);
  }

  async login(email, password) {
    const user = await UserRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }
}

module.exports = new AuthService();
