export interface IToast {
    title: string,
    message: string,
    type: string,
    duration: number | 3000,
    close: boolean | true
}