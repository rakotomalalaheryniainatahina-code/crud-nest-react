import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UsersDocument = Users & Document

@Schema()
export class Users {
    @Prop({ required: true })
    fullname: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    country: string;
}


export const UsersSchema = SchemaFactory.createForClass(Users);