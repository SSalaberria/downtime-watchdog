export interface JwtSign {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  roles: string[];
}

export interface Payload {
  id: string;
  name: string;
  email: string;
  roles: string[];
}
