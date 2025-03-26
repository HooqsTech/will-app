export const IsEmptyString = (value?: string) => {
    return value === "" || value === null || value === undefined;
}

export const IsEmptyNumber = (value: number | undefined | null) => {
    return value === null || value === undefined;
}

export const IsValidEmail = (value: string) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(value);
}
