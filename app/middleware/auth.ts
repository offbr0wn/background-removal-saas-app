import { bearerAuth } from "hono/bearer-auth";

const API_TOKEN = "485b3e54f57b495890069d570b3b3e8f";

export const authMiddleware = bearerAuth({ token: API_TOKEN });
