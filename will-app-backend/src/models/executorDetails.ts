export interface ExecutorData {
    fullName: string;
    title: "Mr" | "Mrs" | "Miss" | "";
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    email: string;
    phoneNumber: string;
}

export interface IExecutor {
    id: string;
    data: ExecutorData;
}

export function parseExecutors(executorsData: any[]): IExecutor[] {
    return executorsData.map((executor: IExecutor) => ({
        id: executor.id || "",
        data: {
            email: executor.data?.email || "",
            phoneNumber: executor.data?.phoneNumber || "",
            gender: executor.data?.gender || "Other",
            title: executor.data?.title || "",
            fullName: executor.data?.title + ". " + executor.data?.firstName + " " + executor.data?.lastName || "",
            firstName: executor.data?.firstName || "",
            lastName: executor.data?.lastName || "",
            dob: executor.data?.dob || "",
        }
    }));
}