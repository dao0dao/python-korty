export interface User {
    id?: string;
    name: string;
    login: string;
    password?: string;
    confirmPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}