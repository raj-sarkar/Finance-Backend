import Record from "../models/record.model.js";

/**
 * Get Dashboard Summary
 * Access: All roles (viewer, analyst, admin)
 */
export const getSummary = async (req, res) => {
    try {

        const totals = await Record.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let income = 0;
        let expense = 0;

        totals.forEach(item => {
            if (item._id === "income") income = item.total;
            if (item._id === "expense") expense = item.total;
        });

        const balance = income - expense;

        const categoryData = await Record.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        const monthly = await Record.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        const recent = await Record.find()
            .sort({ date: -1 })
            .limit(5);

        res.status(200).json({
            summary: {
                totalIncome: income,
                totalExpense: expense,
                balance
            },
            categoryBreakdown: categoryData,
            monthlyTrends: monthly,
            recentTransactions: recent
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
