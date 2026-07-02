export interface AuthTokenRequest {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export interface JwtPayload {
  role: string;
  iat: number;
  exp: number;
}
