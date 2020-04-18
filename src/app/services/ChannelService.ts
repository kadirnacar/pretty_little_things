// import config from '@config';
// import { BaseModel, IChannel, Result } from '@models';
// import { ServiceBase } from "./ServiceBase";

// export class ChannelService extends ServiceBase {

//     public static async getList(): Promise<Result<IChannel[]>> {
//         var result = await this.requestJson<IChannel[]>({
//             url: `${config.restUrl}/api/channels/list`,
//             method: "GET"
//         }, false);
//         return result;
//     }
//     public static async save(data: IChannel[]): Promise<Result<IChannel[]>> {
//         await fetch(`${config.restUrl}/api/channels/`, { method: "POST", body: JSON.stringify(data) });
//         var result = await this.requestJson<IChannel[]>({
//             url: `${config.restUrl}/api/channels/`,

//             method: "POST",
//             data: data
//         }, false);
//         return result;
//     }
//     public static async refreshUrl(name: string): Promise<Result<IChannel[]>> {
//         var result = await this.requestJson<IChannel[]>({
//             url: `${config.restUrl}/api/channels/readurl/${name}`,
//             method: "GET"
//         }, false);
//         return result;
//     }
// }