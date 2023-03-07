import Slot from "./slot";

export interface AppCreationProps {
  teamId: string;
  appName: string;
  handcashAppId: string;
}

export interface AppUpdateProps {
  appId: string;
  appName: string;
  appImage?: string;
  handcashAppId?: string;
}

export interface App {
  appId: string;
  handcashAppId: string;
  appName: string;
  appImage: string;
  teamId: string;
  status: string;
  description: string;
  url: string;
  createdAt: number;
  updatedAt: number;
  slots: string[];


  [key: string]: any;
}

export interface AppFull {
  appId: string;
  handcashAppId: string;
  appName: string;
  appImage: string;
  teamId: string;
  status: string;
  description: string;
  url: string;
  autoGrantRead: boolean;
  createdAt: number;
  updatedAt: number;
  slots: Slot[];

  [key: string]: any;
}

export interface GetAppProps {
  appId: string;
}

export interface GetSlotsProps {
  appId: string;
  idOnly: boolean;
}

export default App;
