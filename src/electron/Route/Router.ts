import RouteParser from 'route-parser';
import url from 'url';
import { StreamProtocolResponse } from 'electron';
import { createStream } from '@tools';

export interface ICallback {
    params: { [x: string]: string },
    data: any,
    req: Electron.Request,
    cb: (data: NodeJS.ReadableStream | StreamProtocolResponse) => void
}

export class Router {
    constructor() {
        this.routers = {};
    }
    routers: { [method: string]: { [path: string]: { parser: RouteParser, callback: (ICallback) => void } } };

    callback(match: { [x: string]: string }, urlParser: url.UrlWithParsedQuery, req: Electron.Request, cb: (data: NodeJS.ReadableStream | StreamProtocolResponse) => void) {
        const routes = this.routers[req.method] ? Object.keys(this.routers[req.method]) : [];
        let matchChild: any;
        const data = req.uploadData && req.uploadData.length > 0 ? JSON.parse(req.uploadData[0].bytes.toString("utf-8")) : null;
        for (var i = 0; i < routes.length; i++) {
            if (this.routers[req.method] && this.routers[req.method][routes[i]]) {

                matchChild = this.routers[req.method][routes[i]].parser.match(`/${match.others}`);
                if (matchChild) {
                    try {
                        this.routers[req.method][routes[i]].callback({ params: { ...matchChild, ...urlParser.query }, data: data, req, cb });
                    } catch (err) {
                        console.error(err)
                        cb({ statusCode: 500, headers: { 'content-type': 'text/html' }, data: createStream(err.toString()) })

                    }
                    return;
                }
            }
        }
        cb({ statusCode: 404, headers: { 'content-type': 'text/html' }, data: createStream(`${req.method} ${urlParser.pathname} not found!`) })
        // cb(`${req.method} ${urlParser.pathname} not found!`);
    }

    get(path: string, callback: (ICallback) => void) {
        if (!this.routers["GET"])
            this.routers["GET"] = {};
        this.routers["GET"][path] = { parser: new RouteParser(`${path}(/*others)`), callback };
    }

    post(path: string, callback: (ICallback) => void) {
        if (!this.routers["POST"])
            this.routers["POST"] = {};
        this.routers["POST"][path] = { parser: new RouteParser(`${path}(/*others)`), callback };
    }
}