interface ArtifactActivity {
	key?: string;
	description: string;
	params?: any;
}
export class Artifact {
	public message: string | null = null;
	public data: object | null;
	public code: number;

	public activity?: ArtifactActivity;

	constructor(data: object | null = null, message?: string, code: number = 200) {
		this.data = data;
		this.code = code;
		if (message) {
			this.message = message;
		}
	}

	public setAsActivity(activity: ArtifactActivity) {
		this.activity = activity;
		return this;
	}
}

export interface Layout {
	name: string;
	params?: Record<string, any>;
	contentVar?: string;
}
