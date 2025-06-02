    const { log } = require('console');
    const admin = require('firebase-admin');
    const db = admin.firestore();
    const todoRef = db.collection('todo');

    const todoController = {
        async getTodos(ctx) {
            try {
                const snapshot = await todoRef.get();
                const todos = [];
                snapshot.forEach(doc => {
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                ctx.body = {
                    success: true,
                    data: todos
                };
            } catch (error) {
                ctx.status = 500;
                ctx.body = { 
                    success: false,
                    error: error.message 
                };
            }
        },

        async createTodo(ctx) {
            try {
                console.log('Body Create' ,ctx.request.body);
                const { title } = ctx.request.body;
                console.log(title);
                if (!title) {
                    ctx.status = 400;
                    ctx.body = {
                        success: false,
                        error: 'Title is required'
                    };
                    return;
                }

                const snapshot = await todoRef.get();
                let maxId = 0;
                snapshot.forEach(doc => {
                    const id = parseInt(doc.id);
                    if (!isNaN(id) && id > maxId) {
                        maxId = id;
                    }
                });

                const newId = (maxId + 1).toString();

                const newTodo = {
                    title,
                    completed: false,
                };
                
                await todoRef.doc(newId).set(newTodo);

                ctx.status = 201;
                ctx.body = {
                    success: true,
                    data: {
                        id: newId,
                        ...newTodo
                    }
                };
            } catch (error) {
                console.log('Error Create' ,error);
                ctx.status = 500;
                ctx.body = { 
                    success: false,
                    error: error.message 
                };
            }
        },

        async updateTodo(ctx) {
            try {
                console.log('Body Update' ,ctx.request.body);
                const { id } = ctx.params;
                const updateData = ctx.request.body;
                
                if (!id) {
                    ctx.status = 400;
                    ctx.body = {
                        success: false,
                        error: 'Todo ID is required'
                    };
                    return;
                }

                const todoRef = db.collection('todo').doc(id);
                const todoDoc = await todoRef.get();

                if (!todoDoc.exists) {
                    ctx.status = 404;
                    ctx.body = {
                        success: false,
                        error: 'Todo not found'
                    };
                    return;
                }

                await todoRef.update({
                    ...updateData,
                });

                const updatedDoc = await todoRef.get();
                
                ctx.body = {
                    success: true,
                    data: {
                        id: updatedDoc.id,
                        ...updatedDoc.data()
                    }
                };
            } catch (error) {
                console.log('Error Update' ,error);
                ctx.status = 500;
                ctx.body = { 
                    success: false,
                    error: error.message 
                };
            }
        },

        async deleteTodo(ctx) {
            try {
                const { id } = ctx.params;
                
                if (!id) {
                    ctx.status = 400;
                    ctx.body = {
                        success: false,
                        error: 'Todo ID is required'
                    };
                    return;
                }

                const todoRef = db.collection('todo').doc(id);
                const todoDoc = await todoRef.get();

                if (!todoDoc.exists) {
                    ctx.status = 404;
                    ctx.body = {
                        success: false,
                        error: 'Todo not found'
                    };
                    return;
                }

                await todoRef.delete();
                
                ctx.body = {
                    success: true,
                    message: 'Todo deleted successfully'
                };
            } catch (error) {
                ctx.status = 500;
                ctx.body = { 
                    success: false,
                    error: error.message 
                };
            }
        }
    };

    module.exports = todoController;
