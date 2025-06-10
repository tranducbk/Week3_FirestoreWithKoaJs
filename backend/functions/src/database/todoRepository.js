const admin = require('firebase-admin');
const db = admin.firestore();
const todoRef = db.collection('todo');

/**
 * @description Get all todos
 * @returns {Array} - Array of todos
 */
async function getAllTodos() {
    const snapshot = await todoRef.get();
    const todos = [];
    snapshot.forEach(doc => {
        todos.push({ id: doc.id, ...doc.data() });
    });
    return todos;
}

/**
 * @description Create a new todo
 * @param {Object: {
 *  title: string,
 *  completed: boolean
 * }} data - Todo data
 * @returns {Object: {
 *  id: string,
 *  title: string,
 *  completed: boolean
 * }} - Todo object
 */
async function createTodo(data) {
    const docRef = await todoRef.add(data);
    return { id: docRef.id, ...data };
}

/**
 * @description Update a todo
 * @param {string} id - Todo id
 * @param {Object: {
 *  title: string,
 *  completed: boolean
 * }} data - Todo data
 * @returns {Object: {
 *  id: string,
 *  title: string,
 *  completed: boolean
 * }} - Todo object
 */
async function updateTodo(id, data) {
    const todoRef = db.collection('todo').doc(id);
    await todoRef.update(data);
    return { id, ...data };
}

/**
 * @description Delete a todo
 * @param {string} id - Todo id
 * @returns {Object: {
 *  id: string
 * }} - Todo object
 */
async function deleteTodo(id) {
    const todoRef = db.collection('todo').doc(id);
    await todoRef.delete();
    return { id };
}

module.exports = {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo
}