import e, { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dto';
import { TodoRepository } from '../../domain';

export class TodoController {
    //* Dependency Injection
    constructor(
        private readonly todoRepository: TodoRepository,
    ) {}

    public getTodos = async(req: Request, res: Response) => {
        const todos = await this.todoRepository.getAll();
        res.json(todos);
    }

    public getTodoById = async(req: Request, res: Response) => {
        const id = +req.params.id;
        
        try {
            const todo = await this.todoRepository.getById(id);
            return res.json(todo);
        } catch (error) {
            res.status(404).json({ error });
        }
        
    }

    public createTodo = async(req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        const todo = await this.todoRepository.create(createTodoDto!);
        res.json(todo);
    }

    public updateTodo = async(req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.update({...req.body, id});

        if (error) return res.status(400).json({ error });
       
        const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);
        return res.json(updatedTodo);
        
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

        try {
            const deletedTodo = await this.todoRepository.deleteById(id);
            return res.json(deletedTodo);
        } catch (error) {
            res.status(404).json({ error });
        }
        
    }
}