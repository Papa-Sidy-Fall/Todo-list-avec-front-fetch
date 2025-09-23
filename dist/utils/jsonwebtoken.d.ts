import jwt from "jsonwebtoken";
export declare const generateAccessToken: (userId: number) => string;
export declare const verifyAccessToken: (token: string) => string | jwt.JwtPayload;
//# sourceMappingURL=jsonwebtoken.d.ts.map