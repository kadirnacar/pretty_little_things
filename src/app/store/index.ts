import { ColorState, ColorReducer } from "../reducers/Color";

export interface ApplicationState {
    Color?: ColorState;
}

export const reducers = {
    Color: ColorReducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<any>;
}

export interface AppThunkActionAsync<TAction, TResult> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<TResult>
}