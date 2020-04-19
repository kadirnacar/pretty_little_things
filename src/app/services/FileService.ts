import config from '@config';
import { Result } from '@models';
import { ServiceBase } from "./ServiceBase";

export class FileService extends ServiceBase {

    public static async getList(): Promise<Result<any[]>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/file/`,
            method: "GET"
        }, false);
        return result;
    }
}