


export class CustomError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}