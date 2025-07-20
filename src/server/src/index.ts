import express from 'express';
import cors from 'cors';
import { db } from './db';
import { ResultSetHeader } from 'mysql2';


const app = express();
app.use(cors());
app.use(express.json());



interface Todo {
    idTask?: number;
    title: string;
    description: string;
    isDone: boolean;
}


app.get('/todos', async (req, res) => {
    let conn;
    try {
        conn = await db();
        const [result] = await conn.query('SELECT * FROM task');
        res.json(result);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (conn) {
            await conn.end();
        }
    }
});

app.get('/todo/:id', async (req, res) => {
    let conn;
    try {
        const id = parseInt(req.params.id);
        conn = await db();

        const [rows] = await conn.query('SELECT * FROM task WHERE idTask = ?', [id]);

        if ((rows as Todo[]).length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json((rows as Todo[])[0]);

    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (conn) {
            await conn.end();
        }
    }
});



app.post('/todo', async (req, res) => {
    let conn;
    try {
        const newTodo: Todo = req.body;
        conn = await db();

        // เพิ่มข้อมูลใหม่เข้า DB
        const [result] = await conn.query<ResultSetHeader>(
            'INSERT INTO task (title, description, isDone) VALUES (?, ?, ?)',
            [newTodo.title, newTodo.description, newTodo.isDone]
        );

        const insertedId = result.insertId;

        // ดึง todo ที่เพิ่งเพิ่ม
        const [rows]: any = await conn.query('SELECT * FROM task WHERE idTask = ?', [insertedId]);


        console.log('New todo added:', rows[0]);

        res.json({
            message: 'Todo added successfully',
            todo: rows[0]
        });

    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (conn) {
            await conn.end();
        }
    }
});


app.put('/todo/:id', async (req, res) => {
    let conn;
    try {
        const id = parseInt(req.params.id);
        let updatedTodo = req.body as Todo;
        conn = await db();
        const [result] = await conn.query('UPDATE task SET title = ?, description = ?, isDone = ? WHERE idTask = ?', [updatedTodo.title, updatedTodo.description, updatedTodo.isDone, id]);
        console.log('Todo updated:', updatedTodo);
        res.json({
            message: 'Todo updated successfully',
            todo: updatedTodo
        });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (conn) {
            await conn.end();
        }
    }


});

app.delete('/todo/:id', async (req, res) => {
    let conn;
    try {
        const id = parseInt(req.params.id);
        conn = await db();
        const [result] = await conn.query('DELETE FROM task WHERE idTask = ?', [id]);
        console.log('Todo deleted with id:', id);
        res.json({
            message: 'Todo deleted successfully',
            id: id
        });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    } finally {
        if (conn) {
            await conn.end();
        }
    }
});

app.listen(3000, async () => {
    try {
        await db();
    } catch (error) {
        console.error('Database connection failed:', error);
    }
    console.log('Server is running on http://localhost:3000');
});
