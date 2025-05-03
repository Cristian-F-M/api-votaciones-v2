export interface UserJWTPaylod {
	id: string
	name: string
	lastname: string
	email: string
}

export interface JWTExpPayload {
  expiresIn: string;
  exp: number;
}