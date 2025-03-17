import PDFDocument, { font, fontSize } from "pdfkit";
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
import { IAssetDistributionDetails, parseAssetDistributionDetails } from "../models/distributionDetails";
import { title } from "process";

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
        var benefeciaryDetails : IBeneficiary[] = parseBeneficiaries(userDetails?.beneficiaries || []);
        var assetDistributionDetails : IAssetDistributionDetails = parseAssetDistributionDetails(userDetails?.will_distribution || []);
        var addressDetails : IAddressDetails = safeParse(userDetails?.addressDetails);
        var petDetails = userDetails?.pets;
        var excludedPersons = userDetails?.excludedPersons;


        let distributionDetails;
        let residuaryDistributionDetails;

        //Get distribution data from corresponding table based on the type of distribution
        switch (assetDistributionDetails?.distributionType) {
            case DistributionType.SINGLE:
                distributionDetails = await getSingleBeneficiaryByUserIdService(userId);
                break;
        
            case DistributionType.SPECIFIC:
                distributionDetails = await getSpecificAssetDistributionService(userId);
                break;
        
            case DistributionType.PERCENTAGE:
                distributionDetails = await getPercentageAssetDistributionService(userId);
                break;
        
            default:
                throw new Error("Invalid distribution type");
        }
        residuaryDistributionDetails = await getResiduaryAssetDistributionService(userId);

        const PDFDocument = require("pdfkit-table");
        const doc = new PDFDocument({ margin: 50 });

        let salutaion = personalDetails?.gender == "Male" ? "Mr." : "Mrs.";
        const dob = new Date(personalDetails.dob);

        res.setHeader("Content-Disposition", 'inline; filename="LastWillAndTestament.pdf"');
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);

        doc.font("Times-Bold").fontSize(20).text("LAST WILL AND TESTAMENT OF", { align: "center",});
        doc.moveDown(1);
        doc.font("Times-Bold").fontSize(22).text(`${personalDetails?.fullName}`, { align: "center",  underline: true });
        doc.moveDown(2);

        doc.font("Times-Bold").fontSize(20).text(`PART-I: SELF DECLARATION`, { align: "center" });
        doc.moveDown(1);
        doc.font("Times-Roman").fontSize(16).text(`I, ${salutaion} ${personalDetails?.fullName}, S/o Mr. ${personalDetails?.fatherName}, born on ${dob.toLocaleString("en-US", { month: "long" })} ${dob.getDate()}, ${dob.getFullYear()}, holding Aadhaar Number as ${personalDetails?.aadhaarNumber}, Mobile Number as ${addressDetails?.phoneNumber} and currently residing at ${addressDetails?.address1}, ${addressDetails?.address2}, ${addressDetails?.city}, ${addressDetails?.state}, ${addressDetails?.pincode}, being of sound mind and memory, do hereby make, publish, and declare this to be my LAST WILL AND TESTAMENT for my assets in India and thereby revoking and making null and void any and all other last Will and Testaments and/or codicils to last Will and testaments heretofore made by me.`, { align: "left" });
        doc.font("Times-Roman").fontSize(16).text(`This Will shall be governed by the laws of India.`);
        doc.font("Times-Roman").fontSize(16).text(`All references herein to "this Will" refer only to this last Will and testament.`);
        doc.moveDown(2);

        doc.font("Times-Bold").fontSize(20).text(`PART-II: FAMILY`, { align: "center" });
        doc.moveDown(1);
        let wife = benefeciaryDetails?.find(b => b.data.relationship == "Wife") ?? "None";
        doc.font("Times-Roman").fontSize(16).text(`At the time of writing this Will, I am married to ${wife}, and I have following members in my family, whose details are as follows:`);

        doc.moveDown(1);
        let table = {
            headers: ["Name", "Relationship", "Date of Birth"],
            rows: benefeciaryDetails.map((b) => [
              b.data.fullName,
              b.data.relationship,
              new Date(b.data.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            ]),
          };

          doc.table(table, { 
            width: 500, 
            fontSize: 12, // Ensure fontSize is recognized
            cellPadding: 5, // Adjust cell padding for better spacing
            prepareHeader: () => doc.font("Times-Bold").fontSize(16), // Bold headers
            prepareRow: () => {
                doc.font("Times-Roman").fontSize(16); // Set font for rows
            },
            columns: [
                { width: 180 }, // Adjust widths as needed
                { width: 180 },
                { width: 140 }
            ],
            border: { 
                width: 1, 
                color: "#000000" // Set border color to black
            }
        });
        


        doc.moveDown(2);
        doc.addPage();
        doc.font("Times-Bold").fontSize(20).text(`PART-III: APPOINTMENT OF EXECUTOR`, { align: "center" });
        doc.moveDown(1);
        doc.font("Times-Roman").fontSize(16).text(`The powers and elective rights conferred by law or by any other provision of this Will and by me be exercised as often as required and without application to or approval by any court. I hereby appoint Mr. {} as my Primary Executor for all means and purposes with regards to the Will. He has his Mobile No. as {} and Email ID as {}.`);

        doc.moveDown(2);

        doc.font("Times-Bold").fontSize(20).text(`PART-IV: MOVABLE & IMMOVABLE ASSET DETAILS`, { align: "center" });
        doc.moveDown(1);

        let assets;
        const assetSubtypes = [
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
            "jewellery",
            "digital_assets",
            "intellectual_properties",
            "custom_assets"
        ]
        
        const subtypeHeaders = {
            bank_accounts: ["S. No", "Name of Bank", "Description"],
            fixed_deposits: ["S. No", "Name of Bank", "Description"],
            mutual_funds: ["S. No", "Name of Organisation", "Description"],
            provident_funds: ["S. No", "Type of Account", "Description"],
            vehicles: ["S. No", "Type of Vehicle", "Registration Details"],
            properties: ["S. No", "Type Of Property", "Address"],
            jewellery: ["S. No", "Type", "Quantity", "Description"],
            custom_assets: ["S. No", "Description"],
            default: ["S. No", "Category", "Details"]
        };
        
        const subtypeColumnSizes = {
            custom_assets: [50, 450],
            jewellery: [50, 75, 75, 300],
            default: [50, 150, 300]
        };
        
        assetSubtypes.forEach((subtype) => {
            let assets = assetDetails?.filter(a => a.subtype === subtype);
            if (assets && assets.length > 0) {
                doc.font("Times-Bold").fontSize(20).text(subtype.replace(/_/g, " ").toUpperCase(), { align: "center" });
                doc.moveDown(1);
        
                let headers = subtypeHeaders[subtype as keyof typeof subtypeHeaders] || subtypeHeaders.default;
                let columnsSize = subtypeColumnSizes[subtype as keyof typeof subtypeColumnSizes] || subtypeColumnSizes.default;

        
                let table = {
                    headers,
                    rows:  assets.map((a, index) => formatRowData(a, index, subtype))
                };
        
                doc.table(table, { 
                    width: 500, 
                    fontSize: 12, 
                    cellPadding: 5,
                    prepareHeader: () => doc.font("Times-Bold").fontSize(16), 
                    prepareRow: () => doc.font("Times-Roman").fontSize(16),
                    columnsSize,
                    border: { width: 1, color: "#000000" }
                });
        
                doc.moveDown(2);
                doc.addPage();

            }
        });        


        doc.font("Times-Bold").fontSize(20).text(`PART-V: SPECIFIC DEVOLVEMENT OF ASSETS`, { align: "center" });
        doc.moveDown(1);
        doc.font("Times-Roman").fontSize(16).text(`All the above-mentioned immovable and movable properties and the current assets listed in this Will of mine will cover the assets owned by me at the time of writing this Will, shall be devolved as:`);

        //TODO
        doc.moveDown(2);
        doc.font("Times-Bold").fontSize(20).text(`PART-VI: PRIMARY REMAINDER BENEFICIARIES`, { align: "center" });
        doc.moveDown(1);
        //TODO
        
        doc.font("Times-Roman").fontSize(16).text(`I, hereby, bequeath to the persons my residue and the remainder of my property and estate, tangible and intangible, immovable and movable, real, personal and mixed, of whatever nature and wherever situated, including all property. `);
        doc.moveDown(1);
        doc.font("Times-Roman").fontSize(16).text(`Or, I may acquire or receive or inherit any assets in future after writing this Will, shall be bequeathed in the following manner and proportions:`);

        doc.moveDown(2);
        doc.font("Times-Bold").fontSize(20).text(`PART-VII: LIABILITIES`, { align: "center" });
        //TODO
        


        doc.moveDown(3);
        doc.font("Times-Roman").fontSize(16);
        doc.text("______________________________", { align: "left", indent: 250 });
        doc.text("Signature", { align: "left", indent: 250 });
        doc.text(`()`, { align: "left", indent: 250 });
        doc.text("Date: __________________", { align: "left", indent: 250 });
        doc.text("Place: __________________", { align: "left", indent: 250 });

        doc.addPage();
        doc.font("Times-Bold").fontSize(20).text(`ATTESTATION BY WITNESSES`, { align: "center" });
        doc.moveDown(1);
        doc.font("Times-Roman").fontSize(16).text(`This last Will and testament, which has been separately signed by ${salutaion} ${personalDetails.fullName}, the testator, as on the date indicated below signed and declared by the above-named testator as his last Will and testament in the presence of each of us. We, in the presence of the testator and each other, at the testator's request, under penalty of perjury, hereby subscribe our names as witnesses to the declaration and execution of the last Will and testament by the testator, and we declare that, to the best of our knowledge, said testator is eighteen years of age or older, of sound mind and memory and under no constraint or undue influence.`);

        const witnessTable = {
            headers: [
                "Full Name of the Witness as per Aadhar/PAN Card", 
                "Signature of Witness", 
                "Date", 
                "Address"
            ],
            rows: [
            ]
        };
        doc.moveDown(2);

        
        doc.table(witnessTable, { 
            title: "Witness 1",
            width: 500,
            fontSize: 14,
            cellPadding: 5,
            prepareHeader: () => doc.font("Times-Bold").fontSize(14),
            prepareRow: () => doc.font("Times-Roman").fontSize(14),
            columns: [
                { width: 180 },
                { width: 120 },
                { width: 80 },
                { width: 180 }
            ]
        });

        doc.moveDown(5);

        doc.table(witnessTable, { 
            title: "Witness 2",
            width: 500,
            fontSize: 14,
            cellPadding: 5,
            prepareHeader: () => doc.font("Times-Bold").fontSize(14),
            prepareRow: () => doc.font("Times-Roman").fontSize(14),
            columns: [
                { width: 180 },
                { width: 120 },
                { width: 80 },
                { width: 180 }
            ]
        });
        doc.moveDown(5);

        

        doc.end();

    } catch (err) {
        console.error("Error generating PDF:", err);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
};

