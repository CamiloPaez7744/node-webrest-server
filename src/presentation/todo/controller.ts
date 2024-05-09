import { Request, Response } from 'express';

const todos = [
    { id: 1, text: 'Buy milk', createdAt: new Date() },
    { id: 2, text: 'Buy bread', createdAt: new Date() },
    { id: 3, text: 'Buy butter', createdAt: new Date() },
];

export class TodoController {
    //* Dependency Injection
    constructor() {}

    public getTodos = (req: Request, res: Response) => {
       return res.json(todos);
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        const todo = todos.find( todo => todo.id === id );

        (todo) ? res.json(todo) : res.status(404).json({ message: `Todo with id ${id} not found` });
        
    }

    public createTodo = (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Text is required' });
        const newTodo = { 
            id: todos.length + 1, 
            text, 
            createdAt: new Date() 
        };
        todos.push(newTodo);
        return res.json(newTodo);
    }

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Text is required' });
        const todo = todos.find( todo => todo.id === id );
        if (!todo) return res.status(404).json({ message: `Todo with id ${id} not found` });
        //* mutable
        todo.text = text;
        //! reference is inmutable
        // todos.forEach( (todo, index) => {
        //     if (todo.id === id) {
        //         todos[index] = todo;
        //     }
        // });
        return res.json(todo);
    }

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        const todo = todos.find( todo => todo.id === id );
        if (!todo) return res.status(404).json({ message: `Todo with id ${id} not found` });
        todos.splice(todos.indexOf(todo), 1);
        return res.json(todo);
    }
}