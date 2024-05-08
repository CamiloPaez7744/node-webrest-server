import express from 'express';

interface Options {
    port: number;
    public_path?: string;
}

export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;

    constructor( options: Options) {
        const { port, public_path } = options;
        this.port = port;
        this.publicPath = public_path ?? 'public';
    }

    async start() {

        //* Middleware

        this.app.use(express.static(this.publicPath));

        this.app.get('*', (req, res) => {
            console.log(req.url);
            res.sendFile('index.html', { root: this.publicPath });
        });


        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}