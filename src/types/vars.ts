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