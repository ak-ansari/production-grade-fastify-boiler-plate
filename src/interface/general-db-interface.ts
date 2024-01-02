import { Document, ObjectId } from "mongoose";
// it is mandatory to extend this interface for each interface user in model
export interface IGenDBInterface extends Document{
    createdBy: ObjectId,
    updatedBy: ObjectId,
    createdAt: Date,
    updatedAt: Date
}