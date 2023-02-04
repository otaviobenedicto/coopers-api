import express from 'express'

const router = express.Router()

import AuthController from "../controller/AuthController.js"

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/checkuser", AuthController.checkUser);
router.get("/:id", AuthController.getUserById);

export default router;
