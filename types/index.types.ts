export type ExplorerNote = { id: string; title: string; slug: string };

export type ExplorerFolder = {
  id: string;
  name: string;
  slug: string;
  children: ExplorerFolder[];
  notes: ExplorerNote[];
};

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