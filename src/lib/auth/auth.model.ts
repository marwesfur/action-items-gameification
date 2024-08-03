import {User} from "@/lib/domain/user.model";

export interface Credentials {
    user: string;
    pass: string
}

export interface LoggedInUser extends Omit<User, 'secretHash'> {
}