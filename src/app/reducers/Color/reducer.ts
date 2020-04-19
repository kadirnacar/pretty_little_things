import { BaseKnownAction } from '@reducers';
import { Action, Reducer } from 'redux';
import { Actions, ColorState, IReceiveListDataAction, IReceiveSaveDataAction, IRequestSaveDataAction, IRequestListDataAction } from './state';

const unloadedState: ColorState = {
    List: [],
};

export type KnownAction = BaseKnownAction | IReceiveSaveDataAction | IRequestSaveDataAction | IReceiveListDataAction | IRequestListDataAction;

export const reducer: Reducer<ColorState> = (currentState: ColorState = unloadedState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;

    switch (action.type) {
        case Actions.ReceiveListData:
            currentState.List = action.payload;
            return { ...currentState };
        case Actions.RequestListData:
            return { ...currentState };
        case Actions.ReceiveSaveData:
            currentState.List = action.payload;
            return { ...currentState };
        case Actions.RequestSaveData:
            return { ...currentState };
        default:
            break;
    }
    return currentState || unloadedState;
};
