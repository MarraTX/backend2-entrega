import User from '../models/user.model.js';

class UserDAO {
    async getAll() {
        try {
            return await User.find().lean(); // Use .lean() for plain JS objects
        } catch (error) {
            throw new Error(`Error getting all users: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await User.findById(id).lean();
        } catch (error) {
            throw new Error(`Error getting user by ID ${id}: ${error.message}`);
        }
    }

    async getByEmail(email) {
        try {
            return await User.findOne({ email }).lean();
        } catch (error) {
            throw new Error(`Error getting user by email ${email}: ${error.message}`);
        }
    }

    async create(userData) {
        try {
            // Password hashing should be handled by a pre-save hook in the model or in the service layer
            const newUser = new User(userData);
            return await newUser.save();
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async update(id, userData) {
        try {
            return await User.findByIdAndUpdate(id, userData, { new: true }).lean();
        } catch (error) {
            throw new Error(`Error updating user ${id}: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await User.findByIdAndDelete(id).lean();
        } catch (error) {
            throw new Error(`Error deleting user ${id}: ${error.message}`);
        }
    }

    // You might want to add a method to get the user with the cart populated
    async getByIdWithCart(id) {
        try {
            return await User.findById(id).populate('cart').lean();
        } catch (error) {
            throw new Error(`Error getting user by ID ${id} with cart: ${error.message}`);
        }
    }
}

export default new UserDAO(); // Export an instance
