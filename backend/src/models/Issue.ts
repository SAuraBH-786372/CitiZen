import { Schema, model, Document, Types } from 'mongoose'

export interface IIssue extends Document {
  title: string
  description: string
  category: string
  status: 'Open' | 'In Progress' | 'Resolved'
  location: { lat: number; lng: number }
  address?: string
  imageUrl?: string
  upvotes: number
  upvoters: Types.ObjectId[]
  createdBy: Types.ObjectId
  assignedTo?: Types.ObjectId | null
}

const issueSchema = new Schema<IIssue>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Open','In Progress','Resolved'], default: 'Open' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  address: { type: String },
  imageUrl: String,
  upvotes: { type: Number, default: 0 },
  upvoters: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true })

export const Issue = model<IIssue>('Issue', issueSchema)