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
    by: string;
    params: string;
    encSecKey: string;
}
export interface Profile {
    userId: number;
    nickname: string;
    signature: string;
    avatarUrl: string
}
