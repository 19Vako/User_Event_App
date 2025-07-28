const UserService = require('../services/user-cervice')

class UserController{
   
   async createUser(req, res ){
      try {
        const {adminId, firstName, lastName, email, phoneNumber  } = req.body;

        const user = await UserService.createUser({ adminId, firstName, lastName, email, phoneNumber });
        return res.status(201).json({ message: "User created successfully", user });

      } catch (err) {
         console.error(err);
         res.status(500).json({ message: "Server error" });
      }
   }
   async addEvent(req, res) {
   try {
      const { userId, title, description, startDate, endDate } = req.body;

      const event = await UserService.addEvents({
         userId,
         title,
         description,
         startDate,
         endDate
      });

      return res.status(201).json({
         message: "Event added successfully",
         data: {
            id: event._id,
            title: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            createdAt: event.createdAt
         }
      });
      } catch (err) {
      console.error(err);

      const statusCode = err.message === "New event overlaps with existing events" ||
                         err.message === "All fields are required" ||
                         err.message === "User not found"
         ? 400
         : 500;

      return res.status(statusCode).json({
         message: err.message || "Server error"
      });
   }
   }

   async filterUsers(req, res) {
    try {
      const { adminId, firstName, lastName, email, phoneNumber } = req.body
      const users = await UserService.filterUsers({ adminId, firstName, lastName, email, phoneNumber })

      res.status(200).json({ users })
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
   }

   async getUsers(req, res) {
      try {
         const { adminId, page, limit } = req.body;

      if (!adminId) {
         return res.status(400).json({ message: "Admin ID is required" });
      }

      const result = await UserService.getUsers({ adminId, page, limit });

      return res
         .status(200)
         .json({ message: "Users retrieved successfully", ...result });
      } catch (err) {
         console.error(err);
         const status = err.message === "Admin ID is required" ? 400 : 500;
         res.status(status).json({ message: err.message || "Server error" });
      }
   }
   async getEvents(req, res){
      try {
         const { userId, page, limit } = req.body || {};
       if (!userId) {
         return res.status(400).json({ message: "User ID is required" });
      }

      const result = await UserService.getEvents({ userId, page, limit });

      return res
         .status(200)
         .json({ message: "Events retrieved successfully", ...result });
      } catch (err) {
         console.error(err);
         const status = err.message === "User ID is required" ? 400 : 500;
         res.status(status).json({ message: err.message || "Server error" });
      }
   }

}

module.exports = new UserController();