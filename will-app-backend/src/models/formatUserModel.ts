export interface Asset {
    type: string;
    subtype?: string;
    data: any;
}

export interface Liability {
    type: string;
    data: any;
}

export interface Beneficiary {
    type: string;
    data: any;
}

export interface Pet {
    data: any;
}

export interface ExcludedPerson {
    data: any;
}

export interface User {
    fullName: string;
    fatherName: string;
    gender: string;
    dob: Date;
    religion: string;
    aadhaarNumber: string;
    userName: string;
    phoneNumber: string;
    addressDetails: { data: any }[];
    assets: Asset[];
    liabilities: Liability[];
    beneficiaries: Beneficiary[];
    pets: Pet[];
    excludedPersons: ExcludedPerson[];
}
