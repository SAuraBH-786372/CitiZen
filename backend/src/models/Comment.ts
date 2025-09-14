import { Schema, model, Document, Types } from 'mongoose'

export interface IComment extends Document {
  text: string
  issueId: Types.ObjectId
  author: Types.ObjectId
}

const commentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export const Comment = model<IComment>('Comment', commentSchema)