import Mongo, { SCHEMA_OPTIONS } from "@connections/mongodb";
import { MyGoose } from "@libs/mongoose";
import { Field, ObjectType } from "type-graphql";
import { ReturnModelType, prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { IUser } from "./index";

@ObjectType("Payments")
export class IPayments extends MyGoose {
	public static async getTransactions(this: ReturnModelType<typeof IPayments>, params: any) {
		return await this.findOne(params).exec();
	}

	@prop({ ref: IUser })
	@Field((type) => IUser)
	public user!: Ref<IUser>;

	@prop({ required: true, trim: true })
	@Field({ nullable: false })
	public amount!: string;

	@prop({ required: true, trim: true })
	@Field({ nullable: false })
	public ref!: string;

	constructor() {
		super();
	}
}

export const Payments = getModelForClass(IPayments, {
	existingConnection: Mongo.ActiveConnection,
	schemaOptions: { ...SCHEMA_OPTIONS, collection: "payments" },
});
