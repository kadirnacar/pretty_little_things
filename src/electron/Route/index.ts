import { app, protocol } from 'electron';
import { Router } from './Router';
import RouteParser from 'route-parser';
import url from 'url';
import { createStream } from '@tools';
export { Router } from './Router';

export class Route {
    constructor(scheme: string = "electron") {
        this.routers = {};
        protocol.registerSchemesAsPrivileged([{ scheme: scheme, privileges: { supportFetchAPI: true, allowServiceWorkers: true, standard: true, bypassCSP: true, corsEnabled: true } }])
        app.on("ready", () => {
            protocol.registerStreamProtocol(scheme, (req, cb) => {
                const urlParser = url.parse(req.url, true);
                const routes = Object.keys(this.routers);
                let match: any;
                for (var i = 0; i < routes.length; i++) {
                    match = this.routers[routes[i]].parser.match(urlParser.path);
                    if (match) {
                        this.routers[routes[i]].router.callback(match, urlParser, req, cb);
                        return;
                    }
                }
                cb({ statusCode: 404, headers: { 'content-type': 'text/html' }, data: createStream(`${req.method} ${urlParser.pathname} not found!`) })
                // cb(`${req.method} ${urlParser.pathname} not found!`);
            })
        });
    }

    routers: { [path: string]: { router: Router, parser: RouteParser } };

    use(path: string, router: Router) {
        this.routers[path] = { router, parser: new RouteParser(`${path}(/*others)`) };
    }
}