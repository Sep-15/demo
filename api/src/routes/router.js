import { Router } from "express";
import { profileController } from "../feature/user/controller.js";
import { login, register } from "../feature/auth/controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = new Router();

router.get("/health", (req, res) => res.status(200).json({ message: "ok" }));
router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/users/:userId", requireAuth, profileController);

export default router;
