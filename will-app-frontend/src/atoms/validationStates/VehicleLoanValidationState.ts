import { atom } from 'recoil';

export interface IVehicleLoanValidationState {
    id: string;
    nameOfBank: string;
    loanAmount: string;
    accountNumber: string;
}

export const vehicleLoanValdationState = atom<IVehicleLoanValidationState[]>({
    key: 'vehicleLoanValdationState',
    default: [{
        id: "",
        nameOfBank: "",
        loanAmount: "",
        accountNumber: "",
    }]
});

export var emptyVehicleloanValidationState: IVehicleLoanValidationState = {
    id: "",
    nameOfBank: "",
    loanAmount: "",
    accountNumber: "",
};