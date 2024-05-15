import type { UpdateTodoDto } from "../../dto";
import type { TodoEntity } from "../../entities/todo.entity";
import type { TodoRepository } from "../../repositories/todo.repository";


export interface UpdateTodoUseCase {
    execute(dto: UpdateTodoDto): Promise<TodoEntity>
}

export class UpdateTodo implements UpdateTodoUseCase {
    constructor(
        private readonly repository: TodoRepository,
    ) {}

    execute(dto: UpdateTodoDto): Promise<TodoEntity> {
        return this.repository.updateById(dto);
    }
}