import UserDAO from '../dao/UserDAO.js';
import UserDTO from '../dto/user.dto.js';

class UserRepository {
    constructor() {
        this.userDAO = UserDAO;
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

    async createUser(userData) {
        return await this.userDAO.create(userData);
    }

    async updateUser(id, userData) {
        return await this.userDAO.update(id, userData);
    }

    async deleteUser(id) {
        return await this.userDAO.delete(id);
    }

    async getRawUserByEmail(email) {
        return await this.userDAO.getByEmail(email);
    }

    async getRawUserById(id) {
        return await this.userDAO.getById(id);
    }

    async getUserByIdWithCart(id) {
        const user = await this.userDAO.getByIdWithCart(id);
        return user;
    }
}

export default new UserRepository();
