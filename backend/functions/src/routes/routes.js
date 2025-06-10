const Router = require("koa-router");
const todoHandler = require("../handler/todoHandler");

const router = new Router({
  prefix: "/api",
});

router.get("/todos", todoHandler.getAllTodosHandler);
router.post("/todos", todoHandler.createTodoHandler);
router.put("/todos/:id", todoHandler.updateTodoHandler);
router.delete("/todos/:id", todoHandler.deleteTodoHandler);

module.exports = router;
