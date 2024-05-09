import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dto';

export class TodoController {
    //* Dependency Injection
    constructor() {}

    public getTodos = async(req: Request, res: Response) => {
        await prisma.todo.findMany().then( todos => {
            return todos;
        }).catch( error => {
            return [];
        });
    }

    public getTodoById = async(req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        await prisma.todo.findUnique({
            where: {
                id
                }
                }).then( todo => {
                    res.json(todo)
                }
            ).catch( error => {
                res.status(404).json({ message: `Todo with id ${id} not found` });
            });
        
    }

    public createTodo = async(req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        await prisma.todo.create({
            data: createTodoDto!
        }).then( todo => {
            return res.json(todo);
        }).catch( error => {
            return res.status(500).json({ message: 'Internal server error' });
        });
    }

    public updateTodo = async(req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.update({...req.body, id});

        if (error) return res.status(400).json({ error });
       
        await prisma.todo.update({
            where: {
                id
            },
            data: updateTodoDto!.values
            }).then( todo => {
                return res.json(todo);
            }
        ).catch( error => {
            return res.status(404).json({ message: `Todo with id ${id} not found` });
        });
        //* mutable
        // todo.text = text;
        //! reference is inmutable
        // todos.forEach( (todo, index) => {
        //     if (todo.id === id) {
        //         todos[index] = todo;
        //     }
        // });
    }

    public deleteTodo = async(req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        await prisma.todo.delete({
            where: {
                id
            }
            }).then( todo => {
                return res.json(todo);
            }
        ).catch( error => {
            res.status(404).json({ message: `Todo with id ${id} not found` });
        })
    }
}