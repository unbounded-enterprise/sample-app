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
  id?: string; // leaving those for now to not break non beta implementation, should be removed and replaced by api returned values below
  name?: string;  // leaving those for now to not break non beta implementation, should be removed and replaced by api returned values below
  icon?: string;  // leaving those for now to not break non beta implementation, should be removed and replaced by api returned values below

  appId: string;
  handcashAppId: string;
  appName: string;
  appImage: string;
  teamId: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  slots: string[];


  [key: string]: any;
}

export default App;
