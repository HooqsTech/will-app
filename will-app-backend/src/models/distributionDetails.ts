export interface IAssetDistributionDetails {
    userId: string;
    distributionType: "Percentage" | "Specific" | "Single"; // Add other possible values if needed
    residuaryDistributionType: "Single" | "Percentage"; // Add more options if applicable
    fallbackRule: string; // If this should be a number, change type to number
    createdAt: string; // Using string to store ISO date format
    updatedAt: string;
}

export function parseAssetDistributionDetails(data: any): IAssetDistributionDetails {
    return {
        userId: data.userid,  // Map to correct key
        distributionType: data.distributiontype,
        residuaryDistributionType: data.residuarydistributiontype,
        fallbackRule: data.fallbackrule,
        createdAt: data.createdat,
        updatedAt: data.updatedat
    };
}