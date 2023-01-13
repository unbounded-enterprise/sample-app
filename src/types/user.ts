export interface User {
  id: string;
  handle: string;
  avatarUrl: string;
  email: string;
  displayName: string;

  [key: string]: any;
}

export default User;