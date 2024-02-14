export interface LocalSignupPayload {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface LocalLoginPayload {
	email: string;
	password: string;
}
