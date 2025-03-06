export interface IBeneficiary {
    id: string,
    userId: string,
    type: string,
    subtype: string,
    data: any
}

export interface IBeneficiaryDeleteRequest{
    id: string,
    userId: string
}