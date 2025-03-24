export interface ExecutorData {
    fullName: string;
    gender: string;
    dob: string;
    email: string;
    phoneNumber: string;
}

export interface IExecutor {
    id: string;
    data: ExecutorData;
}

export function parseBeneficiaries(executorsData: any[]): IExecutor[] {
    return executorsData.map((executor: IExecutor) => ({
        id: executor.id || "",
        data: {
            email: executor.data?.email || "",
            phoneNumber: executor.data?.phoneNumber || "",
            gender: executor.data?.gender || "Other",
            fullName: executor.data?.fullName || "",
            dob: executor.data?.dob || "",
        }
    }));
}