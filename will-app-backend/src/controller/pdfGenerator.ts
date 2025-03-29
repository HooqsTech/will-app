import PDFDocument, { font, fontSize } from "pdfkit";
import PdfPrinter from "pdfmake";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import { Response, Request } from "express";
import { PrismaClient } from '@prisma/client';
import { UUID } from "crypto";
import { getUserByUserId, getUserDetailsByPhone, validUser } from "../services/userServices";
import { getAssetsByUserId } from "../services/assetService";
import { getBeneficiariesByUserIdService } from "../services/beneficiaryService";
import { getLiabilitiesByUserIdService } from "../services/liabilityService";
import { getPercentageAssetDistributionService, getResiduaryAssetDistributionService, getSingleBeneficiaryByUserIdService, getSpecificAssetDistributionService, getWillDistributionByUserIdService } from "../services/assetDistributionService";
import { DistributionType } from "../models/enums";
import { IAddressDetails, IPersonalDetails } from "../models/userDetails";
import { AssetSubtype, IAsset, parseAssets } from "../models/assetDetails";
import { IBeneficiary, parseBeneficiaries } from "../models/beneficiaryDetails";
import { IAssetDistributionDetails, ISplit, IUserAssetsPercentage, IUserAssetsSingle, IUserAssetsSpecific, parseAssetDistributionDetails, parseIUserAssetsSingle, parseUserAssetsPercentage } from "../models/distributionDetails";
import fs from "fs";
import { getExecutorsByUserIdService } from "../services/executorService";
import { ExecutorData, IExecutor, parseExecutors } from "../models/executorDetails";
import { getPDFVersioningByUserId, upsertPDFVersioning } from "../services/pdfVersioningService";
import { uploadFile } from "../services/uploadService";
import { Readable } from "stream";

const prisma = new PrismaClient();

function safeParse(json: any) {
    if (typeof json === "string") {
        try {
            return JSON.parse(json);
        } catch (error) {
            console.error("Invalid JSON string:", json);
            return null;
        }
    } else if (typeof json === "object" && json !== null) {
        return json; 
    } else {
        console.error("Invalid input type:", json);
        return null;
    }
}

