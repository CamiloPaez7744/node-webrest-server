import express, { type Router } from 'express';
import compression from 'compression';
import path from 'path';

interface Options {
    port: number;
    public_path?: string;
    routes: Router;
}

export class Server {

    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor( options: Options) {
        const { port, public_path, routes } = options;
        this.port = port;
        this.publicPath = public_path ?? 'public';
        this.routes = routes;
    }

    async start() {

        //* Middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use( compression() );

        this.app.use(express.static(this.publicPath));

        //* Routes

        this.app.use( this.routes );


        this.app.get('*', (req, res) => {
            const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
            res.sendFile(indexPath);
        });

        // this.app.get('*', (req, res) => {
        //     console.log(req.url);
        //     res.sendFile('index.html', { root: this.publicPath });
        // });


        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });

    }

    public close() {
        this.serverListener.close();
    }

}