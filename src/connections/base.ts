export abstract class BaseConnection<T = any, C = any> {
	public ActiveConnection!: T | never;
	public options?: C;
	constructor(options?: C) {
		this.options = options;
		this.ActiveConnection = this.createConnection();
		this.initialize();
	}

	public initialize() {
		return;
	}

	public abstract createConnection(options?: C): T | never;

	public getConnection(fresh = false) {
		if (this.ActiveConnection && !fresh) {
			return this.ActiveConnection;
		}
		return this.createConnection();
	}
}
