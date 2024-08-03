export interface Credentials {
    user: string;
    pass: string
}

export interface LoggedInUser {
    id: string;
    userName: string;
    roles: string[];
    avatarUrl: string;
    name: string;
}