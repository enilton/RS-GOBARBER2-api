import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvataService from '../services/UpdateUserAvatarService';

import ensureAutheticated from '../middlewares/ensureAuthenticated';

import uploadConfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    try{
        const { name, email, password } = request.body;
        const createUser = new CreateUserService();
        const user = await createUser.execute({ name, email, password });
        delete user.password;
        return response.json(user);
    }catch(err){
        return response.status(err.statusCode).json({ error: err.message })
    }
});

usersRouter.patch('/', ensureAutheticated, upload.single('file'), async (request, response) => {
        const updateUserAvataService = new UpdateUserAvataService();
        const user = await updateUserAvataService.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename
        });
        delete user.password;
        return response.json(user);
})

export default usersRouter;