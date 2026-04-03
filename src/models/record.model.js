import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense']
    },
    category: String,
    date: Date,
    note: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Record = mongoose.model("record", recordSchema);
export default Record;
