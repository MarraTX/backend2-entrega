export default class UserDTO {
    constructor(user) {
        // Asegúrate de que user no sea null o undefined
        if (!user) {
            throw new Error('User data is required to create a UserDTO');
        }
        this.nombre = user.first_name;
        this.apellido = user.last_name;
        this.email = user.email;
        this.rol = user.role;
        // No incluir la contraseña ni otra información sensible
    }
}
