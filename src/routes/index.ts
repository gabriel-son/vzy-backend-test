import express from "express";
import { BearerAuth, authenticateAccessToken } from "@middlewares/authentication";

const router = express.Router();

export const RestAuth = BearerAuth({
	strategy: authenticateAccessToken,
	excludedPaths: {
		all: [],
		post: [],
		get: [],
	},
});

export default router;
