import { atom } from 'recoil';

export interface IVehicleLoanState {
    nameOfBank: string;
    loanAmount: number | undefined;
    accountNumber: string;
}

export const vehicleLoansState = atom<IVehicleLoanState[]>({
    key: 'vehicleLoansState',
    default: [{
        nameOfBank: "",
        loanAmount: undefined,
        accountNumber: "",
    }]
});