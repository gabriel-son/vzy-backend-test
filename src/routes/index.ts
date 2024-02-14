import express from "express";
import { BearerAuth, authenticateAccessToken } from "@middlewares/authentication";
import authRouter from "./auth";
const router = express.Router();

router.use("/auth", authRouter);

const RestAuth = BearerAuth({
	strategy: authenticateAccessToken,
	excludedPaths: {
		post: [/^\/auth(\/?)/],
	},
});

export default router;
