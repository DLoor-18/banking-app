export interface ITransactionTypeResponse {
    id: string,
    type: string,
    description: string,
    value: number,
    transactionCost: boolean,
    discount: boolean,
    status: string
}