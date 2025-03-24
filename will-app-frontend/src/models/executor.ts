export interface IExecutor {
    id: string,
    userId: string,
    data: any
}

export interface IExecutorDeleteRequest{
    id: string,
    userId: string
}