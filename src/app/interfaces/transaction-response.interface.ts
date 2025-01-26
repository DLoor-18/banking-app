import { IAccountResponse } from "./account-response.interface";

export interface ITransactionResponse {
    id: string,
    accountNumber: string,
    amount: number,
    details: string,
    status: string,
    account: IAccountResponse,
    transactionType: ITransactionResponse
}