
export function IsCellPhone(txt: string): boolean {
    const re = /0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/;
    return re.test(txt) 
}