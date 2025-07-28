const Events = require("../models/event-model");
const Admin = require("../models/admin-model")
const Users = require("../models/user-model");

class UserService {

   async createUser ({ adminId, firstName, lastName, email, phoneNumber }) {
      if (!adminId || !firstName || !lastName || !email || !phoneNumber) {
         throw new Error("All fields are required");
      }
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
         throw new Error("User already exists");
      } 
      const user = await Users.create({
         firstName,
         lastName,
         email,
         phoneNumber
      });

      await Admin.findByIdAndUpdate(adminId, {$push: {users: user._id}})

      return user;
   }

   async addEvents({ userId, title, description, startDate, endDate }) {
   if (!userId || !title || !description || !startDate || !endDate) {
      throw new Error("All fields are required");
   }

   const user = await Users.findById(userId).populate('events');
   if (!user) {
      throw new Error("User not found");
   }

   const newStart = new Date(startDate);
   const newEnd = new Date(endDate);

   const hasOverlap = user.events.some((event) => {
      const existingStart = new Date(event.startDate);
      const existingEnd = new Date(event.endDate);
      return (
         (newStart >= existingStart && newStart < existingEnd) || 
         (newEnd > existingStart && newEnd <= existingEnd) ||    
         (newStart <= existingStart && newEnd >= existingEnd)    
      );
   });

   if (hasOverlap) {
      throw new Error("New event overlaps with existing events");
   }

   const event = await Events.create({
      title,
      description,
      startDate: newStart,
      endDate: newEnd
   });

   await Users.findByIdAndUpdate(userId, {
      $push: { events: event._id }
   });

   return event;
   }

   async getUsers({ adminId, page = 1, limit = 10 }) {
   if (!adminId) throw new Error("Admin ID is required");

  const skip = (page - 1) * limit;

  const admin = await Admin.findById(adminId).populate('users');
  if (!admin) throw new Error("Admin not found");

  const total = admin.users.length;

  const users = await Users.find({ _id: { $in: admin.users } })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'events',
      options: { sort: { startDate: 1 } }
    });

  const now = new Date();

  const data = users.map(user => {
    const upcomingEvents = (user.events || []).filter(
      event => new Date(event.startDate) > now
    );

    const sortedEvents = upcomingEvents.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    const nextEvent = sortedEvents[0];

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      events: user.events || [],
      nextEventDate: nextEvent
        ? new Date(nextEvent.startDate).toISOString().split('T')[0]
        : null
    };
  });

  return {
    data,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total
    }
  };
   }

   async getEvents ({ userId, page = 1, limit = 10 }) {
      if (!userId) throw new Error("User ID is required");

      const skip = (page - 1) * limit;
      const user = await Users.findById(userId).populate('events');
      if (!user) throw new Error("User not found");

      const total = user.events.length;
      const data = await Events.find({ _id: { $in: user.events } })
         .skip(skip)
         .limit(limit);

      return {
         data,
         meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total
         }
      };
   }

   async filterUsers({ adminId, firstName, lastName, email, phoneNumber }) {
  if (!adminId) throw new Error('Admin ID is required')

  const admin = await Admin.findById(adminId).populate({
    path: 'users',
    populate: { path: 'events' } // чтобы подтянуть события пользователей
  })
  if (!admin) throw new Error('Admin not found')

  let filteredUsers = admin.users

  if (firstName) {
    filteredUsers = filteredUsers.filter(user =>
      user.firstName.toLowerCase().includes(firstName.toLowerCase())
    )
  }

  if (lastName) {
    filteredUsers = filteredUsers.filter(user =>
      user.lastName.toLowerCase().includes(lastName.toLowerCase())
    )
  }

  if (email) {
    filteredUsers = filteredUsers.filter(user =>
      user.email.toLowerCase().includes(email.toLowerCase())
    )
  }

  if (phoneNumber) {
    filteredUsers = filteredUsers.filter(user =>
      user.phoneNumber.includes(phoneNumber)
    )
  }

  const now = new Date()

  const data = filteredUsers.map(user => {
    const upcomingEvents = (user.events || []).filter(
      event => new Date(event.startDate) > now
    )

    const sortedEvents = upcomingEvents.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    )

    const nextEvent = sortedEvents[0]

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      events: user.events || [],
      nextEventDate: nextEvent
        ? new Date(nextEvent.startDate).toISOString().split('T')[0]
        : null
    }
  })

  return data
}


}

module.exports = new UserService();