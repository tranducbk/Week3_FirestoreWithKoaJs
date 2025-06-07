const admin = require("firebase-admin");
const db = admin.firestore();
const todoRef = db.collection("todo");

async function getAllTodos() {
  const snapshot = await todoRef.get();
  const todos = [];
  snapshot.forEach((doc) => {
    todos.push({id: doc.id, ...doc.data()});
  });
  return todos;
}

async function createTodo(data) {
  const docRef = await todoRef.add(data);
  return {id: docRef.id, ...data};
}

async function updateTodo(id, data) {
  const todoRef = db.collection("todo").doc(id);
  await todoRef.update(data);
  return {id, ...data};
}

async function deleteTodo(id) {
  const todoRef = db.collection("todo").doc(id);
  await todoRef.delete();
  return {id};
}

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
