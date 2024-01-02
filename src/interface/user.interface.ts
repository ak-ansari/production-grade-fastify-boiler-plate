import { IGenDBInterface } from "./general-db-interface";

export interface IUser extends IGenDBInterface {
  userName: string;
  mobileNo: number;
  email: string;
  passwords: string;
  refreshToken: string;
}
export interface ILoginRes {
  user: IUser,
  accessToken: string,
  refreshToken: string
}
