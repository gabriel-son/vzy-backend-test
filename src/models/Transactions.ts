import Mongo, { SCHEMA_OPTIONS } from "@connections/mongodb";
import { MyGoose } from "@libs/mongoose";
import { Field, ObjectType } from "type-graphql";
import { ReturnModelType, prop, getModelForClass } from "@typegoose/typegoose";

@ObjectType("Transaction")
export class ITransactions extends MyGoose {
	public static async getTransactions(this: ReturnModelType<typeof ITransactions>, params: any) {
		return await this.findOne(params).exec();
	}

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

export const Transactions = getModelForClass(ITransactions, {
	existingConnection: Mongo.ActiveConnection,
	schemaOptions: { ...SCHEMA_OPTIONS, collection: "transaction" },
});
