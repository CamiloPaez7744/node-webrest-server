import e, { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dto';
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from '../../domain';

export class TodoController {
    //* Dependency Injection
    constructor(
        private readonly todoRepository: TodoRepository,
    ) {}

    private handledError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }

    public getTodos = (req: Request, res: Response) => {
        new GetTodos(this.todoRepository)
        .execute()
        .then(todos => res.json(todos))
        .catch(error => this.handledError(res, error));
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        
        new GetTodo(this.todoRepository)
        .execute(id)
        .then(todo => res.json(todo))
        .catch(error => this.handledError(res, error));
        
    }

    public createTodo = (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateTodo(this.todoRepository)
        .execute(createTodoDto!)
        .then(todo => res.status(201).json(todo))
        .catch(error => this.handledError(res, error));
    }

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.update({...req.body, id});

        if (error) return res.status(400).json({ error });

        new UpdateTodo( this.todoRepository)
        .execute(updateTodoDto!)
        .then(todo => res.json(todo))
        .catch(error => this.handledError(res, error));
        
    }

    //* mutable
        // todo.text = text;
        //! reference is inmutable
        // todos.forEach( (todo, index) => {
        //     if (todo.id === id) {
        //         todos[index] = todo;
        //     }
        // });

    public deleteTodo = async(req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteTodo(this.todoRepository)
        .execute(id)
        .then(todo => res.json(todo))
        .catch(error => this.handledError(res, error));
        
    }
}