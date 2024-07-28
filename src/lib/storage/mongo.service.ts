import mongoose, {connect, model, Mongoose, Schema} from "mongoose";
import {ActionItem} from "@/lib/domain/action-items.model";

const achievementSchema = new Schema<ActionItem['achievements'][0]>({
    by: { type: String, required: true },
    at: { type: String, required: true },
    proof: { type: String }
});

const actionItemSchema = new Schema<ActionItem>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startedAt: { type: String, required: true },
    archived: { type: Boolean, required: true },
    achievements: { type: [achievementSchema], required: true }
});

export const ActionItemModel = mongoose.models.ActionItem ?? model<ActionItem>('ActionItem', actionItemSchema);

let connection: Mongoose | undefined;

export async function ensureConnected() {
    if (!connection) {
        const connString = process.env['MONGO_CONN_STRING'] || 'mongodb://127.0.0.1:27017/action-items';
        await connect(connString);
    }
}