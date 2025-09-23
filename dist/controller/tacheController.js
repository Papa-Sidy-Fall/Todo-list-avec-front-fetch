import { TacheService } from "../service/tacheService.js";
import { tacheValidator } from "../validator/tacheValidator.js";
const service = new TacheService();
export class TacheController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // Validation des paramètres
            if (page < 1) {
                return res.status(400).json({ message: "Le numéro de page doit être supérieur à 0" });
            }
            if (limit < 1 || limit > 100) {
                return res.status(400).json({ message: "La limite doit être entre 1 et 100" });
            }
            const data = await service.findAllPaginated(page, limit);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Fall donner niewoul" });
        }
    }
    async findById(req, res) {
        try {
            const id = Number(req.params.id);
            const data = await service.findById(id);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(500).json({ message: "fall guissoul id utilisateur bi" });
        }
    }
    async create(req, res) {
        try {
            const data = tacheValidator.parse(req.body);
            const userId = req.user.userId;
            //cela nous permet de ne pas mettre userid au niveau de postaman quand on creer une tache
            const newdata = {
                ...data,
                userId: userId,
                assignedTo: data.assignedTo || null
            };
            const tache = await service.create(newdata);
            res.status(201).json(tache);
        }
        catch (error) {
            if (error.issues) {
                res.status(400).json({ message: "Erreurs de validation", errors: error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) });
            }
            else {
                res.status(500).json({ message: "fall donner yi douguoul" });
            }
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = tacheValidator.partial().parse(req.body);
            const updatedData = await service.update(id, data);
            res.status(200).json({ success: true, task: updatedData });
        }
        catch (error) {
            if (error.issues) {
                res.status(400).json({ message: "Erreurs de validation", errors: error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) });
            }
            else {
                res.status(500).json({ message: "fall nagouwoul mise a jour bi" });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await service.delete(id);
            res.status(204).send("supprimer nako");
        }
        catch (error) {
            res.status(500).json({ message: "fall nagouwoul supprimé" });
        }
    }
    async updateStatus(req, res) {
        try {
            const id = Number(req.params.id);
            const status = req.params.status; //on le force pour qu'il soit de type etat
            const data = await service.updateStatus(id, status);
            res.status(201).json({ data, message: "le status est modifier" });
        }
        catch (error) {
            res.status(400).json({ message: "Erreur serveur" });
        }
    }
}
//# sourceMappingURL=tacheController.js.map