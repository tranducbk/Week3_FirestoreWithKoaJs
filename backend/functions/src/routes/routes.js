const Router = require("koa-router");
const todoController = require("../handler/todoController");

const router = new Router({
  prefix: "/api",
});

router.get("/todos", todoController.handlerGetTodos);
router.post("/todos", todoController.handlerCreateTodo);
router.put("/todos/:id", todoController.handlerUpdateTodo);
router.delete("/todos/:id", todoController.handlerDeleteTodo);

module.exports = router;
