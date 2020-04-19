import config from '@config';
import { Result } from '@models';
import { ServiceBase } from "./ServiceBase";

export class ColorService extends ServiceBase {

    public static async getList(): Promise<Result<any[]>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/colors/list`,
            method: "GET"
        }, false);
        return result;
    }
    public static async save(data: any[]): Promise<Result<any[]>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/colors/`,

            method: "POST",
            data: data
        }, false);
        return result;
    }
}