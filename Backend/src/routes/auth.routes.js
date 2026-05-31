import {Router} from 'express';
import { validateLogin, validateRegisterUser } from '../validators/auth.validator.js';
import { login, register , } from '../controllers/auth.controllers.js';

const router = Router();

router.post("/register" ,validateRegisterUser, register)

router.post('/login',validateLogin, login)


export default router;