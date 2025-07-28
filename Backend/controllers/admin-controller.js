const adminService = require('../services/admin-service');
class AdminController {
    
    async registration(req, res) {
        try {
            const { password, firstName, lastName,} = req.body;
            const adminData = await adminService.registration( password, firstName, lastName);
            return res.status(200).json({message: "Admin created", admin:adminData})
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server error" });
        }
    }

    async login(req, res) {                      
        try {
           const { password, firstName, lastName } = req.body;
           const adminData = await adminService.login(firstName, lastName, password);
           return res.json({message: "You are logged in", admin:adminData});
        } catch (err) {
           console.error(err);
           res.status(500).json({ message: "Server error" });
        }
    }

}

module.exports = new AdminController();
