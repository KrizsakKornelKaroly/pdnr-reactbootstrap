import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

interface Todo {
    id: number;
    task: string;
    completed: boolean;
}
const app = express();
app.use(bodyParser.json());
let todos: Todo[] = [
    {id: 1, task: "Take out trash", completed: false},
    {id: 2, task: "Do laundry", completed: true}
];
app.get("/", (req: Request, res: Response) => {
 res.send("Hello World");
});

app.get('/todos', (req: Request, res: Response) => {
    res.send(todos);
});
app.post('/todos', (req: Request, res: Response) => {
    const newTodo: Todo = req.body;
    todos.push(newTodo);
    res.send(newTodo);
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});