export interface SlotCreationProps {
    appId: string;
    slotName: string;
}

export interface SlotUpdateProps {
    slotId: string;
    slotName: string;
}

export interface GetCollectionsProps {
    handle: string;
    slotId: string;
    idOnly?: boolean;
    includeDeactivated?: boolean;
}

export interface Slot {
    slotId: string;
    slotName: string;
    appId: string;
    createdAt: number;
    updatedAt: number;
    collections: any[];
    expressions: any[];
}

export default Slot;