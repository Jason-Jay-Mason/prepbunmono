import { Access } from "payload";

export const loggedIn: Access = ({ req: { user } }) => {
  if (user) return true;
  return false;
};
