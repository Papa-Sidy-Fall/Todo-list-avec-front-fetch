import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Initialiser Prisma
const prisma = new PrismaClient();

// Schémas de validation
const registerSchema = z.object({
  nom: z.string().min(3).max(50).regex(/^[a-zA-ZÀ-ÿ\s]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Créer l'app Express
const app = express();
app.use(cors());
app.use(express.json());

// Route d'inscription
app.post('/auth/register', async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: validation.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const { nom, email, password } = validation.data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà',
        errors: [{ field: 'email', message: 'Cet email est déjà utilisé' }]
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        nom,
        email,
        password: hashedPassword
      }
    });

    // Générer le token
    const token = jwt.sign({ userId: newUser.id }, 'secret_key', { expiresIn: '24h' });

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
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
});

// Route de connexion
app.post('/auth/login', async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: validation.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const { email, password } = validation.data;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });
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
    const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '24h' });

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
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'Serveur fonctionne correctement!' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 Test: http://localhost:${PORT}/test`);
  console.log(`🔐 Inscription: POST http://localhost:${PORT}/auth/register`);
  console.log(`🔑 Connexion: POST http://localhost:${PORT}/auth/login`);
});
