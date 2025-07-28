const Admin = require('../models/admin-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid')


class AdminService {
    
    async registration(password, firstName, lastName) {
        if (!password || !firstName || !lastName) {
            throw new Error("All fields are required");
        }

        const existingAdmin = await Admin.findOne({ firstName: firstName });
        if (existingAdmin) {
            throw new Error("Admin already exists");
        }
        const activationLink = uuid.v4();
        const admin = await Admin.create({
            password: await bcrypt.hash(password, 10),
            activationLink,
            firstName,
            lastName,
        });
        return admin;

    }
    async login(firstName, lastName, password) {
        if (!firstName || !lastName || !password) {
            throw new Error("All fields are required");
        }

        const admin = await Admin.findOne({ firstName: firstName, lastName: lastName });
        if (!admin) {
            throw new Error("Admin not found");
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        return admin;
    }

    
}

module.exports = new AdminService();
