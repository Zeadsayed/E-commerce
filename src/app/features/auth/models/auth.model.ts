export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

export interface RegisteredUser extends RegisterUser {
  id: number;
}
