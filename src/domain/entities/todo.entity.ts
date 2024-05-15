


export class TodoEntity {

    constructor(
        public id: number,
        public text: string,
        public done: boolean,
        public createdAt?: Date|null
    ) {}

    get isCompleted() {
        return !!this.createdAt;
    }

    public static fromObject(object: {[key: string]: any}): TodoEntity {
        const { id, text, done, createdAt } = object;
        if (!id ) throw new Error('Invalid object properties');
        if (!text ) throw new Error('Invalid object properties');

        let newCreatedAt: Date | undefined;
        if (createdAt) {
            newCreatedAt = new Date(createdAt);
            if (isNaN(newCreatedAt.getTime())) throw new Error('Invalid date format');
        }
        return new TodoEntity(id, text, done, newCreatedAt);
    }
}