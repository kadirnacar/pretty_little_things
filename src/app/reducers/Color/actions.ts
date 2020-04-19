import { IColor, Result } from "@models";
import { ColorService } from "@services";
import { ApplicationState } from '@store';
import { batch } from "react-redux";
import { Actions } from './state';

export const ColorActions = {
    getList: () => async (dispatch, getState: () => ApplicationState) => {
        let result: Result<IColor[]>;
        await batch(async () => {
            await dispatch({ type: Actions.RequestListData });
            result = await ColorService.getList();
            await dispatch({ type: Actions.ReceiveListData, payload: result.value });

        });
        return result;
    },
    save: (data: IColor[]) => async (dispatch, getState: () => ApplicationState) => {
        let result: Result<IColor[]>;
        await batch(async () => {
            await dispatch({ type: Actions.RequestSaveData });
            result = await ColorService.save(data);
            await dispatch({ type: Actions.ReceiveSaveData, payload: result.value });

        });
        return result;
    }
}