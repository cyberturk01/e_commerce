export interface UserModel {
  id?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export const initialUser: UserModel = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  isAdmin: false,
  fullName: '',
};