export const generatePDF = async (req: Request, res: Response) => {
    try {
        const {userId} = req.body;

        if(!(await validUser(userId))){
            return res.status(400).json({ error: "Invalid User" });
        }
        var userDetails = await getUserByUserId(userId);
        const personalDetails : IPersonalDetails = safeParse(userDetails?.personalDetails);
        const assetDetails: IAsset[] = parseAssets(userDetails?.assets || []);
        var beneficiaryDetails : IBeneficiary[] = parseBeneficiaries(userDetails?.beneficiaries || []);
        var assetDistributionDetails : IAssetDistributionDetails = parseAssetDistributionDetails(userDetails?.will_distribution || []);
        var addressDetails : IAddressDetails = safeParse(userDetails?.addressDetails);
        var executor : IExecutor[] = parseExecutors(await getExecutorsByUserIdService(userId));
        var petDetails = userDetails?.pets;
        var excludedPersons = userDetails?.excludedPersons;
        let distributionDetails: any = null; 
        let residuaryDistributionDetails: any = null;

        switch (assetDistributionDetails?.distributionType) {
          case DistributionType.SINGLE:
            const singleResult = await getSingleBeneficiaryByUserIdService(userId);
            if (singleResult && Array.isArray(singleResult) && singleResult.length === 0) {
              console.error("Service returned an empty array instead of an object.");
            } else {
              distributionDetails = singleResult as IUserAssetsSingle; 
            }
            break;
        
          case DistributionType.SPECIFIC:
              const specificResult = await getSpecificAssetDistributionService(userId);
            if (specificResult && Array.isArray(specificResult) && specificResult.length === 0) {
              console.error("Service returned an empty array instead of an object.");
            } else {
              distributionDetails = specificResult as IUserAssetsSpecific; 
            }
            break;
      
          case DistributionType.PERCENTAGE:
              const percentageResult = await getPercentageAssetDistributionService(userId);
            if (percentageResult && Array.isArray(percentageResult) && percentageResult.length === 0) {
              console.error("Service returned an empty array instead of an object.");
            } else {
              distributionDetails = percentageResult as IUserAssetsPercentage;
            }
            break;
      
          default:
              throw new Error("Invalid distribution type");
        }
        residuaryDistributionDetails = await getResiduaryAssetDistributionService(userId);
        
        const fonts = {
        Times: {
            normal: "Times-Roman",
            bold: "Times-Bold",
            italics: "Times-Italic",
            bolditalics: "Times-BoldItalic",
        },
        };

        const printer = new PdfPrinter(fonts);

        const honorific = personalDetails?.gender === "Male" ? "Mr." : "Mrs.";
        const dob = new Date(personalDetails.dob);

        const content : any []= [
            { text: "LAST WILL AND TESTAMENT OF\n\n", style: "header", alignment: "center" },
            { text: personalDetails?.fullName, style: "title", alignment: "center", decoration: "underline" },
            { text: "\n\nPART-I: SELF DECLARATION\n", style: "subheader", alignment: "center" },
            {
            text: `I, ${honorific} ${personalDetails?.fullName}, S/o Mr. ${personalDetails?.fatherName}, born on ${dob.toLocaleString(
                "en-US",
                { month: "long" }
            )} ${dob.getDate()}, ${dob.getFullYear()}, holding Aadhaar Number as ${
                personalDetails?.aadhaarNumber
            }, Mobile Number as ${
                addressDetails?.phoneNumber
            } and currently residing at ${addressDetails?.address1}, ${addressDetails?.address2}, ${
                addressDetails?.city
            }, ${addressDetails?.state}, ${addressDetails?.pincode}, being of sound mind and memory, do hereby make, publish, and declare this to be my LAST WILL AND TESTAMENT for my assets in India and thereby revoking and making null and void any and all other last Will and Testaments and/or codicils to last Will and testaments heretofore made by me.`,
            style: "text",
            },
            { text: "This Will shall be governed by the laws of India.", style: "text" },
            { text: "\n\nPART-II: FAMILY\n", style: "subheader", alignment: "center" },
            {
            text: `At the time of writing this Will, I am married to ${
                beneficiaryDetails?.find((b) => b.data.relationship === "Wife")?.data.fullName ?? "None"
            }, and I have following members in my family, whose details are as follows:`,
            style: "text",
            },
            {
              table: {
                headerRows: 1,
                widths: ["10%", "*", "*", "*"], // Adjust column widths as needed
                body: [
                  // Headers with bold styling
                  [
                    { text: "S. No.", bold: true },
                    { text: "Name", bold: true },
                    { text: "Relationship", bold: true },
                    { text: "Date of Birth", bold: true }
                  ],
                  // Rows with indexing
                  ...beneficiaryDetails.map((b, index) => [
                    index + 1, // S. No.
                    b.data.fullName,
                    b.data.relationship,
                    new Date(b.data.dateOfBirth).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }),
                  ]),
                ],
              },
              style: "table",
            },
            { text: "\n\nPART-III: APPOINTMENT OF EXECUTOR\n", style: "subheader", alignment: "center" },
            {
            text: `The powers and elective rights conferred by law or by any other provision of this Will and by me be exercised as often as required and without application to or approval by any court. I hereby appoint ${executor[0].data.gender == "Male"? "Mr.": "Mrs."} ${executor[0].data.fullName} as my Primary Executor for all means and purposes with regards to the Will. He has his Mobile No. as ${executor[0].data.phoneNumber} and Email ID as ${executor[0].data.email}.`,
            style: "text",
            },
            { text: "\n\nPART-IV: MOVABLE & IMMOVABLE ASSET DETAILS\n", style: "subheader", alignment: "center" },

            ...[
            "properties",
            "bank_accounts",
            "fixed_deposits",
            "insurance_policies",
            "safety_deposit_boxes",
            "demat_accounts",
            "mutual_funds",
            "provident_funds",
            "pension_accounts",
            "businesses",
            "bonds",
            "debentures",
            "esops",
            "other_investments",
            "vehicles",
            "jewelleries",
            "digital_assets",
            "intellectual_property",
            "custom_assets"
            ].map((subtype) => {
            // Filter the assets for the current subtype
            const filteredAssets = assetDetails.filter((a) => a.subtype === subtype);

            if (filteredAssets.length === 0) return null; // Skip if no assets for this subtype
            // Get headers and row generation logic for the subtype
            const headers = getHeadersForSubtype(subtype).map(header => ({ text: header, bold: true })); 
            const rows = filteredAssets.map((a, index) => getRowForSubtype(subtype, a, index));

            return [
                { text: `\n${subtype.replace(/_/g, " ").toUpperCase()}\n`, style: "tableTitle", alignment: "center" },
                {
                table: {
                    headerRows: 1,
                    widths: headers.map(() => "*"), // Dynamic width based on number of columns
                    body: [headers, ...rows],
                },
                style: "table",
                },
            ];
            }).flat().filter(Boolean) // Flatten and filter out nulls

            ,
            { text: "\n\nPART-V: SPECIFIC DEVOLVEMENT OF ASSETS\n", style: "subheader", alignment: "center" },
            { text: "All the above-mentioned immovable and movable properties and the current assets listed in this Will of mine will cover the assets owned by me at the time of writing this Will, shall be devolved as:", style: "text" },
            [
              // Iterate over all subtypes and dynamically generate sections
              "Single",
              "Specific",
              "Percentage"
            ].map((distributionType) => {
              if (assetDistributionDetails.distributionType !== distributionType) return null;
            
              if (distributionType === "Single") {
                return [
                  {
                    text: `All the mentioned assets are assigned to ${beneficiaryDetails.find(
                      (b) => b.id === distributionDetails.primarybeneficiaryid
                    )?.data.fullName || "Unknown"} (100%).`,
                    style: "text",
                  },
                  {
                    text: `In case the above nominee is deceased, all the mentioned assets are assigned to ${beneficiaryDetails.find(
                      (b) => b.id === distributionDetails.secondarybeneficiaryid
                    )?.data.fullName || "Unknown"} (100%).`,
                    style: "text",
                  },
                  {
                    text: `In case the above nominee is deceased, all the mentioned assets are assigned to ${beneficiaryDetails.find(
                      (b) => b.id === distributionDetails.tertiarybeneficiaryid
                    )?.data.fullName || "Unknown"} (100%).`,
                    style: "text",
                  },
                ];
              } else if (distributionType === "Percentage") {
                
                const headers = [
                  { text: "Sl. No.", bold: true }, 
                  { text: "Beneficiary Name", bold: true }, 
                  { text: "Percentage Share", bold: true }
              ];
                const rows = distributionDetails.split.map((split: ISplit, index: number) => [
                  index + 1,
                  beneficiaryDetails.find((b) => b.id === split.beneficiaryId)?.data.fullName || "Unknown",
                  `${split.percentage} %`,
                ]);

                return [
                  {
                    text :  `All the above mentioned assets will be assigned to the following beneficiaries in the mentioned percentage of distribution.`
                  },
                  {
                    table: {
                      headerRows: 1,
                      widths: ["20%", "50%", "30%"], 
                      body: [headers, ...rows],
                    },
                    style: "table",
                  },
                ];
              } else if (distributionType === "Specific") {
                const headers = [
                  { text: "Sl. No.", bold: true }, 
                  { text: "Beneficiary Name", bold: true }, 
                  { text: "Percentage Share", bold: true }
              ];
                const rows = getRowsForSpecificDistribution(distributionDetails, assetDetails, beneficiaryDetails);
            
                return [
                  {
                    table: {
                      headerRows: 1,
                      widths: ["20%", "40%", "40%"], 
                      body: [headers, ...rows],
                    },
                    style: "table",
                  },
                ];
              }
            
              return null;
            })
              .flat()
              .filter(Boolean)
                  ,
            { text: "\n\nPART-VI: PRIMARY REMAINDER BENEFICIARIES\n", style: "subheader", alignment: "center" },
            { text: "I, hereby, bequeath to the persons my residue and the remainder of my property and estate, tangible and intangible, immovable and movable, real, personal and mixed, of whatever nature and wherever situated, including all property. ", style: "text" },
            { text: "\nOr, I may acquire or receive or inherit any assets in future after writing this Will, shall be bequeathed in the following manner and proportions:", style: "text" },
            { text : "\n"},
            (() => {
              const headers = [
                { text: "Sl. No.", bold: true }, 
                { text: "Beneficiary Name", bold: true }, 
                { text: "Percentage Share", bold: true }
            ];              
              const rows = residuaryDistributionDetails.split.map((split: ISplit, index: number) => [
                  index + 1,
                  beneficiaryDetails.find((b) => b.id === split.beneficiaryId)?.data.fullName || "Unknown",
                  `${split.percentage} %`,
              ]);
          
              return [
                  { 
                      text: "All the above mentioned assets will be assigned to the following beneficiaries in the mentioned percentage of distribution." 
                  },
                  {
                      table: {
                          headerRows: 1,
                          widths: ["20%", "50%", "30%"],
                          body: [headers, ...rows],
                      },
                      style: "table",
                  },
              ];
          })(),
            { text: "\n\nPART-VII: LIABILITIES\n", style: "subheader", alignment: "center" },
            ...[
                // Iterate over all subtypes and dynamically generate sections
                "home_loan",
                "personal_loan",
                "vechicle_loan",
                "education_loan",
                "other_liabilities"
                ].map((subtype) => {
                    try{
                        // Filter the assets for the current subtype
                        const filteredAssets = assetDetails.filter((a) => a.subtype === subtype);
                            
                        if (filteredAssets.length === 0) return null; // Skip if no assets for this subtype

                        // Get headers and row generation logic for the subtype
                        const headers = getHeadersForSubtype(subtype).map(header => ({ text: header, bold: true })); 
                        const rows = filteredAssets.map((a, index) => getRowForSubtype(subtype, a, index));

                        return [
                            { text: `\n${subtype.replace(/_/g, " ").toUpperCase()}\n`, style: "tableTitle", alignment: "center" },
                            {
                            table: {
                                headerRows: 1,
                                widths: headers.map(() => "*"), // Dynamic width based on number of columns
                                body: [headers, ...rows],
                            },
                            style: "table",
                            },
                        ];
                    }
                    catch(error){
                        console.log(subtype);
                        console.log(error);
                    }
                
                }).flat().filter(Boolean) // Flatten and filter out nulls
            ,
            {text: "\n\n"},
            {text: "IN WITNESS WHEREOF, I, the undersigned testator, declare that I sign and execute this instrument on the date written below as my last Will and testament. This Will deed shall come into effect post my demise also I reserve the right to revoke/ cancel/ alter this Will deed any time during my lifetime. Further, I declare that I sign it willingly, that I execute it as my free and voluntary act for the purposes expressed in this document, and that I am above 18 years of age, of sound mind and memory, and under no constraint or undue influence."},
            {text: "\n\n"},
            {
            text: "______________________________",
            margin: [250, 20, 0, 0],
            alignment: "left",
            },
            { text: "Signature", margin: [250, 5, 0, 0], alignment: "left", style: "text" },
            { text: `(${honorific} ${personalDetails?.fullName})`, margin: [250, 5, 0, 0], alignment: "left", style: "text" },

            {
                text: "Date: ______________________",
                margin: [250, 20, 0, 0],
                alignment: "left",
                },
            {
                text: "Place: ______________________",
                margin: [250, 20, 0, 0],
                alignment: "left",
                },
            { text: "", pageBreak: "after" },
            { text: "ATTESTATION BY WITNESSES\n", style: "subheader", alignment: "center" },
            { text: `This last Will and testament, which has been separately signed by ${honorific} ${personalDetails.fullName}, the testator, as on the date indicated below signed and declared by the above-named testator as his last Will and testament in the presence of each of us. We, in the presence of the testator and each other, at the testator's request, under penalty of perjury, hereby subscribe our names as witnesses to the declaration and execution of the last Will and testament by the testator, and we declare that, to the best of our knowledge, said testator is eighteen years of age or older, of sound mind and memory and under no constraint or undue influence.`},
            { text: "\n\nWITNESSES 1\n\n\n", alignment: "center", bold: true},
            { text: "Full Name of the Witness as per Aadhar/PAN Card:\n\n\n\n", alignment: "left"},
            { text: "Signature of Witness:\n\n\n\n", alignment: "left"},
            { text: "Date:\n\n\n\n", alignment: "left"},
            { text: "Address:\n\n\n\n", alignment: "left"},

            { text: "\n\n\nWITNESSES 2\n\n\n", alignment: "center", bold: true},   
            { text: "Full Name of the Witness as per Aadhar/PAN Card:\n\n\n\n", alignment: "left"},
            { text: "Signature of Witness:\n\n\n\n", alignment: "left"},
            { text: "Date:\n\n\n\n", alignment: "left"},
            { text: "Address:\n\n\n\n", alignment: "left"},
        ];

        const docDefinition: TDocumentDefinitions = {
            content,

        styles: {
            header: { fontSize: 18, bold: true },
            title: { fontSize: 20, bold: true },
            subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 10] },
            tableTitle: { fontSize: 14, bold: true, margin: [0, 10, 0, 10] },
            text: { fontSize: 12 },
            table: { margin: [0, 5, 0, 15] }
        },
        defaultStyle: {
            font: "Times",
        },
        footer: function (currentPage, pageCount) {
          return {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "center",
            margin: [0, 10, 0, 0],
          };
        },
        };
        
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        
        let currentVersion = 1; 
        const pdfVersioning = await getPDFVersioningByUserId(userId);
        if (pdfVersioning) {
            currentVersion = pdfVersioning.latestversion + 1; // Increment the current version
        }
        const fileName = `${userDetails?.personalDetails?.fullName}_V${currentVersion}.pdf`;
        const filePath = `./${fileName}`;

        res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
        res.setHeader("Content-Type", "application/pdf");

        pdfDoc.pipe(res);


        const writeStream = fs.createWriteStream(filePath);
        pdfDoc.pipe(writeStream);
        pdfDoc.end();

        writeStream.on("finish", async () => {
          await upsertPDFVersioning(userId, filePath);
      });

    //   let currentVersion = 1; // Default version
    //   const pdfVersioning = await getPDFVersioningByUserId(userId);
    //   if (pdfVersioning) {
    //       currentVersion = pdfVersioning.latestversion + 1; // Increment the version
    //   }

    //   const fileName = `${userDetails?.personalDetails?.fullName}_V${currentVersion}.pdf`;
    //   const filePath = `./${fileName}`;

    //   // Write the PDF to a temporary file
    //   const bufferStream = fs.createWriteStream(filePath);
    //   pdfDoc.pipe(bufferStream);
    //   pdfDoc.end();

    //   // Wait for the file stream to finish writing
    //   await new Promise<void>((resolve, reject) => {
    //     bufferStream.on("finish", () => resolve());
    //     bufferStream.on("error", (err) => reject(err));
    // });
    

    //   const publicUrl = await uploadFile(userId, fileName, fs.createReadStream(filePath));

    //   await upsertPDFVersioning(userId, publicUrl);

    //   console.log("File uploaded:", publicUrl);

    //   res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    //   res.setHeader("Content-Type", "application/pdf");

    //   const readStream = fs.createReadStream(filePath);
    //   readStream.pipe(res);

    //   readStream.on("end", () => {
    //       fs.unlinkSync(filePath);
    //   });

    //   readStream.on("error", (err) => {
    //       console.error("Error reading file:", err);
    //       fs.unlinkSync(filePath); // Ensure cleanup on error
    //   });


    } catch (err) {
        console.error("Error generating PDF:", err);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
};


