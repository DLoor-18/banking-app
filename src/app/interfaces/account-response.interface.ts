import { IUserResponse } from "./user-response.interface"

export interface IAccountResponse {
    id: string,
    customerId: string,
    accountNumber: string,
    balance: number,
    status: string
    user: IUserResponse
}