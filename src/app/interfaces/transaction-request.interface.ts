export interface ITransactionRequest {
    accountId: string,
    transactionTypeId: string,
    accountNumber: string,
    amount: number,
    details: string,
    status: string
}