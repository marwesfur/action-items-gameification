import mongoose, {connect, model, Mongoose, Schema, Types} from "mongoose";
import {Achievement, ActionItem} from "@/lib/domain/action-items.model";
import {User} from "@/lib/domain/user.model";
import {config} from "@/lib/config/config";

const achievementSchema = new Schema<Achievement<Types.ObjectId>>({
    by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    at: { type: String, required: true },
    proof: { type: String }
});

const actionItemSchema = new Schema<ActionItem<Types.ObjectId>>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    startedAt: { type: String, required: true },
    archived: { type: Boolean, required: true },
    achievements: { type: [achievementSchema], required: true }
});

const userSchema = new Schema<User>({
    userName: { type: String, required: true, unique: true },
    secretHash: { type: String, required: false },
    avatarUrl: { type: String, required: false },
    name: { type: String, required: true },
    roles: { type: [String], required: true }
});

export const ActionItemModel = mongoose.models.ActionItem ?? model<ActionItem<Types.ObjectId>>('ActionItem', actionItemSchema);
export const UserModel = mongoose.models.User ?? model<User>('User', userSchema);

let connection: Mongoose | undefined;

export async function ensureConnected() {
    if (!connection) {
        connection = await connect(config.connString);
    }
}