"use server"

import {ensureConnected, UserModel} from "@/lib/storage/mongo.service";
import {User} from "@/lib/domain/user.model";
import {HydratedDocument} from "mongoose";

export interface CreateUserRequest {
    userName: string;
}

export async function createUser(request: CreateUserRequest): Promise<User> {
    await ensureConnected();

    const user: Omit<User, 'id'> = { ...request, name: request.userName, roles: [], avatarUrl: '', secretHash: '' };
    const document = new UserModel(user);
    await document.save();

    return toUser(document);
}

export async function tryGetUserByUserName(userName: string): Promise<User | null> {
    await ensureConnected();
    const document = await UserModel.findOne({ userName }).exec();

    return document ? toUser(document) : null;
}

export async function getUser(id: string): Promise<User> {
    await ensureConnected();
    const document = await UserModel.findById(id).exec();

    return toUser(document);
}

export interface UpdateUserRequest {
    id: string;
    name: string;
    avatarUrl: string;
}

export async function updateUser(request: UpdateUserRequest): Promise<User> {
    await ensureConnected();
    const updatedModel = await UserModel.findByIdAndUpdate(request.id,
        { $set: { avatarUrl: request.avatarUrl, name: request.name } },
        { new: true }
    ).exec();

    return toUser(updatedModel);
}

function toUser(document: HydratedDocument<User>): User {
    return {
        id: document._id.toString(),
        userName: document.userName,
        secretHash: document.secretHash,
        name: document.name,
        roles: document.roles,
        avatarUrl: document.avatarUrl
    };
}