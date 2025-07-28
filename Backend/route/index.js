const Router = require("express").Router;
const AdminController = require("../controllers/admin-controller");
const UserController = require("../controllers/user-controller");
require("dotenv").config({ path: '../.env'});

const env = process.env;
const router = new Router();


router.post(env.REGISTRATION, AdminController.registration);
router.post(env.LOG_IN, AdminController.login);

router.post(env.GET_USER , UserController.getUsers);
router.post(env.FILTER_USERS, UserController.filterUsers);
router.post(env.GET_EVENTS, UserController.getEvents);
router.post(env.CREATE_USER, UserController.createUser);
router.post(env.ADD_EVENT, UserController.addEvent);


module.exports = router