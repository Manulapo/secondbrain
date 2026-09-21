export type AuthenticatedUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};

export type UserRole = "USER" | "ADMIN";

export type AuthFormProps = {
  mode: "login" | "signup";
};
