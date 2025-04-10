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
        userId: data.userid, 
        distributionType: data.distributiontype,
        residuaryDistributionType: data.residuarydistributiontype,
        fallbackRule: data.fallbackrule,
        createdAt: data.createdat,
        updatedAt: data.updatedat
    };
}

export interface ISplit {
    percentage: number; 
    beneficiaryId: string; 
    beneficiaryName: string;
  }

export  interface IAsset {
    beneficiarieslist: ISplit[]; 
    asset_id: string; 
  }
  
  export interface IUserAssetsSpecific {
    userid: string;
    assets: IAsset[];
    createdat: Date | null;
    updatedat: Date | null;
}

export interface IUserAssetsPercentage {
    userid: string;
    split: ISplit[];
    createdat: Date | null;
    updatedat: Date | null;
}

export interface IUserResiduaryAssets {
    userid: string;
    split: ISplit[];
    createdat: Date | null;
    updatedat: Date | null;
}

export interface ILiabilityDistribution {
  userid: string;
  beneficiaries: IAsset[];
  createdat: Date | null;
  updatedat: Date | null;
}

export interface IUserAssetsSingle {
  userid: string;
  primarybeneficiaryid: string | null;
  secondarybeneficiaryid: string | null;
  tertiarybeneficiaryid: string | null;
  createdat: Date | null; 
  updatedat: Date | null; 
}



  export function parseUserAssetsSpecific(jsonString: string): IUserAssetsSpecific {
    try {
      const parsedObject = JSON.parse(jsonString);
  
      const userAssets: IUserAssetsSpecific = {
        userid: parsedObject.userid,
        assets: parsedObject.assets.map((asset: any) => ({
          asset_id: asset.asset_id,
          split: asset.split.map((split: any) => ({
            percentage: split.percentage,
            beneficiary_id: split.beneficiary_id,
          })),
        })),
        createdat: parsedObject.createdat,
        updatedat: parsedObject.updatedat,
      };
  
      return userAssets;
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error}`);
    }
  }

  export function parseLiabilitiyDistribution(jsonString: string): ILiabilityDistribution {
    try {
      const parsedObject = JSON.parse(jsonString);
  
      const liabilityDistribution: ILiabilityDistribution = {
        userid: parsedObject.userid,
        beneficiaries: parsedObject.assets.map((asset: any) => ({
          asset_id: asset.asset_id,
          split: asset.split.map((split: any) => ({
            percentage: split.percentage,
            beneficiary_id: split.beneficiary_id,
          })),
        })),
        createdat: parsedObject.createdat,
        updatedat: parsedObject.updatedat,
      };
  
      return liabilityDistribution;
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error}`);
    }
  }

// Function to parse JSON string into IUserResiduaryAssets
export function parseUserResiduaryAssets(jsonString: string): IUserResiduaryAssets {
  try {
    const parsedObject = JSON.parse(jsonString);

    const userResiduaryAssets: IUserResiduaryAssets = {
      userid: parsedObject.userid,
      split: parsedObject.split.map((split: any) => ({
        percentage: split.percentage,
        beneficiary_id: split.beneficiary_id,
      })),
      createdat: parsedObject.createdat,
      updatedat: parsedObject.updatedat,
    };

    return userResiduaryAssets;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`);
  }
}

// Function to parse JSON string into IUserAssetsPercentage
export function parseUserAssetsPercentage(jsonString: string ): IUserAssetsPercentage {
  try {
    const parsedObject = JSON.parse(jsonString);

    const userAssetsPercentage: IUserAssetsPercentage = {
      userid: parsedObject.userid,
      split: parsedObject.split.map((split: any) => ({
        percentage: split.percentage,
        beneficiary_id: split.beneficiary_id,
      })),
      createdat: parsedObject.createdat,
      updatedat: parsedObject.updatedat,
    };

    return userAssetsPercentage;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`);
  }
}

// Function to parse JSON string into IUserAssetsPercentage
export function parseUserAssetsSingle(jsonString: string): IUserAssetsPercentage {
  try {
    const parsedObject = JSON.parse(jsonString);

    const userAssetsPercentage: IUserAssetsPercentage = {
      userid: parsedObject.userid,
      split: parsedObject.split.map((split: any) => ({
        percentage: split.percentage,
        beneficiary_id: split.beneficiary_id,
      })),
      createdat: parsedObject.createdat,
      updatedat: parsedObject.updatedat,
    };

    return userAssetsPercentage;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`);
  }
}

export function parseIUserAssetsSingle(jsonString: string): IUserAssetsSingle {
  try {
    const parsedObject = JSON.parse(jsonString);

    const userAssetsSingle: IUserAssetsSingle = {
      userid: parsedObject.userid,
      primarybeneficiaryid: parsedObject.primarybeneficiaryid,
      secondarybeneficiaryid: parsedObject.secondarybeneficiaryid,
      tertiarybeneficiaryid: parsedObject.tertiarybeneficiaryid,
      createdat: parsedObject.createdat,
      updatedat: parsedObject.updatedat,
    };

    return userAssetsSingle;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`);
  }
}