function maskAccountNumber(accountNumber: string): string {
    if (!accountNumber || accountNumber.length < 4) {
        return accountNumber;
    }
    return accountNumber.slice(-4).padStart(accountNumber.length, "x");
}

function getHeadersForSubtype(subtype: string): string[] {
    const headersMap = {
      bank_accounts: ["S. No", "Name of Bank", "Description"],
      fixed_deposits: ["S. No", "Name of Bank", "Description"],
      mutual_funds: ["S. No", "Name of Organisation", "Description"],
      provident_funds: ["S. No", "Type of Account", "Description"],
      vehicles: ["S. No", "Type of Vehicle", "Registration Details"],
      properties: ["S. No", "Type Of Property", "Address"],
      jewelleries: ["S. No", "Type", "Quantity", "Description"],
      custom_assets: ["S. No", "Description"],
      home_loan: ["S. No", "Name of Bank", "Amount", "Description"],
      vechicle_loan: ["S. No", "Name of Bank", "Amount", "Description"],
      personal_loan: ["S. No", "Name of Bank", "Amount", "Description"],
      education_loan: ["S. No", "Name of Bank", "Amount"],
      other_liabilities: ["S. No", "Amount", "Description"],
      default: ["S. No", "Category", "Details"]
    };
  
    return headersMap[subtype as keyof typeof headersMap] || headersMap.default;
  }
  
  
  // Returns the table row for each subtype
  function getRowForSubtype(subtype: string, asset: any, index: number): any[] {
    switch (subtype) {
      case "bank_accounts":
        return [
          index + 1,
          asset.data.bankName || "N/A",
          `${asset.data.accountType} Account, Account Number: ${maskAccountNumber(asset.data.accountNumber)};\nBranch Address: ${asset.data.branch}, ${asset.data.city}`,
        ];
      case "properties":
        return [
          index + 1,
          asset.data.propertyType || "N/A",
          asset.data.address || "N/A",
        ];
      case "vehicles":
        return [
          index + 1,
          asset.data.type || "N/A",
          `${asset.data.brandOrModel} with Registration Number: ${asset.data.registrationNumber}`,
        ];
      case "jewelleries":
        return [
          index + 1,
          asset.data.type || "N/A",
          asset.data.weightInGrams || "N/A",
          asset.data.description || "N/A",
        ];
      case "insurance_policies":
        return [
          index + 1,
          asset.data.type || "N/A",
          `Company: ${asset.data.insuranceProvider}, Policy Number: ${maskAccountNumber(asset.data.policyNumber)}`,
        ];
      case "mutual_funds":
        return [
          index + 1,
          asset.data.fundName || "N/A",
          `${asset.data.noOfHolders} Holder(s)`,
        ];
      case "demat_accounts":
        return [
          index + 1,
          asset.data.brokerName || "N/A",
          `Account Number: ${asset.data.accountNumber}`,
        ];
      case "digital_assets":
        return [
          index + 1,
          asset.data.type || "N/A",
          `Wallet: ${asset.data.walletAddress}`,
        ];
      case "provident_funds":
        return [
          index + 1,
          asset.data.type || "N/A",
          `Account Number: ${asset.data.accountNumber}\nBranch Address: ${asset.data.bankName},${asset.data.branch},${asset.data.city}`,
        ];
      case "fixed_deposits":
        return [
          index + 1,
          asset.data.bankName || "N/A",
          `${asset.data.noOfHolders} Holder(s), Account number: ${maskAccountNumber(asset.data.accountNumber)};\nBranch Address: ${asset.data.branch},${asset.data.city}`,
        ];
      case "safety_deposit_boxes":
        return [
          index + 1,
          asset.data.depositBoxType || "N/A",
          `${asset.data.bankName},\nBranch Address: ${asset.data.branch},${asset.data.city}`,
        ];
      case "pension_accounts":
        return [
          index + 1,
          asset.data.bankName || "N/A",
          `Scheme Name: ${asset.data.schemeName}`,
        ];
      case "businesses":
        return [
          index + 1,
          asset.data.type || "N/A",
          `Company Name: ${asset.data.companyName},\nAddress: ${asset.data.address}`,
        ];
      case "bonds":
        return [
          index + 1,
          asset.data.financialServiceProviderName || "N/A",
          `Ownership type: ${asset.data.type},\nFolio Number: ${asset.data.certificateNumber}`,
        ];
      case "debentures":
        return [
          index + 1,
          asset.data.type || "N/A",
          `Financial Provider: ${asset.data.financialServiceProviderName},\nFolio Number: ${asset.data.certificateNumber}`,
        ];
      case "esops":
        return [
          index + 1,
          asset.data.companyName || "N/A",
          `Vested: ${asset.data.noOfVestedEscops},\nUnvested: ${asset.data.noOfUnVestedEscops}\nUnits Granted: ${asset.data.noOfUnitGranted}`,
        ];
      case "other_investments":
        return [
          index + 1,
          asset.data.type || "N/A",
          `Financial Provider: ${asset.data.financialServiceProviderName},\nFolio Number: ${asset.data.certificateNumber}`,
        ];
      case "intellectual_property":
        return [
          index + 1,
          asset.data.type || "N/A",
          `ID: ${asset.data.identificationNumber},\nDescription: ${asset.data.description}`,
        ];

    case "custom_assets":
        return [index + 1, asset.data.description || "N/A"];
        case "personal_loan":
            return [
                index + 1, 
                asset.data.nameOfBank || "N/A",
                asset.data.loanAmount || "N/A",
                `Account Number: ${asset.data.description}` || "N/A",
            ];
    case "home_loan":
      return [
          index + 1, 
          asset.data.nameOfBank || "N/A",
          asset.data.loanAmount || "N/A",
          `Account Number: ${asset.data.accountNumber}` || "N/A",
      ];
    case "vechicle_loan":
        return [
            index + 1, 
            asset.data.nameOfBank || "N/A",
            asset.data.loanAmount || "N/A",
            `Account Number: ${asset.data.accountNumber}` || "N/A",
        ];
    case "education_loan":
        return [
            index + 1, 
            asset.data.nameOfBank || "N/A",
            `Account Number: ${asset.data.loanAmount}` || "N/A"
        ];
    case "other_liabilities":
        return [
            index + 1, 
            asset.data.loanAmount || "N/A",
            `Lender Name: ${asset.data.nameOfBank} Account Number: ${asset.data.loanAmount}\n ${asset.data.description}`  || "N/A",
        ];

      default:
        return [index + 1, asset.subtype || "N/A", "N/A"];
    }
  }

  function getRowsForSpecificDistribution(
    distributionDetails: IUserAssetsSpecific,
    assets: IAsset[],
    beneficiaries: IBeneficiary[]
  ): (string | number)[][] {
    if (!assets || !distributionDetails) {
      return [];
    }
  
    return assets
      .filter((asset) => asset.type !== "liabilities") // Exclude liabilities
      .map((asset, index) => {
        // Find the split details for the current asset
        const assetSplitDetails = distributionDetails.assets.find(
          (distAsset) => distAsset.asset_id === asset.id
        );

        const beneficiaryDetails = assetSplitDetails?.beneficiarieslist
          .map((splitDetail) => {
            const beneficiary = beneficiaries.find((b) => b.id === splitDetail.beneficiaryId);
            return beneficiary
              ? `${beneficiary.data.fullName || "Unknown"} (${splitDetail.percentage}%)`
              : "Unknown Beneficiary";
          })
          .join(", ") || "No Beneficiaries Assigned";
  
        // Handle asset data based on subtype
        let assetDetails: string;
        switch (asset.subtype) {
          case "properties":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.propertyType || "N/A"}`;
            break;
        
          case "vehicles":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.type || "N/A"}`;
            break;
        
          case "jewelleries":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.type || "N/A"}`;
            break;
        
          case "insurance_policies":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.type || "N/A"}`;
            break;
        
          case "mutual_funds":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.fundName || "N/A"}`;
            break;
        
          case "demat_accounts":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.brokerName || "N/A"}`;
            break;
        
          case "digital_assets":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.type || "N/A"}`;
            break;
        
          case "provident_funds":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.type || "N/A"}`;
            break;
        
          case "fixed_deposits":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.bankName || "N/A"}`;
            break;
        
          case "safety_deposit_boxes":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.depositBoxType || "N/A"}`;
            break;
        
          case "pension_accounts":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.bankName || "N/A"}`;
            break;
        
          case "businesses":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.type || "N/A"}`;
            break;
        
          case "bonds":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.financialServiceProviderName || "N/A"}`;
            break;
        
          case "debentures":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.type || "N/A"}`;
            break;
        
          case "esops":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.companyName || "N/A"}`;
            break;
        
          case "other_investments":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.type || "N/A"}`;
            break;
        
          case "intellectual_property":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.type || "N/A"}`;
            break;
        
          case "custom_assets":
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: ${asset.data.description || "N/A"}`;
            break;
        
          default:
            assetDetails = `${asset.subtype.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}: N/A`;
            break;
        }
        // Construct the row
        return [index + 1, assetDetails, beneficiaryDetails];
      });
  }
  

