const Router = require('koa-router');
const todoController = require('../controller/todoController');

const router = new Router({
    prefix: "/api",
  });

router.get('/todos', todoController.getTodos);
router.post('/todos', todoController.createTodo);
router.put('/todos/:id', todoController.updateTodo);
router.delete('/todos/:id', todoController.deleteTodo);

module.exports = router; 