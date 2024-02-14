import Mongo, { SCHEMA_OPTIONS } from "@connections/mongodb";
import { MyGoose } from "@libs/mongoose";
import { Field, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";
import { ReturnModelType, prop, pre, getModelForClass } from "@typegoose/typegoose";

@pre<IRefreshToken>("save", async function (next) {
	if (this.isModified("token")) {
		this.token = bcrypt.hashSync(this.token, 10);
	}
	next();
})
@ObjectType("RefreshToken")
export class IRefreshToken extends MyGoose {
	public static async getToken(this: ReturnModelType<typeof IRefreshToken>, params: any) {
		return await this.findOne(params).exec();
	}

	@prop({ required: true, trim: true })
	@Field({ nullable: false })
	public user!: string;

	@prop({ required: true, trim: true })
	@Field({ nullable: false })
	public token!: string;

	@prop({ default: Date.now, index: { expires: "1h" } })
	@Field()
	public createdAt!: Date;

	constructor() {
		super();
	}

	public verifyToken(token: string) {
		return bcrypt.compareSync(token, this.token);
	}
}

export const RefreshToken = getModelForClass(IRefreshToken, {
	existingConnection: Mongo.ActiveConnection,
	schemaOptions: { ...SCHEMA_OPTIONS, collection: "refreshTokens" },
});
