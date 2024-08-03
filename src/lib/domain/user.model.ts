import {Types} from "mongoose";

export interface User {
    _id: Types.ObjectId;
    userName: string;
    secretHash: string;
    roles: string[];
    avatarUrl: string;
    name: string;
}
