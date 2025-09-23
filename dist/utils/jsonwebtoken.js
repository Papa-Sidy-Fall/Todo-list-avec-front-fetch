import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
//# sourceMappingURL=jsonwebtoken.js.map