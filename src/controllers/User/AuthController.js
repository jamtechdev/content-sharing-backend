const AuthService = require("../../services/AuthService");
const TryCatch = require("../../decorators/TryCatch");
const Router = require("../../decorators/Router");
const jwt = require("jsonwebtoken");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const NotificationService = require("../../services/NotificationService");
const SubscriptionRepository = require('../../repositories/SubscriptionRepository')

class AuthController {
  constructor() {
    this.router = new Router();
    // Using TryCatch to wrap async controller functions
    this.router.addRoute("post", "/signup", TryCatch(this.register.bind(this)));
    this.router.addRoute("post", "/login", TryCatch(this.login.bind(this)));
    this.router.addRoute(
      "post",
      "/logout",
      authenticate,
      TryCatch(this.logout.bind(this))
    );
    this.router.addRoute(
      "post",
      "/login-with-google",
      TryCatch(this.loginWithGoogle.bind(this))
    );
    this.router.addRoute(
      "post",
      "/forgot-password",
      TryCatch(this.forgotPassword.bind(this))
    );
  }
  async register(req, res) {
    const newUser = await AuthService.register(req.body);
    console.log(newUser?.role_id);
    const tokenPayload = { userId: newUser.id, role_id: newUser.role_id };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    // Set token as an HTTP-only cookie (expires in 15 days)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      path: "/",
    });
    return res.status(201).json({
      code: 201,
      message: "User created successfully",
      token,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        phone_number: newUser.phone_number,
        birthdate: newUser.birthdate,
        social: newUser.social,
        bio: newUser.bio,
        region_id: newUser.region_id,
        avatar: newUser.avatar,
        role_id: newUser.role_id,
      },
    });
  }
  /**
   * Login an existing user
   */
  async login(req, res) {
    const { email, password, device_token } = req.body;
    // AuthService.login is expected to return an object { token, user }
    const { token, user } = await AuthService.login(email, password);
    // Set token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const userData = {
      token: device_token,
      user_id: user.id,
      is_loggedin: true,
    };
    const existingUser = await NotificationService.getTokenByUser({
      user_id: user.id,
    });
    if (existingUser) {
      await NotificationService.updateToken(userData);
    } else {
      await NotificationService.addToken(userData);
    }

     const subscription = await SubscriptionRepository.getByUser(user?.id)
    // Return a structured JSON response for login
    return res.status(200).json({
      code: 200,
      message: "User logged in successfully",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        cover_photo: user.cover_photo ? user.cover_photo : null,
        region: user.region ? user.region.name : null,
        region_id: user.region_id,
        role: user.role ? user.role.name : null,
        birthdate: user.birthdate,
        address: user.address,
        phone_number: user.phone_number,
        bio: user.bio,
        guard_name: user.role ? user.role.guard_name : null,
        plan_status: user?.subscriber?.status || null,
        plan: user?.subscriber?.plan?.name || null,
        chat_count: subscription?.chat_count
      },
    });
  }
  // logout
  async logout(req, res) {
    const { userId } = req?.user;
    const data = {
      user_id: userId,
      is_loggedin: false,
    };

    await NotificationService.updateToken(data);

    res.clearCookie("token");
    return res.status(200).json({
      code: 200,
      message: "Logout successful",
    });
  }
  // Login with Google
  async loginWithGoogle(req, res) {
    const { accessToken, email, name, photoURL, region_id } = req.body;
    const { token, user } = await AuthService.loginWithGoogle({
      accessToken,
      email,
      name,
      photoURL,
      region_id,
    });

    // Set token in HTTP-only cookie (15 days)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      code: 200,
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        cover_photo: user.cover_photo ? user.cover_photo : null,
        region: user.region ? user.region.name : 1,
        region_id: user.region_id,
        role: user.role ? user.role.name : 3,
        birthdate: user.birthdate,
        address: user.address,
        phone_number: user.phone_number,
        bio: user.bio,
        guard_name: user.role ? user.role.guard_name : null,
      },
    });
  }
  // fortgot password
  async forgotPassword(req, res) {
    const { email } = req.body;
    const message = await AuthService.forgotPassword(email);
    return res.status(200).json({
      code: 200,
      message,
    });
  }
  // resetPassword
  async resetPassword(req, res) {
    const { token, email, password } = req.body;
    const message = await AuthService.resetPassword(token, email, password);
    res.status(201).json({ code: 201, success: true, message });
  }
  /**
   * Expose the configured router
   */
  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new AuthController();
