import { createStream } from '@tools';
import { dialog } from 'electron';
import { readFileSync } from 'fs';
import { Router } from '../Route';
import { ICallback } from '../Route/Router';
export class FileRouter {

    router: Router;

    constructor() {
        this.router = new Router();
        this.init();
    }

    public async getList(ev: ICallback) {
        const file = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Images', extensions: ['jpg', 'jpeg'] }] })
        let result: string = "";
        if (!file.canceled) {
            var bitmap = readFileSync(file.filePaths[0]);
            result = `data:image/jpg;base64,${new Buffer(bitmap).toString('base64')}`;
            ev.cb({ statusCode: 200, data: createStream(JSON.stringify({ data: result, path: file.filePaths[0] })) });
        } else {
            ev.cb({ statusCode: 200, data: createStream(JSON.stringify({ data: "", path: "" })) });
        }
    }

    async init() {
        this.router.get('/', this.getList.bind(this));
    }

}

const colorsRoutes = new FileRouter();

const router = colorsRoutes.router;
export default router;