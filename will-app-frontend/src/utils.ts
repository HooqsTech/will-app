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

export const IsValidEmail = (value: string) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(value);
}
