import { atom } from 'recoil';

export interface IVehicleLoanState {
    id: string;
    nameOfBank: string;
    loanAmount: number | undefined;
    accountNumber: string;
}

export const vehicleLoansState = atom<IVehicleLoanState[]>({
    key: 'vehicleLoansState',
    default: [{
        id: "",
        nameOfBank: "",
        loanAmount: undefined,
        accountNumber: "",
    }]
});