export interface PermissionRequestProps {
    requestingApp: string;
    grantingApp: string;
    read: boolean;
    transfer: boolean;
}

export interface PermissionGrantProps {
    permissionId: string;
    grantingApp: string;
}

export interface PermissionDenyProps {
    permissionId: string;
}

export interface PermissionDeleteProps {
    permissionId: string;
}

export interface Permission extends PermissionRequestProps {
    permissionId: string;
    status: 'pending' | 'granted' | 'denied' | 'deleted';
}

export default Permission;