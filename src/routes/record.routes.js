import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roles.middleware.js";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} from "../controllers/record.controller.js";

const router = express.Router();

/**
 * @route   POST /api/records
 * @desc    Create a new financial record
 * @access  Private (Admin only)
 *
 * @headers
 * Authorization: Bearer <admin_token>
 *
 * @body
 * {
 *   "amount": 1000,
 *   "type": "income",      // income | expense
 *   "category": "salary",
 *   "date": "2024-01-10",
 *   "note": "Monthly salary"
 * }
 *
 * @success
 * 201 Created
 * {
 *   "message": "Record created successfully",
 *   "record": { ... }
 * }
 *
 * @errors
 * 400 → Missing required fields
 * 401 → Unauthorized
 * 403 → Forbidden (not admin)
 */
router.post(
  "/",
  protectRoute,
  allowRoles("admin"),
  createRecord
);

/**
 * @route   GET /api/records
 * @desc    Get all records with filtering, sorting, and pagination
 * @access  Private (Admin, Analyst)
 *
 * @headers
 * Authorization: Bearer <token>
 *
 * @query
 * ?type=income                → Filter by type
 * ?category=food              → Filter by category
 * ?startDate=2024-01-01       → Filter from date
 * ?endDate=2024-12-31         → Filter to date
 * ?page=1                     → Page number (optional)
 * ?limit=10                   → Records per page (optional)
 *
 * @success
 * 200 OK
 * {
 *   "count": 10,
 *   "records": [ ... ]
 * }
 *
 * @errors
 * 401 → Unauthorized
 * 403 → Forbidden
 *
 * @notes
 * - Supports dynamic filtering using query params
 * - Results are sorted by date (latest first)
 */
router.get(
  "/",
  protectRoute,
  allowRoles("admin", "analyst"),
  getRecords
);

/**
 * @route   PATCH /api/records/:id
 * @desc    Update a financial record
 * @access  Private (Admin only)
 *
 * @headers
 * Authorization: Bearer <admin_token>
 *
 * @params
 * :id → Record ID
 *
 * @body (any fields to update)
 * {
 *   "amount": 1200,
 *   "category": "freelance"
 * }
 *
 * @success
 * 200 OK
 * {
 *   "message": "Record updated successfully",
 *   "record": { ... }
 * }
 *
 * @errors
 * 404 → Record not found
 * 401 → Unauthorized
 * 403 → Forbidden
 */
router.patch(
  "/:id",
  protectRoute,
  allowRoles("admin"),
  updateRecord
);

/**
 * @route   DELETE /api/records/:id
 * @desc    Delete a financial record
 * @access  Private (Admin only)
 *
 * @headers
 * Authorization: Bearer <admin_token>
 *
 * @params
 * :id → Record ID
 *
 * @success
 * 200 OK
 * {
 *   "message": "Record deleted successfully"
 * }
 *
 * @errors
 * 404 → Record not found
 * 401 → Unauthorized
 * 403 → Forbidden
 */
router.delete(
  "/:id",
  protectRoute,
  allowRoles("admin"),
  deleteRecord
);

export default router;
