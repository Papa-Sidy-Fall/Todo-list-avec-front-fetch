import express from "express";
import cors from "cors";
import tacheroute from "./route/tacheRoute.js";
import userRoute from "./route/userRoute.js";
import authRoute from "./route/AuthRoute.js";
import { authMiddleware } from "./middleware/Auth.js";
const app = express();
// Configuration CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static('uploads'));
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/taches", tacheroute);
app.use(authMiddleware);
app.use("/taches", tacheroute);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map