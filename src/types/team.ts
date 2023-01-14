import { App } from "./app";

export interface TeamCreationProps {
    companyName: string;
    email: string;
    owner: string;
}

export interface TeamUpdateProps {
    teamId: string;
    companyName: string;
    email: string;
    owner: string;
}

export interface Team {
    teamId: string;
    apps: string[];
    companyName: string;
    email: string;
    status: string;
    handle: string;
    createdAt: number;
    updatedAt: number;
}

export default Team;