import { UserService } from "../service/userService.js"
import type {Request, Response} from "express"
import bcrypt from "bcrypt"
import { generateAccessToken } from "../utils/jsonwebtoken.js";
import { validateRegisterData, validateLoginData } from "../validator/userValidator.js";
const service = new UserService()
export class AuthController {

   static async login(req: Request<{}, {}, { email: string; password: string }>, res: Response) {
    try {
        // Validation des données d'entrée
        const validation = validateLoginData(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: 'Erreurs de validation',
                errors: validation.errors
            });
        }

        const { email, password } = validation.data!;

        // Vérifier si l'utilisateur existe
        const user = await service.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect',
                errors: [{ field: 'general', message: 'Email ou mot de passe incorrect' }]
            });
        }

        // Vérifier le mot de passe
        const passwordValide = await bcrypt.compare(password, user.password);
        if (!passwordValide) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect',
                errors: [{ field: 'general', message: 'Email ou mot de passe incorrect' }]
            });
        }

        // Générer le token
        const token = generateAccessToken(user.id);

        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la connexion'
        });
    }
   }

   static async register(req: Request<{}, {}, { nom: string; email: string; password: string; confirmPassword: string }>, res: Response) {
    try {
        // Validation des données
        const validation = validateRegisterData(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: 'Erreurs de validation',
                errors: validation.errors
            });
        }

        const { nom, email, password } = validation.data!;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await service.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà',
                errors: [{ field: 'email', message: 'Cet email est déjà utilisé' }]
            });
        }

        // Hacher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer l'utilisateur
        const newUser = await service.create({
            nom,
            email,
            password: hashedPassword
        });

        // Générer le token
        const token = generateAccessToken(newUser.id);

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            token,
            user: {
                id: newUser.id,
                nom: newUser.nom,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de l\'inscription'
        });
    }
   }
}
