import { createStream } from '@tools';
import lowdb, { AdapterAsync } from 'lowdb';
import FileAsync from "lowdb/adapters/FileAsync";
import * as path from 'path';
import { Router } from '../Route';
import { ICallback } from '../Route/Router';
export class ColorsRouter {

    router: Router;
    adapter: AdapterAsync<any>;
    db: lowdb.LowdbAsync<{ Colors: [] }>;
    filePath;

    constructor() {
        this.router = new Router();
        this.filePath = path.resolve(__dirname, "colors.json");
        this.init();
    }

    public async getList(ev: ICallback) {
        const colors = await this.db.get('Colors').value();
        ev.cb({ statusCode: 200, data: createStream(JSON.stringify(colors)) });
    }

    public async save(ev: ICallback) {
        await this.adapter.write({ Colors: ev.data });
        this.db = await lowdb(this.adapter);
        const colors = await this.db.get('Colors').value();
        ev.cb({ statusCode: 200, data: createStream(JSON.stringify(colors)) });
    }

    async init() {
        this.adapter = new FileAsync(this.filePath);
        this.db = await lowdb(this.adapter);
        this.router.get('/list', this.getList.bind(this));
        this.router.post('/', this.save.bind(this));
    }

}

const colorsRoutes = new ColorsRouter();

const router = colorsRoutes.router;
export default router;