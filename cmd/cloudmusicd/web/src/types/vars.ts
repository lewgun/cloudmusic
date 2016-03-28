export interface TopListPair {
    [index: number]: string;
    length: number;
}
export interface WebLoginParams {
    username: string;
    password: string;
    rememberLogin: string;
    csrf_token: string;
}

export interface PhoneLoginParams {
    phone: string;
    password: string;
    rememberLogin: string;
        csrf_token: string;
}

//RequestParams
export interface RequestParams {
    by: string;
    params: string;
    encSecKey: string;
    csrf_token: string;
}