import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  actorId: string;
  actorName: string;
  actorEmail: string;
  action: string;
  target?: string;
  details?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  actorId: { type: String, required: true },
  actorName: { type: String, required: true },
  actorEmail: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, default: "" },
  details: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
});

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