function centerText(doc: PDFKit.PDFDocument, text: string, fontSize: number) {
    const pageWidth = doc.page.width;
    const textWidth = doc.widthOfString(text);
    const xPosition = (pageWidth - textWidth) / 2;
    doc.font("Times-Bold").fontSize(fontSize).text(text, xPosition, doc.y);
}



function addPageNumber(doc: PDFKit.PDFDocument) {
    const pageNumber = doc.bufferedPageRange().count;
    doc.font("Times-Roman").fontSize(10).text(`Page ${pageNumber}`, doc.page.width / 2 - 20, doc.page.height - 50);
}


const formatRowData = (a: any, index: number, subtype: string): any[] => {
    switch (subtype) {
        case "bank_accounts":
            return [
                index + 1,
                a.data.bankName || "N/A", 
                `${a.data.accountType} Account, Account Number: ${maskAccountNumber(a.data.accountNumber)};\nBranch Address: ${a.data.branch}, ${a.data.city}`
            ];
        
        case "properties":
            return [
                index + 1,
                a.data.propertyType || "N/A",
                a.data.address || "N/A"
            ];

        case "vehicles":
            return [
                index + 1,
                a.data.type || "N/A",
                `${a.data.brandOrModel} with Registration Number: ${a.data.registrationNumber}`
            ];

        case "jewellery":
            return [
                index + 1,
                a.data.type || "N/A",
                a.data.weightInGrams || "N/A",
                `${a.data.description}`
            ];

        case "insurance_policies":
            return [
                index + 1,
                a.data.type || "N/A",
                `Company: ${a.data.insuranceProvider}, Policy Number: ${maskAccountNumber(a.data.policyNumber)}`
            ];

        case "mutual_funds":
            return [
                index + 1,
                a.data.fundName || "N/A",
                `${a.data.noOfHolders} Holder(s)`
            ];

        case "demat_accounts":
            return [
                index + 1,
                a.data.brokerName || "N/A",
                `Account Number: ${a.data.accountNumber}`
            ];

        case "digital_assets":
            return [
                index + 1,
                a.data.type || "N/A",
                `Wallet: ${a.data.walletAddress}`
            ];

        case "provident_funds":
            return [
                index + 1,
                a.data.type || "N/A",
                `Account Number: ${a.data.accountNumber}\nBranch Address: ${a.data.bankName},${a.data.branch},${a.data.city}`
            ];

        case "fixed_deposits":
            return [
                index + 1,
                a.data.bankName || "N/A",
                `${a.data.noOfHolders} Holder(s), Account number: ${maskAccountNumber(a.data.accountNumber)};\nBranch Address: ${a.data.branch},${a.data.city}`
            ];

        case "safety_deposit_boxes":
            return [
                index + 1,
                a.data.depositBoxType || "N/A",
                `${a.data.bankName},\nBranch Address: ${a.data.branch},${a.data.city}`
            ];
        
        case "pension_accounts":
            return [
                index + 1,
                a.data.bankName || "N/A",
                `Scheme Name: ${a.data.schemeName}`
            ];

        case "businesses":
            return [
                index + 1,
                a.data.type || "N/A",
                `Company Name: ${a.data.companyName},\nAddress: ${a.data.address}`
            ];

        case "bonds":
            return [
                index + 1,
                a.data.financialServiceProviderName || "N/A",
                `Ownership type: ${a.data.type},\nFolio Number: ${a.data.certificateNumber}`
            ];

        case "debentures":
            return [
                index + 1,
                a.data.type || "N/A",
                `Financial Provider: ${a.data.financialServiceProviderName},\nFolio Number: ${a.data.certificateNumber}`
            ];

            case "esops":
            return [
                index + 1,
                a.data.companyName || "N/A",
                `Vested: ${a.data.vestedEsops},\nUnvested: ${a.data.unvestedEsops}\n Units Granted: ${a.data.unitsGranted}`
            ];

        case "other_investments":
            return [
                index + 1,
                a.data.type || "N/A",
                `Financial Provider: ${a.data.financialServiceProviderName},\nFolio Number: ${a.data.certificateNumber}`
            ];

        case "custom_assets":
            return [
                index + 1,
                a.data.description || "N/A"
            ];

        default:
            return [
                index + 1,
                a.data.assetName || "N/A",
                a.data.details || "N/A"
            ];
    }
};

function maskAccountNumber(accountNumber: string): string {
    if (!accountNumber || accountNumber.length < 4) {
        return accountNumber;
    }
    return accountNumber.slice(-4).padStart(accountNumber.length, "x");
}