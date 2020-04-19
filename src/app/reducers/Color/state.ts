import { IColor } from '@models';

export enum Actions {
    RequestListData = "REQUEST_LIST_COLOR",
    ReceiveListData = "RECEIVE_LIST_COLOR",
    RequestSaveData = "REQUEST_SAVE_COLOR",
    ReceiveSaveData = "RECEIVE_SAVE_COLOR"
}

export interface ColorState {
    List: IColor[];
}

export interface IRequestSaveDataAction {
    type: Actions.RequestSaveData;
}

export interface IReceiveSaveDataAction {
    type: Actions.ReceiveSaveData;
    payload: IColor[];
}

export interface IRequestListDataAction {
    type: Actions.RequestListData;
}

export interface IReceiveListDataAction {
    type: Actions.ReceiveListData;
    payload: IColor[];
}