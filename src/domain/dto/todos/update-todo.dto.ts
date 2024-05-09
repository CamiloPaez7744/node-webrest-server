


export class UpdateTodoDto {
    constructor(
        public readonly id: number,
        public readonly text?: string,
        public readonly done?: boolean,
        public readonly createdAt?: Date
    ) {}

    get values() {
        const returnObject: {[key: string]: any} = {};

        if (this.text) returnObject.text = this.text;
        if (this.done) returnObject.done = this.done;
        if (this.createdAt) returnObject.createdAt = this.createdAt;

        return returnObject;
    }

    static update(props: {[key: string]: any}): [string?, UpdateTodoDto?] {
        
        const { id, text, done, createdAt } = props;
        let newCreatedAt: Date | undefined;

        if (!id || isNaN(Number(id))) return ['Id property must be a valid number'];
        if (createdAt) {
            const newCreatedAt = new Date(createdAt);
            if (newCreatedAt.toString() === 'Invalid Date') return ['Invalid date format'];
        }

        return [undefined, new UpdateTodoDto(id, text, done, newCreatedAt)];
    }
}