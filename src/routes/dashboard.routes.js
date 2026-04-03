import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roles.middleware.js";
import { getSummary } from "../controllers/dashboard.controller.js";

const router = express.Router();

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get financial dashboard summary (totals, category breakdown, recent transactions)
 * @access  Private (All roles: viewer, analyst, admin)
 *
 * @headers
 * Authorization: Bearer <token>
 *
 * @response
 * 200 OK
 * {
 *   "summary": {
 *     "totalIncome": 50000,
 *     "totalExpense": 20000,
 *     "balance": 30000
 *   },
 *   "categoryBreakdown": [
 *     { "_id": "salary", "total": 40000 },
 *     { "_id": "food", "total": 10000 }
 *   ],
 *   "monthlyTrends": [
 *       {
 *           "_id": 1,
 *           "total": 10000
 *       }
 *   ],
 *   "recentTransactions": [
 *     {
 *       "_id": "record_id",
 *       "amount": 500,
 *       "type": "expense",
 *       "category": "food",
 *       "date": "2024-01-10"
 *     }
 *   ]
 * }
 *
 * @errors
 * 401 → Unauthorized (no token)
 * 403 → Forbidden (invalid role)
 * 500 → Server error
 *
 * @notes
 * - Uses MongoDB aggregation for totals and category breakdown
 * - Returns latest 5 transactions sorted by date
 * - Designed for direct frontend dashboard consumption
 */
router.get(
    "/summary",
    protectRoute,
    allowRoles("viewer", "analyst", "admin"),
    getSummary
);

export default router;
