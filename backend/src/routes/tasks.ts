import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { taskCreateSchema, taskUpdateSchema } from '../validation/schemas';
import * as controller from '../controllers/tasksController';

const router = Router();
router.use(authMiddleware);

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', validate(taskCreateSchema), controller.create);
router.put('/:id', validate(taskUpdateSchema), controller.update);
router.delete('/:id', controller.remove);

export default router;
