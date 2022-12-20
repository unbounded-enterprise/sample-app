export interface Role {
    teamId: string;
    role: string;
}

export interface AccountCreationProps {
    name: string;
    email: string;
    handle: string;
}

export interface AccountUpdateProps extends AccountCreationProps {
    accountId: string;
}

export interface Account extends AccountUpdateProps {
    roles: Role[];
}

export default Account;