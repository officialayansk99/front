export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "client" | "superadmin";
  kycStatus: "pending" | "approved" | "rejected";
};

export type AuthPayload = {
  token: string;
  user: AuthUser;
};

export type RegisterResult = {
  message: string;
  email: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};
