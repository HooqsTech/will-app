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
    id : string;
    full_name: string;
    relationship: string;
    reason: string;
}

export interface User {
    full_name: string;
    father_name: string;
    gender: string;
    dob: Date;
    religion: string;
    aadhaar_number: string;
    user_name: string;
    phone_number: string;
    address_details: { data: any }[];
    assets: Asset[];
    liabilities: Liability[];
    beneficiaries: Beneficiary[];
    pets: Pet[];
    excluded_persons: ExcludedPerson[];
}