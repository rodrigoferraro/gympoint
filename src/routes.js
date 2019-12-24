import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res)=>{
  return res.json({ message: 'Oilà Mondo! App responding on :3333 ok.'})
})
export default routes;