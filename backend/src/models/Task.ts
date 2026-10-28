import { Schema, model, type InferSchemaType } from 'mongoose';

const taskSchema = new Schema({
  ownerUid: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

taskSchema.index({ ownerUid: 1, createdAt: -1 });

export type TaskDocument = InferSchemaType<typeof taskSchema>;
export const Task = model('Task', taskSchema);
