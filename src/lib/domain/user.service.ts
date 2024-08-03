"use server"

import {ensureConnected, UserModel} from "@/lib/storage/mongo.service";
import {User} from "@/lib/domain/user.model";

export interface CreateUserRequest {
    userName: string;
}

export async function createUser(request: CreateUserRequest): Promise<User> {
    await ensureConnected();

    const user: Omit<User, '_id'> = { userName: request.userName, name: request.userName, roles: [], avatarUrl: '', secretHash: '' };
    const document = new UserModel(user);
    await document.save();

    return document;
}

export async function tryGetUserByUserName(userName: string): Promise<User | null> {
    await ensureConnected();
    const document = await UserModel.findOne({ userName }).exec();

    return document ?? null;
}

export async function getUser(id: string): Promise<User> {
    await ensureConnected();

    return await UserModel.findById(id).exec();
}

export interface UpdateUserRequest {
    id: string;
    name: string;
    avatarUrl: string;
}

export async function updateUser(request: UpdateUserRequest): Promise<User> {
    await ensureConnected();
    return await UserModel.findByIdAndUpdate(request.id,
        { $set: { avatarUrl: request.avatarUrl, name: request.name } },
        { new: true }
    ).exec();
}
