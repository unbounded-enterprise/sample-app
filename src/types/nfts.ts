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