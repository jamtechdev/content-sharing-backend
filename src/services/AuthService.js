// services/AuthService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const passwordRegex = require("../_helper/passwordRegex");
const HttpError = require("../decorators/HttpError");
const { forgotPasswordTemplate } = require("../utils/EmailTemplates");
const mailToSpecificUser = require("../utils/mailToSpecificUser");

class AuthService {
  async register(userData) {
    const { name, email, password } = userData;
    if (!name || !email || !password) {
      throw new HttpError(400, "All fields are required");
    }
    // Enforce password complexity using the shared regex
    if (!passwordRegex.test(userData?.password)) {
      throw new HttpError(
        400,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
    }
    // Check if a user with the same email already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new HttpError(409, "User already exists");
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.create({
      ...userData,
      region_id: 1,
      password: hashedPassword,
    });
    return newUser;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new HttpError(400, "Email and password are required");
    }
    const user = await UserRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpError(401, "Invalid credentials");
    }

    // Generate token with a 15-day expiration
    const tokenPayload = { userId: user.id, role: user.role?.name };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    return { token, user };
  }

  async loginWithGoogle({ accessToken, email, name, photoURL,region_id }) {
    // Try to find an existing user by email
    let user = await UserRepository.findByEmail(email);
    if (user) {
      // If user exists, generate a token
      const token = jwt.sign(
        { userId: user.id, role_id: user.role_id },
        process.env.JWT_SECRET,
        {
          expiresIn: "15d",
        }
      );
      return { token, user };
    } else {
      // Otherwise, create a new user.
      // Hash a default password ("Password@123#") for the new user.
      const defaultPassword = await bcrypt.hash("Password@123#", 10);
      const newUser = await UserRepository.create({
        email,
        name,
        avatar: photoURL,
        access_token: accessToken,
        role_id: 3, // default role for Google sign-in users
        password: defaultPassword,
        platform_type: "google",
        region_id: 1, // default region
      });
      const token = jwt.sign(
        { userId: newUser.id, role_id: newUser.role_id },
        process.env.JWT_SECRET,
        {
          expiresIn: "15d",
        }
      );
      return { token, user: newUser };
    }
  }
  async forgotPassword(email) {
    // Find the user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // Prepare payload and generate a reset token (expires in 5 minutes)
    const payload = { id: user.id, email: user.email };
    const resetToken = jwt.sign(
      payload,
      process.env.RESET_PASSWORD_SECRET_KEY,
      {
        expiresIn: "5m",
      }
    );

    // Construct email subject and HTML content
    const subject = `Password reset mail to: ${user.email}`;
    const content = forgotPasswordTemplate(user, resetToken);

    // Send the email (make sure mailToSpecificUser returns a Promise)
    await mailToSpecificUser(user.email, subject, content);
    return "Password reset link sent to your email";
  }
  async resetPassword(token, email, password) {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new HttpError(400, "Reset token has expired");
      }
      throw new HttpError(500, error.message);
    }

    // Find the user by decoded id and email, including the associated role
    let user = await UserRepository.resetPassword(decoded.id, email);
    // Validate the new password against your regex
    if (!passwordRegex.test(password)) {
      throw new HttpError(
        400,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
    }

    // Hash the new password and update the user record
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    await UserRepository.updatePassword(user.id, hashedPassword, email);
    // { password: hashedPassword },
    // { where: { id: user.id, email: user.email } }
    // );

    return "User's password updated successfully";
  }
}

module.exports = new AuthService();
