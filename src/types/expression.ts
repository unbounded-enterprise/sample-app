export interface ExpressionCreationProps {
    expressionTypeId: string;
    expressionName: string;
    slotId: string;
}

export interface ExpressionUpdateProps {
    expressionId: string;
    expressionName: string;
    expressionTypeId: string;
}

export interface GetExpressionSlotProps{
    slotId: string;
}

export interface Expression {
    slotId: string;
    expressionId: string;
    expressionName: string;
    expressionType: {
        expressionTypeId: string;
        expressionTypeName: string;
        expressionAttributes: {
            expressionTypeId: string;
            expressionTypeName: string;
        }[];
    };
}

export default Expression;