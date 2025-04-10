export const IsEmptyString = (value?: string) => {
    return value === "" || value === null || value === undefined;
}

export const IsEmptyNumber = (value: number | undefined | null) => {
    return value === null || value === undefined;
}

export const isValidAadhaar = (value: string): boolean => {
    return /^[0-9]{12}$/.test(value);
};

export const isNumber = (value: string): boolean => {
    return /^\d+$/.test(value);
};

export const isValidPincode = (value: string): boolean => {
    return /^[0-9]{6}$/.test(value);
};

export const IsValidPhoneNumber = (value: string): boolean => {
    return /^[0-9]{10}$/.test(value);
};

export const IsValidPan = (value: string): boolean => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
}

export const IsValidEmail = (value: string) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(value);
}

export const RELATIONSHIP = ['Son', 'Daughter', 'Spouse', 'Mother', 'Father', 'Brother', 'Sister', 'Nephew', 'Niece', 'Grand-Son', 'Grand-Daughter', 'Daughter-In-Law', 'Son-In-Law', 'Step-Son', 'Step-Daughter']
