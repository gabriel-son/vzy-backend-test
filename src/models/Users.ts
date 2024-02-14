import Mongo, { SCHEMA_OPTIONS } from "@connections/mongodb";
import { MyGoose } from "@libs/mongoose";
import { ROLES, SIGNUPTYPES } from "@components/enums";
import bcrypt from "bcryptjs";
import { Field, ObjectType } from "type-graphql";
import { ReturnModelType, pre, prop, getModelForClass } from "@typegoose/typegoose";

@pre<IUser>("save", function (next) {
	this.updatedAt = new Date();
	if (this.isModified("password")) {
		this.password = bcrypt.hashSync(this.password, 10);
	}
	next();
})
@ObjectType("User")
export class IUser extends MyGoose {
	public static async getUser(this: ReturnModelType<typeof IUser>, params: any) {
		return await this.findOne(params).exec();
	}

	@prop({ required: true, unique: true })
	@Field({ nullable: false })
	public email!: string;

	@prop({ required: true })
	@Field({ nullable: false })
	public lastName!: string;

	@prop({ required: true })
	@Field({ nullable: false })
	public firstName!: string;

	@prop({ required: true })
	public password!: string;

	@prop({ required: false, default: false })
	public isEmailVerified!: boolean;

	@prop({ required: false, default: ROLES.USER })
	public role!: ROLES;

	@prop({ required: false, default: false })
	public active!: boolean;

	@prop({ required: false, default: false })
	public deleted!: boolean;

	@prop({
		required: false,
		default: "https://res.cloudinary.com/http-startng/image/upload/v1612005122/Fund_My_Laptop/profile_photo/user_1_nd9w3h.svg",
	})
	public profilePicture!: string;

	@prop({ default: Date.now })
	public lastVisited!: Date;

	@prop({ default: SIGNUPTYPES.LOCAL, enum: SIGNUPTYPES })
	public signUpType!: SIGNUPTYPES;

	@prop({ default: Date.now })
	public createdAt!: Date;

	@prop({ default: Date.now })
	public updatedAt!: Date;

	constructor() {
		super();
	}

	public hasVisitedToday() {
		const lastVisited = new Date(this.lastVisited);
		const today = new Date();
		if (
			lastVisited.getDate() === today.getDate() &&
			lastVisited.getMonth() === today.getMonth() &&
			lastVisited.getFullYear() === today.getFullYear()
		) {
			return true;
		}
	}

	public verifyPassword(password: string) {
		return bcrypt.compareSync(password, this.password);
	}

	public static encryptPassword(password: string) {
		return bcrypt.hashSync(password, 10);
	}
}

export const User = getModelForClass(IUser, {
	existingConnection: Mongo.ActiveConnection,
	schemaOptions: { ...SCHEMA_OPTIONS, collection: "users" },
});
