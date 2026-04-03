import Record from "../models/record.model.js";

/**
 * Create Financial Record
 * Access: Admin only
 */
export const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, note } = req.body;

        if (!amount || !type || !category) {
            return res.status(400).json({
                message: "Amount, type and category are required"
            });
        }

        const record = await Record.create({
            amount,
            type,
            category,
            date,
            note,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Record created successfully",
            record
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get Records with Filters
 * Access: Admin, Analyst
 */
export const getRecords = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;

        let filter = {};

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }

            if (endDate) {
                filter.date.$lte = new Date(endDate);
            }
        }

        const records = await Record.find(filter)
            .sort({ date: -1 });

        res.status(200).json({
            count: records.length,
            records
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update Record
 * Access: Admin only
 */
export const updateRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                message: "Record not found"
            });
        }

        Object.assign(record, req.body);

        await record.save();

        res.status(200).json({
            message: "Record updated successfully",
            record
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete Record
 * Access: Admin only
 */
export const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                message: "Record not found"
            });
        }

        await record.deleteOne();

        res.status(200).json({
        message: "Record deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
