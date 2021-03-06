

export type EventType = string;


export interface TopListPair {
    [index: number]: string;
    length: number;
}
export interface WebLoginParams {
    username: string;
    password: string;
    rememberLogin: string;
}

export interface PhoneLoginParams {
    phone: string;
    password: string;
    rememberLogin: string;
}

//RequestParams
export interface RequestParams {
    params: string;
    encSecKey: string;
}


export interface Action{
    typ: string;
    payload: any; 
}

export interface ActionHandler {
    (t: Action): void ;
}

export interface EventHandler {
    (evt: EventType): void ;
}
