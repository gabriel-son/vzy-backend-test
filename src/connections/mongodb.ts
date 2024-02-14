import { App, Database } from "@config/index";
import { ENVTYPE } from "@components/types";
import mongoose, { Connection, Model, SchemaOptions } from "mongoose";
import { BaseConnection } from "./base";

mongoose.set("debug", !App.prod || App.env === "staging");
mongoose.plugin(function plugin(schema: any) {
	schema.statics.findOrCreate = async function findOrCreate(this: Model<any>, findByQuery: any, createData: any = {}): Promise<any> {
		const doc: any = await this.findOne(findByQuery);
		return doc
			? { doc, created: false }
			: {
					doc: await this.create({ ...findByQuery, ...createData }),
					created: true,
				};
	};
});

export const SCHEMA_OPTIONS: SchemaOptions = {
	timestamps: true,
};

export class MongoConnection extends BaseConnection<Connection> {
	public createConnection() {
		return mongoose.createConnection(Database.connection[App.env as ENVTYPE].MONGO_URI).on("connected", () => {
			console.log("MongoDB connected");
		});
	}
}

export default new MongoConnection();
