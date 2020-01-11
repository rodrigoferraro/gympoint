import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import CheckinController from './app/controllers/CheckinController';
import OptionController from './app/controllers/OptionController';
import MembershipController from './app/controllers/MembershipController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/:student_id/checkins', CheckinController.store);

routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.post('/options', OptionController.store);
routes.get('/options', OptionController.index);
routes.put('/options/:id', OptionController.update);
routes.delete('/options/:id', OptionController.delete);

routes.post(
  '/students/:student_id/options/:option_id/membership',
  MembershipController.store
);
routes.get('/students/:student_id/membership', MembershipController.index);
routes.put('/students/:student_id/membership', MembershipController.update);
routes.delete('/students/:student_id/membership', MembershipController.delete);

export default routes;
