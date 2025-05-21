import UserDAO from '../dao/UserDAO.js';
import UserDTO from '../dto/user.dto.js';

class UserRepository {
    constructor() {
        this.userDAO = UserDAO; // Using the exported instance
    }

    async getAllUsers() {
        const users = await this.userDAO.getAll();
        return users.map(user => new UserDTO(user));
    }

    async getUserById(id) {
        const user = await this.userDAO.getById(id);
        return user ? new UserDTO(user) : null;
    }

    async getUserByEmail(email) {
        const user = await this.userDAO.getByEmail(email);
        return user ? new UserDTO(user) : null;
    }

    // For operations like create, update, delete, we might not need DTO transformation here
    // or the DTO might be used by the service/controller layer before calling the repository.
    // The DAO handles the direct database interaction.

    async createUser(userData) {
        // Password hashing should ideally be handled before this point (e.g., in a service layer or model pre-save hook)
        // For now, assuming userData comes with a hashed password or the model handles it.
        return await this.userDAO.create(userData);
    }

    async updateUser(id, userData) {
        return await this.userDAO.update(id, userData);
    }

    async deleteUser(id) {
        return await this.userDAO.delete(id);
    }

    // Method to get the raw user object, e.g., for authentication where you need the password
    async getRawUserByEmail(email) {
        return await this.userDAO.getByEmail(email); // DAO returns plain object or Mongoose doc
    }

    async getRawUserById(id) {
        return await this.userDAO.getById(id);
    }

    async getUserByIdWithCart(id) {
        const user = await this.userDAO.getByIdWithCart(id);
        // Decide if you want to DTO the user part of this response
        // For now, let's assume the DTO is for general user info, not necessarily the populated cart details
        return user; // Or new UserDTO(user) if cart details are not sensitive or handled elsewhere
    }
}

export default new UserRepository();
