import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/roles.middleware.js';
import { signup, login, updateUserRole, logout } from '../controllers/user.controller.js';

const router = express.Router();

/**
 * @route   POST /api/users/signup
 * @desc    Register a new user (default role: viewer)
 * @access  Public
 *
 * @body
 * {
 *   "name": "Raj",
 *   "email": "raj@gmail.com",
 *   "password": "123456"
 * }
 *
 * @note
 * - Role cannot be assigned here (security)
 */
router.post("/signup", signup);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 *
 * @body
 * {
 *   "email": "raj@gmail.com",
 *   "password": "123456"
 * }
 */
router.post("/login", login);

/**
 * @route   PATCH /api/users/:id/role
 * @desc    Update a user's role (promote/demote)
 * @access  Private (Admin only)
 *
 * @headers
 * Authorization: Bearer <admin_token>
 *
 * @params
 * :id → User ID to update
 *
 * @body
 * {
 *   "role": "analyst" // allowed: viewer | analyst | admin
 * }
 *
 * @success
 * 200 OK
 * {
 *   "message": "User role updated successfully",
 *   "user": {
 *     "id": "user_id",
 *     "email": "user@example.com",
 *     "role": "analyst"
 *   }
 * }
 *
 * @errors
 * 400 → Invalid role OR trying to change own role
 * 401 → Unauthorized (no token)
 * 403 → Forbidden (not admin)
 * 404 → User not found
 */
router.patch(
  "/:id/role",
  protectRoute,
  allowRoles("admin"),
  updateUserRole
);

/**
 * @route   POST /api/users/logout
 * @desc    Logout user (clear cookie)
 * @access  Private (All roles)
 *
 * @headers
 * Authorization: Bearer <token>
 *
 * @success
 * 200 OK
 * {
 *   "message": "Logged out successfully"
 * }
 * @errors
 * 401 → Unauthorized (no token)
 */
router.post("/logout", protectRoute, logout);

export default router;
