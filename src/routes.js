import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import CheckinController from './app/controllers/CheckinController';
import OptionController from './app/controllers/OptionController';
import MembershipController from './app/controllers/MembershipController';
import Help_orderController from './app/controllers/Help_orderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

/**
 * Session
 */
routes.post('/sessions', SessionController.store);

/**
 * Checkin
 */
routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/:student_id/checkins', CheckinController.store);

/**
 * Help_order --> Student can ask for help without authentication
 */
routes.post('/students/:student_id/help_orders', Help_orderController.store);
routes.put(
  '/students/:student_id/help_orders/:help_orders',
  Help_orderController.update
);

/**
 * Routes under AUTHENTICATION
 */
routes.use(authMiddleware);

/**
 * Student
 */
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

/**
 * Options
 */
routes.post('/options', OptionController.store);
routes.get('/options', OptionController.index);
routes.put('/options/:id', OptionController.update);
routes.delete('/options/:id', OptionController.delete);

/**
 * Membership
 */
routes.get('/memberships', MembershipController.index);
routes.post(
  '/students/:student_id/options/:option_id/membership',
  MembershipController.store
);
routes.put(
  '/students/:student_id/options/:option_id/membership',
  MembershipController.update
);
routes.delete('/memberships/:membership_id', MembershipController.delete);

/**
 * Help_order
 */
routes.get('/help_orders/unanswered', Help_orderController.unanswered);
routes.get('/students/:student_id/help_orders', Help_orderController.index);
/* routes.delete('/students/:student_id/help_orders/:help_order_id', Help_orderController.delete);
 */
routes.put('/help-orders/:help_order_id/answer', Help_orderController.answer);

export default routes;
