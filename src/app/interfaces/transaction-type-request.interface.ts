export interface ITransactionTypeRequest {
    type: string,
    description: string,
    value: number,
    transactionCost: boolean,
    discount: boolean,
    status: string
}