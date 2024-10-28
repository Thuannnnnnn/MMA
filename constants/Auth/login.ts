export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface LoginResponse {
    message: string;
    user: UserWithoutPassword;
    token: string;
  }
  export interface LoginError {
    message: string;
  }
  export interface UserWithoutPassword {
    _id: string;
    name: string;
    email: string;
    role: string;
    gender?: string;
    phoneNumber?: string;
    avatarUrl?: string;
  }
