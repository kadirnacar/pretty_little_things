// import { IChannel } from '@models';
// import { createStream } from '@tools';
// import { JSDOM } from 'jsdom';
// import lowdb, { AdapterAsync } from 'lowdb';
// import FileAsync from "lowdb/adapters/FileAsync";
// import * as path from 'path';
// import { Router } from '../Route';
// import { ICallback } from '../Route/Router';
// export class ChannelsRouter {

//     router: Router;
//     adapter: AdapterAsync<any>;
//     db: lowdb.LowdbAsync<{ Channels: IChannel[] }>;
//     filePath;

//     constructor() {
//         this.router = new Router();
//         this.filePath = path.resolve(__dirname, "db.json");
//         this.init();
//     }

//     public async getList(ev: ICallback) {
//         const channels = await this.db.get('Channels').value();
//         ev.cb({ statusCode: 200, data: createStream(JSON.stringify(channels)) });
//     }

//     public async getUrl(element) {
//         try {
//             var url;
//             return new Promise(async (resolve, reject) => {
//                 var result = JSDOM.fromURL(element.pageUrl, {
//                     resources: "usable"
//                 });
//                 result.then(data => {
//                     var c = false;
//                     if (element.iframe == true) {
//                         const iframe = data["window"].document.querySelector("iframe");
//                         iframe.addEventListener('load', (a) => {
//                             var re = new RegExp(element.urlRegex, "gi");
//                             var frameContent = a.target["contentDocument"].body.innerHTML;
//                             url = frameContent.match(re);
//                             if (url)
//                                 element.url = url[0];
//                             c = true;
//                             resolve();
//                         })
//                     } else {
//                         var content = data["window"].document.body.innerHTML;
//                         var re = new RegExp(element.urlRegex, "gi");
//                         url = content.match(re);
//                         if (url)
//                             element.url = url[0];
//                         resolve();
//                     }
//                 })
//             });
//         } catch (ex) {
//             console.log(ex)
//         }

//     }

//     public async readUrl(ev: ICallback) {
//         try {
//             const name = ev.params["name"];
//             const data = await this.db.get('Channels').value();
//             await new Promise(async (resolve, reject) => {
//                 try {
//                     for (var i = 0; i < data.length; i++) {
//                         var element = data[i];
//                         if (element.name == name) {
//                             if (element.type == 3) {
//                                 var d = await this.getUrl(element);
//                                 this.db.set(i, element);
//                                 this.adapter.write(this.db);
//                             }
//                         }
//                     }

//                     resolve();
//                 } catch {
//                     reject();
//                 }
//             })

//             const channels = await this.db.get('Channels').value();
//             ev.cb({ statusCode: 200, data: createStream(JSON.stringify(channels)) });

//         } catch (ex) {
//             ev.cb({
//                 statusCode: 500, data: createStream(JSON.stringify({
//                     err: ex
//                 }))
//             });
//         }
//     }

//     public async save(ev: ICallback) {
//         await this.adapter.write({ Channels: ev.data });
//         this.db = await lowdb(this.adapter);
//         const channels = await this.db.get('Channels').value();
//         ev.cb({ statusCode: 200, data: createStream(JSON.stringify(channels)) });
//     }

//     async init() {
//         this.adapter = new FileAsync(this.filePath);
//         this.db = await lowdb(this.adapter);
//         this.router.get('/list', this.getList.bind(this));
//         this.router.post('/', this.save.bind(this));
//         this.router.get('/readurl/:name', this.readUrl.bind(this));
//     }

// }

// const channelsRoutes = new ChannelsRouter();

// const router = channelsRoutes.router;
// export default router;