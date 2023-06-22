export interface GetNFTUserProps {
    handle: string;
    idOnly?: boolean;
    countsOnly?: boolean;
}

export interface SendNFTProps {
    handle: string;
    nftId: string;
    recipientHandle: string;
}

export interface GetNFTSlotsProps {
    handle: string;
    slotIds: string[];
    idOnly?: boolean;
    countsOnly?: boolean;
}

export interface GetNFTCollectionsProps {
    handle: string;
    collectionIds: string[];
    idOnly?: boolean;
    countsOnly?: boolean;
}

export interface GetNFTInfoProps {
    nftId: string
}

export interface UpdateNFTProps {
    nftId: string;
    properties: object;
}

export interface ExpressionValue {
    value: string // url to content
    expressionValueId: string;
    expressionAttribute: { expressionAttributeName: string, expressionAttributeId: string },
    expression: { expressionName: string, expressionId: string },
}


export interface NFTType {
    nftId: string; 
    serial: number;
    location: string;
    collectionId: string;
    handle: string;
    expressionValues: ExpressionValue[];

}