import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Using uuid for unique code generation

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: () => uuidv4() // Autogenerate a unique code
    },
    purchase_datetime: {
        type: Date,
        default: Date.now // Set to current date and time by default
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String, // Email of the user
        required: true
    },
    // You might want to store details of the products purchased in the ticket as well
    // For example:
    // products: [{
    //     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    //     quantity: Number,
    //     price: Number // Price at the time of purchase
    // }]
}, { timestamps: { createdAt: 'purchase_datetime', updatedAt: 'updated_at' } }); // Using timestamps for purchase_datetime

// If you prefer purchase_datetime to be exactly when the document is created and not rely on default:
// Mongoose's timestamps: { createdAt: 'purchase_datetime' } will automatically manage this field.
// The default: Date.now on purchase_datetime field is redundant if using timestamps like this, but harmless.
// Let's refine to use timestamps for createdAt as purchase_datetime directly.

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
        type: String, // Email of the user
        required: true
    }
    // Consider adding purchased items details here if needed for historical records
    // products_purchased: [{ productId: String, title: String, quantity: Number, unit_price: Number }]
}, { 
    timestamps: { createdAt: 'purchase_datetime', updatedAt: 'updated_at' } 
});

const Ticket = mongoose.model('Ticket', ticketSchemaRefined);

export default Ticket;
