import { createStream } from '@tools';
import { dialog } from 'electron';
import { readFileSync } from 'fs';
import { Magic, MAGIC_MIME_TYPE } from 'mmmagic';
import { Router } from '../Route';
import { ICallback } from '../Route/Router';
export class FileRouter {

    router: Router;

    constructor() {
        this.router = new Router();
        this.init();
    }

    public async getList(ev: ICallback) {
        const file = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg', 'bmp'] }] })
        let result: string = "";
        if (!file.canceled) {
            var bitmap = readFileSync(file.filePaths[0]);
            var magic = new Magic(MAGIC_MIME_TYPE);
            magic.detectFile(file.filePaths[0], function (err, result) {
                if (err) throw err;

                result = `data:${result};base64,${new Buffer(bitmap).toString('base64')}`;
                ev.cb({ statusCode: 200, data: createStream(JSON.stringify({ data: result, path: file.filePaths[0] })) });
            });
        }
    }

    async init() {
        this.router.get('/', this.getList.bind(this));
    }

}

const colorsRoutes = new FileRouter();

const router = colorsRoutes.router;
export default router;