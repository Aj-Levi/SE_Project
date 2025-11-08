import express from 'express'
import { gettop5, register } from '../controller/user.controller.js';
import { login } from "../controller/user.controller.js";
import { logout } from "../controller/user.controller.js";

const router=express.Router()
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/top10').get(gettop5)


export default router