import { userRepositorie } from "../repositorie/userRepositorie.js";
const repo = new userRepositorie();
export class UserService {
    async findAll() {
        return await repo.findAll();
    }
    async findById(id) {
        return await repo.findById(id);
    }
    async create(data) {
        return await repo.create(data);
    }
    async findByEmail(email) {
        return await repo.findByEmail(email);
    }
}
//# sourceMappingURL=userService.js.map