import {User} from "@/lib/domain/user.model";
import {Types} from "mongoose";

export interface Achievement<TUser extends User | Types.ObjectId> {
    by: TUser;
    at: string;
    proof?: string;
}

export interface ActionItem<TUser extends User | Types.ObjectId> {
    _id: Types.ObjectId;
    title: string;
    description: string;
    achievements: Achievement<TUser>[];

    createdBy: TUser;
    startedAt: string;
    archived: boolean;
}
