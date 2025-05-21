import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: () => uuidv4()
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: 'purchase_datetime', updatedAt: 'updated_at' } });

const ticketSchemaRefined = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: () => uuidv4()
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
}, { 
    timestamps: { createdAt: 'purchase_datetime', updatedAt: 'updated_at' } 
});

const Ticket = mongoose.model('Ticket', ticketSchemaRefined);

export default Ticket;
