import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/checkOrigin', controller.home.checkOrigin);
  router.get('/token', controller.home.token);
  router.get('/ticket', controller.home.ticket);
  router.post('/signature', controller.home.signature);
};
