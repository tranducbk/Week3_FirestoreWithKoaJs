const {getAllTodos, createTodo, updateTodo, deleteTodo} = require("../database/todoRepository");

/**
 * Get all todos handler
 * @param {Object} ctx - Koa context
 * @return {Promise<void>}
 */
async function getAllTodosHandler(ctx) {
  try {
    const todos = await getAllTodos();
    ctx.body = {
      success: true,
      data: todos,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create todo handler
 * @param {Object} ctx - Koa context
 * @return {Promise<void>}
 */
async function createTodoHandler(ctx) {
  try {
    const {title} = ctx.request.body;

    const todoData = {
      title,
      completed: false,
    };

    const newTodo = await createTodo(todoData);

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: newTodo,
    };
  } catch (error) {
    console.log("Error Create", error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update todo handler
 * @param {Object} ctx - Koa context
 * @return {Promise<void>}
 */
async function updateTodoHandler(ctx) {
  try {
    const {id} = ctx.params;
    const updateData = ctx.request.body;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: "Todo ID is required",
      };
      return;
    }

    const updatedTodo = await updateTodo(id, updateData);
    ctx.body = {
      success: true,
      data: updatedTodo,
    };
  } catch (error) {
    console.log("Error Update", error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete todo handler
 * @param {Object} ctx - Koa context
 * @return {Promise<void>}
 */
async function deleteTodoHandler(ctx) {
  try {
    const {id} = ctx.params;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: "Todo ID is required",
      };
      return;
    }

    const deletedTodo = await deleteTodo(id);

    ctx.body = {
      success: true,
      message: `Todo ID ${deletedTodo}: deleted successfully`,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  getAllTodosHandler,
  createTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
};
