import PdfPrinter from "pdfmake";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import { Response, Request } from "express";
import { PrismaClient } from '@prisma/client';
import { getUserByUserId, validUser } from "../services/userServices";
import { getPercentageAssetDistributionService, getResiduaryAssetDistributionService, getSingleBeneficiaryByUserIdService, getSpecificAssetDistributionService } from "../services/assetDistributionService";
import { DistributionType } from "../models/enums";
import { IAddressDetails, IPersonalDetails } from "../models/userDetails";
import { IAsset, parseAssets } from "../models/assetDetails";
import { IBeneficiary, parseBeneficiaries } from "../models/beneficiaryDetails";
import { IAssetDistributionDetails, ISplit, IUserAssetsPercentage, IUserAssetsSingle, IUserAssetsSpecific, parseAssetDistributionDetails } from "../models/distributionDetails";
import fs from "fs";
import { getExecutorsByUserIdService } from "../services/executorService";
import { IExecutor, parseExecutors } from "../models/executorDetails";
import { getPDFVersioningByUserId, upsertPDFVersioning } from "../services/pdfVersioningService";
import { uploadFile } from "../services/uploadService";
import { IExcludedPerson, parseExcludedPersons } from "../models/excludedPersonDetails";
import { getLiabilityDistributionService } from "../services/liabilityDistributionService";

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
        const beneficiaryDetails: IBeneficiary[] = parseBeneficiaries(userDetails?.beneficiaries || []);

        var assetDistributionDetails : IAssetDistributionDetails = parseAssetDistributionDetails(userDetails?.will_distribution || []);
        var addressDetails : IAddressDetails = safeParse(userDetails?.addressDetails);
        var executor : IExecutor[] = parseExecutors(await getExecutorsByUserIdService(userId));
        var excludedPersons : IExcludedPerson[] = parseExcludedPersons(userDetails?.excludedPersons  || []);
        let distributionDetails: any = null; 
        let residuaryDistributionDetails: any = null; 
        let liabilityDistributionDetails = await getLiabilityDistributionService(userId);

        const honorific = personalDetails?.gender === "Male" ? "Mr." : "Mrs.";

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

        
        const dob = new Date(personalDetails.dob);
        const content : any []= [
            { text: "LAST WILL AND TESTAMENT OF\n\n", style: "header", alignment: "center" },
            { text: `${honorific} ${personalDetails?.fullName}`, style: "title", alignment: "center", decoration: "underline" },
            { text: "\n\nPART-I: SELF DECLARATION\n", style: "subheader", alignment: "center" },
            {
            text: `I, ${honorific} ${personalDetails?.fullName}, ${personalDetails?.gender === "Male" ? "S/o" : "D/o"} Mr. ${personalDetails?.fatherName}, born on ${dob.toLocaleString(
                "en-IN", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "Asia/Kolkata",
            })}, holding Aadhaar Number as ${
                addSpaceEveryNChars(personalDetails?.aadhaarNumber, 4)
            }, Mobile Number as ${
                addressDetails?.phoneNumber
            } and currently residing at ${addressDetails?.address1}, ${addressDetails?.address2}, ${
                addressDetails?.city
            }, ${addressDetails?.state}, ${addressDetails?.pincode}, being of sound mind and memory, do hereby make, publish, and declare this to be my LAST WILL AND TESTAMENT for my assets in India and thereby revoking and making null and void any and all other last Will and Testaments and/or codicils to last Will and testaments heretofore made by me.`,
            style: "text",
                        },
            { text: "This Will shall be governed by the laws of India.", style: "text",
              },
            { text: "All references herein to \"this Will\" refer only to this last Will and testament.", style: "text",
               },
            { text: "\n\nPART-II: BENERFICIARIES\n", style: "subheader", alignment: "center" },
            [
              {
                text: `At the time of writing this Will, I am married to ${
                  beneficiaryDetails.find((b) =>
                    b.data?.relationship.toLowerCase().trim() === "spouse"
                  )?.data.fullName ?? "None"
                }, and I have the following members in my beneficiary section, whose details are as follows:`,
                style: "text",
              },
            
              {
                text: "\n\FAMILY\n",
                style: "subheader",
                alignment: "center",
              },
              {
                table: {
                  headerRows: 1,
                  widths: ["10%", "*", "*", "*"],
                  body: [
                    [
                      { text: "S. No.", bold: true },
                      { text: "Name", bold: true },
                      { text: "Relationship", bold: true },
                      { text: "Date of Birth", bold: true },
                    ],
                    ...beneficiaryDetails.filter(b => b.data?.type === "Person").map((b, index) => [
                      index + 1,
                      b.data.fullName || "N/A",
                      b.data.relationship || "N/A",
                      b.data.dateOfBirth
                        ? new Date(b.data.dateOfBirth).toLocaleDateString("en-IN", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            timeZone: "Asia/Kolkata",
                          })
                        : "N/A",
                    ]),
                  ],
                },
                style: "table",
              },
            
              ...(beneficiaryDetails.filter(b => b.data?.type === "Charity").length > 0
                ? [
                    {
                      text: "\n\nCHARITY DETAILS\n",
                      style: "subheader",
                      alignment: "center",
                    },
                    {
                      table: {
                        headerRows: 1,
                        widths: ["10%", "*", "*", "*"],
                        body: [
                          [
                            { text: "S. No.", bold: true },
                            { text: "Organization", bold: true },
                            { text: "Charity Type", bold: true },
                            { text: "Donation Amount", bold: true },
                          ],
                          ...beneficiaryDetails.filter(b => b.data?.type === "Charity").map((b, index) => [
                            index + 1,
                            b.data.organization || b.data.otherOrganization || "N/A",
                            b.data.charityType || "N/A",
                            b.data.donationAmount?.toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }) ?? "N/A",
                          ]),
                        ],
                      },
                      style: "table",
                    },
                  ]
                : []),
            ],
            {
              text: "\n\nPART-III: APPOINTMENT OF EXECUTOR\n",
              style: "subheader",
              alignment: "center",
            },
            {
              text: [
                `The powers and elective rights conferred by law or by any other provision of this Will and by me be exercised as often as required and without application to or approval by any court. I hereby appoint `,
                { text: `${executor[0].data.gender === "Male" ? "Mr." : "Mrs."} ${executor[0].data.fullName}`, bold: true },
                ` as my Primary Executor for all means and purposes with regards to the Will. `,
                `He has his Mobile No. as `,
                { text: `${executor[0].data.phoneNumber}`, italics: true },
                ` and Email ID as `,
                { text: `${executor[0].data.email}`, italics: true },
                `.`
              ],
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
                  "escops",
                  "other_investments",
                  "vehicles",
                  "jewelleries",
                  "digital_assets",
                  "intellectual_property",
                  "pets",
                  "art_works",
                  "custom_assets"
                ].map((subtype) => {
                  const filteredAssets = assetDetails.filter((a) => a.subtype === subtype);
                  if (filteredAssets.length === 0) return null;
              
                  const headers = getHeadersForSubtype(subtype).map(header => ({ text: header, bold: true }));
                  const rows = filteredAssets.map((a, index) =>
                    getRowForSubtype(subtype, a, index, liabilityDistributionDetails, beneficiaryDetails)
                  );
              
                  return  [
                      {
                        text: `\n${getTitleForSubtype(subtype)}\n`,
                        style: "tableTitle",
                        alignment: "center",
                      },
                      {
                        table: {
                          headerRows: 1,
                          widths: ["10%", ...headers.slice(1).map(() => "*")],
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
                    text: `All the mentioned assets are assigned to ${
                      (() => {
                        const b = beneficiaryDetails.find(
                          (b) => b.id === distributionDetails.primarybeneficiaryid
                        );
                        if (!b) return "Unknown";
                        return b.data?.type === "Charity" ? b.data?.organization : b.data?.fullName || "Unknown";
                      })()
                    } (100%).`,
                    style: "text",
                                      },
                  {
                    text: `In case the above nominee is deceased, all the mentioned assets are assigned to ${
                      (() => {
                        const b = beneficiaryDetails.find(
                          (b) => b.id === distributionDetails.primarybeneficiaryid
                        );
                        if (!b) return "Unknown";
                        return b.data?.type === "Charity" ? b.data?.organization : b.data?.fullName || "Unknown";
                      })()
                    } (100%).`,
                    style: "text",
                                      },
                  {
                    text: `In case the above nominee is deceased, all the mentioned assets are assigned to ${
                      (() => {
                        const b = beneficiaryDetails.find(
                          (b) => b.id === distributionDetails.primarybeneficiaryid
                        );
                        if (!b) return "Unknown";
                        return b.data?.type === "Charity" ? b.data?.organization : b.data?.fullName || "Unknown";
                      })()
                    } (100%).`,
                    style: "text",
                                      },
                ];
              } else if (distributionType === "Percentage") {
                
                const headers = [
                  { text: "Sl. No.", bold: true }, 
                  { text: "Beneficiary Name", bold: true }, 
                  { text: "Percentage Share", bold: true }
              ];
              const rows = distributionDetails.split.map((split: ISplit, index: number) => {
                const beneficiary = beneficiaryDetails.find((b) => b.id === split.beneficiaryId);
                const name =
                  beneficiary?.data?.type === "Charity"
                    ? beneficiary.data?.organization
                    : beneficiary?.data?.fullName || "Unknown";
              
                return [
                  index + 1,
                  name,
                  `${split.percentage} %`,
                ];
              });

                return [
                  {
                    text :  `All the above mentioned assets will be assigned to the following beneficiaries in the mentioned percentage of distribution.`
                                      },
                  {
                    table: {
                      headerRows: 1,
                      widths: ["10%", "50%", "40%"], 
                      body: [headers, ...rows],
                    },
                    style: "table",
                  },
                ];
              } else if (distributionType === "Specific") {
                const headers = [
                  { text: "Sl. No.", bold: true }, 
                  { text: "Asset", bold: true }, 
                  { text: "Percentage Share", bold: true }
              ];
                const rows = getRowsForSpecificDistribution(distributionDetails, assetDetails, beneficiaryDetails);
                return [
                  {
                    table: {
                      headerRows: 1,
                      widths: ["10%", "40%", "50%"], 
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
                  {
                    unbreakable: true,
                    stack: [
                      { 
                        text: "\n\nPART-VI: PRIMARY REMAINDER BENEFICIARIES\n", 
                        style: "subheader", 
                        alignment: "center" 
                      },
                      { 
                        text: "I, hereby, bequeath to the persons my residue and the remainder of my property and estate, tangible and intangible, immovable and movable, real, personal and mixed, of whatever nature and wherever situated, including all property.", 
                        style: "text",
                                                margin: [0, 10, 0, 0]
                      },
                      { 
                        text: "Or, I may acquire or receive or inherit any assets in future after writing this Will, shall be bequeathed in the following manner and proportions:", 
                        style: "text",
                                                margin: [0, 10, 0, 10]
                      }
                    ],
                  },
            (() => {
              const headers = [
                { text: "Sl. No.", bold: true }, 
                { text: "Beneficiary Name", bold: true }, 
                { text: "Percentage Share", bold: true }
            ];              
            const rows = residuaryDistributionDetails.split.map((split: ISplit, index: number) => {
              const beneficiary = beneficiaryDetails.find((b) => b.id === split.beneficiaryId);
              const name =
                beneficiary?.data?.type === "Charity"
                  ? beneficiary.data?.organization
                  : beneficiary?.data?.fullName || "Unknown";
            
              return [
                index + 1,
                name,
                `${split.percentage} %`,
              ];
            });
          
              return [
                {
                  table: {
                    headerRows: 1,
                    widths: ["10%", "50%", "40%"],
                    body: [headers, ...rows],
                  },
                  style: "table",
                  layout: {
                    keepWithHeaderRows: 1,
                    dontBreakRows: true 
                  }
                }
              ];
          })(),
            { text: "\n\nPART-VII: LIABILITIES\n", style: "subheader", alignment: "center" },
            ...[
                "home_loan",
                "personal_loan",
                "vechicle_loan",
                "education_loan",
                "other_liabilities"
                ].map((subtype) => {
                    try{
                        const filteredAssets = assetDetails.filter((a) => a.subtype === subtype);
                            
                        if (filteredAssets.length === 0) return null;
                        const headers = getHeadersForSubtype(subtype).map(header => ({ text: header, bold: true })); 
                        const rows = filteredAssets.map((a, index) => getRowForSubtype(subtype, a, index, liabilityDistributionDetails, beneficiaryDetails));

                        return [
                            { text: `\n${getTitleForSubtype(subtype)}`, style: "tableTitle", alignment: "center" },
                            {
                            table: {
                                headerRows: 1,
                                widths: ["10%", ...headers.slice(1).map(() => "*")],
                                body: [headers, ...rows],
                            },
                            style: "table",
                            },
                            { 
                              text: `The above-mentioned loan(s) is(are) being taken by me during my lifetime and now, through this Will, I transfer my liabilities and duties to pay off the debts, in the manner mentioned in the table.`, 
                              style: "text"
                            },                            
                        ];
                    }
                    catch(error){
                        console.log(subtype);
                        console.log(error);
                    }
                
                }).flat().filter(Boolean)
            ,
            [
              {
                unbreak: 'before',
                stack: [
                  {
                    text: "PART-VIII: EXCLUDED PERSONS",
                    style: "subheader",
                    alignment: "center",
                    margin: [0, 20, 0, 10]
                  },
                  {
                    text: excludedPersons.length !== 0
                      ? "The following person(s) are explicitly excluded from benefiting under this Will:"
                      : "There are no person(s) explicitly excluded from benefiting under this Will.",
                    style: "text",
                    margin: [0, 0, 0, 10]
                  }
                ]
              },
              ...(excludedPersons.length !== 0
                ? [
                    {
                      table: {
                        headerRows: 1,
                        widths: ["10%", "*", "*", "*"],
                        body: [
                          [
                            { text: "S. No.", bold: true },
                            { text: "Name", bold: true },
                            { text: "Relationship", bold: true },
                            { text: "Reason", bold: true }
                          ],
                          ...excludedPersons.map((person, index) => [
                            index + 1,
                            person.data?.fullName ?? "N/A",
                            person.data?.relationship ?? "N/A",
                            person.data?.reason ?? "N/A"
                          ])
                        ]
                      },
                      style: "table"
                    }
                  ]
                : [])
            ],
            { text: "", pageBreak: "after" },
            { text: "ATTESTATION BY TESTATOR\n", style: "subheader", alignment: "center" },
            {text: "IN WITNESS WHEREOF, I, the undersigned testator, declare that I sign and execute this instrument on the date written below as my last Will and testament. This Will deed shall come into effect post my demise also I reserve the right to revoke/ cancel/ alter this Will deed any time during my lifetime. Further, I declare that I sign it willingly, that I execute it as my free and voluntary act for the purposes expressed in this document, and that I am above 18 years of age, of sound mind and memory, and under no constraint or undue influence.",
               style: "text"
            },
            {text: "\n\n"},
            {
            text: "______________________________",
            margin: [250, 20, 0, 0],
            alignment: "left",
            style: "text"},
            { text: "Signature", margin: [250, 5, 0, 0], alignment: "left", style: "text" },
            { text: `(${honorific} ${personalDetails?.fullName})`, margin: [250, 5, 0, 0], alignment: "left", style: "text" },

            {
                text: "Date: ______________________",
                margin: [250, 20, 0, 0],
                alignment: "left",
                style: "text"},
            {
                text: "Place: ______________________",
                margin: [250, 20, 0, 0],
                alignment: "left",
                style: "text"},
            { text: "", pageBreak: "after" },
            { text: "ATTESTATION BY WITNESSES\n", style: "subheader", alignment: "center" },
            { text: `This last Will and testament, which has been separately signed by ${honorific} ${personalDetails.fullName}, the testator, as on the date indicated below signed and declared by the above-named testator as his last Will and testament in the presence of each of us. We, in the presence of the testator and each other, at the testator's request, under penalty of perjury, hereby subscribe our names as witnesses to the declaration and execution of the last Will and testament by the testator, and we declare that, to the best of our knowledge, said testator is eighteen years of age or older, of sound mind and memory and under no constraint or undue influence.`,
            style: "text"},
            { text: "\n\n\nWITNESSES 1\n\n", alignment: "center", bold: true},
            { text: "Full Name of the Witness as per Aadhar/PAN Card:\n\n\n", alignment: "left",
              style: "text"},
            { text: "Signature of Witness:\n\n\n", alignment: "left",
              style: "text"},
            { text: "Date:\n\n\n", alignment: "left",
              style: "text"},
            { text: "Address:\n\n\n", alignment: "left",
              style: "text"},

            { text: "\n\n\nWITNESSES 2\n\n", alignment: "center", bold: true, style: "text"},   
            { text: "Full Name of the Witness as per Aadhar/PAN Card:\n\n\n", alignment: "left",
              style: "text"},
            { text: "Signature of Witness:\n\n\n", alignment: "left",
              style: "text"},
            { text: "Date:\n\n\n", alignment: "left",
              style: "text"},
            { text: "Address:\n\n\n", alignment: "left",
              style: "text"},
        ];

        const docDefinition: TDocumentDefinitions = {
            content,

            styles: {
              header: { fontSize: 18, bold: true, lineHeight: 1.5 },
              title: { fontSize: 20, bold: true, lineHeight: 1.5 },
              subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 10], lineHeight: 1.5 },
              tableTitle: { fontSize: 14, bold: true, margin: [0, 10, 0, 10], lineHeight: 1.5 },
              text: { fontSize: 12, lineHeight: 1.5, alignment: "justify" },
              table: { margin: [0, 5, 0, 15], lineHeight: 2 }
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
          currentVersion = pdfVersioning.latestversion + 1; 
      }

      const fileName = `${userDetails?.personalDetails?.fullName}_V${currentVersion}.pdf`;
      const filePath = `./${fileName}`;

      // Write the PDF to a temporary file
      const bufferStream = fs.createWriteStream(filePath);
      pdfDoc.pipe(bufferStream);
      pdfDoc.end();

      // Wait for the file stream to finish writing
      await new Promise<void>((resolve, reject) => {
        bufferStream.on("finish", () => resolve());
        bufferStream.on("error", (err) => reject(err));
    });
    

      //const urls = await uploadFile(userId, fileName, fs.createReadStream(filePath));

      //await upsertPDFVersioning(userId, urls.publicUrl, urls.signedUrl);

      res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
      res.setHeader("Content-Type", "application/pdf");

      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);

      readStream.on("end", () => {
          fs.unlinkSync(filePath);
      });

      readStream.on("error", (err) => {
          console.error("Error reading file:", err);
          fs.unlinkSync(filePath); // Ensure cleanup on error
      });

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
      home_loan: ["S. No", "Name of Bank", "Amount", "Description", "Liable Person"],
      vechicle_loan: ["S. No", "Name of Bank", "Amount", "Description", "Liable Person"],
      personal_loan: ["S. No", "Name of Bank", "Amount", "Description", "Liable Person"],
      education_loan: ["S. No", "Name of Bank", "Amount", "Liable Person"],
      other_liabilities: ["S. No", "Amount", "Description", "Liable Person"],
      pets: ["S. No", "Name", "Type/Breed", "Amount Allocated"],
      art_works: ["S. No", "Name", "Description"],
      default: ["S. No", "Category", "Details"]
    };
  
    return headersMap[subtype as keyof typeof headersMap] || headersMap.default;
  }
  
  
  // Returns the table row for each subtype
  function getRowForSubtype(subtype: string, asset: any, index: number, liabilityDistribution: any, beneficiaries: any): any[] {
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
          `${asset.data.address}, ${asset.data.city}, ${asset.data.pincode}\nOwnership Type: ${asset.data.ownershipType}` || "N/A",
        ];
      case "vehicles":
        return [
          index + 1,
          asset.data.brandOrModel || "N/A",
          `Registration Number: ${asset.data.registrationNumber}`,
        ];
      case "jewelleries":
        return [
          index + 1,
          asset.data.type || "N/A",
          `${asset.data.preciousMetalInWeight}g` || "N/A",
          asset.data.description || "N/A",
        ];
      case "insurance_policies":
        return [
          index + 1,
          asset.data.insuranceType || "N/A",
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
          `Account Number: ${maskAccountNumber(asset.data.accountNumber)}`,
        ];
      case "digital_assets":
        return [
          index + 1,
          asset.data.type || "N/A",
          `Wallet: ${asset.data.walletAddress}`,
        ];
      case "provident_funds":
          const { type, bankName, branch, city, uanNumber, gpfNumber } = asset.data;
        
          let accountInfo = "";
          if (type === "EPF") {
            accountInfo = `UAN Number: ${maskAccountNumber(uanNumber) || "N/A"}`;
          } else if (type === "GPF") {
            accountInfo = `GPF Number: ${maskAccountNumber(gpfNumber) || "N/A"}`;
          } else if (type === "PPF") {
            accountInfo = `Bank: ${bankName || "N/A"}\nBranch: ${branch || "N/A"}\nCity: ${city || "N/A"}`;
          }
        
          return [
            index + 1,
            type || "N/A",
            accountInfo,
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
      case "escops":
        return [
          index + 1,
          asset.data.companyName || "N/A",
          `Vested: ${asset.data.noOfVestedEscops},\nUnvested: ${asset.data.noOfUnVestedEscops}\nUnits Granted: ${asset.data.noOfUnitGraged}`,
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
      case "art_works":
        return [
          index + 1,
          asset.data.name || "N/A",
          asset.data.description || "N/A",
        ];
      case "pets":
        return [
          index + 1,
          asset.data.petName || "N/A",
          asset.data.animalBreed || "N/A",
          asset.data.amount || "N/A",
        ];
    case "custom_assets":
        return [index + 1, asset.data.description || "N/A"];
    case "personal_loan":

      var assetSplitDetails = liabilityDistribution.beneficiaries.find(
        (distAsset: { asset_id: any; }) => distAsset.asset_id === asset.id
      );
      var beneficiaryDetails = assetSplitDetails?.beneficiarieslist
        .map((splitDetail: { beneficiaryId: any; percentage: any; }) => {
          const beneficiary = beneficiaries.find((b: { id: any; }) => b.id === splitDetail.beneficiaryId);
          return beneficiary
          ? `${
              beneficiary.data?.type === "Charity"
                ? beneficiary.data?.Organization
                : beneficiary.data?.fullName || "Unknown"
            } (${splitDetail.percentage}%)`
          : "Unknown Beneficiary";
        })
        .join(", ") || "No Beneficiaries Assigned";

        return [
            index + 1, 
            asset.data.nameOfBank || "N/A",
            asset.data.loanAmount || "N/A",
            `Account Number: ${maskAccountNumber(asset.data.accountNumber)}` || "N/A",
            beneficiaryDetails
        ];
    case "home_loan":
      var assetSplitDetails = liabilityDistribution.beneficiaries.find(
        (distAsset: { asset_id: any; }) => distAsset.asset_id === asset.id
      );
      var beneficiaryDetails = assetSplitDetails?.beneficiarieslist
        .map((splitDetail: { beneficiaryId: any; percentage: any; }) => {
          const beneficiary = beneficiaries.find((b: { id: any; }) => b.id === splitDetail.beneficiaryId);
          return beneficiary
          ? `${
              beneficiary.data?.type === "Charity"
                ? beneficiary.data?.organizationName
                : beneficiary.data?.fullName || "Unknown"
            } (${splitDetail.percentage}%)`
          : "Unknown Beneficiary";
        })
        .join(", ") || "No Beneficiaries Assigned";

      return [
          index + 1, 
          asset.data.nameOfBank || "N/A",
          asset.data.loanAmount || "N/A",
          `Account Number: ${maskAccountNumber(asset.data.accountNumber)}` || "N/A",
          beneficiaryDetails
      ];
    case "vechicle_loan":
      assetSplitDetails = liabilityDistribution.beneficiaries.find(
        (distAsset: { asset_id: any; }) => distAsset.asset_id === asset.id
      );

      beneficiaryDetails = assetSplitDetails?.beneficiarieslist
        .map((splitDetail: { beneficiaryId: any; percentage: any; }) => {
          const beneficiary = beneficiaries.find((b: { id: any; }) => b.id === splitDetail.beneficiaryId);
          return beneficiary
          ? `${
              beneficiary.data?.type === "Charity"
                ? beneficiary.data?.organizationName
                : beneficiary.data?.fullName || "Unknown"
            } (${splitDetail.percentage}%)`
          : "Unknown Beneficiary";
        })
        .join(", ") || "No Beneficiaries Assigned";
        return [
            index + 1, 
            asset.data.nameOfBank || "N/A",
            asset.data.loanAmount || "N/A",
            `Account Number: ${maskAccountNumber(asset.data.accountNumber)}` || "N/A",
            beneficiaryDetails
        ];
    case "education_loan":
      assetSplitDetails = liabilityDistribution.beneficiaries.find(
        (distAsset: { asset_id: any; }) => distAsset.asset_id === asset.id
      );

      beneficiaryDetails = assetSplitDetails?.beneficiarieslist
        .map((splitDetail: { beneficiaryId: any; percentage: any; }) => {
          const beneficiary = beneficiaries.find((b: { id: any; }) => b.id === splitDetail.beneficiaryId);
          return beneficiary
          ? `${
              beneficiary.data?.type === "Charity"
                ? beneficiary.data?.organizationName
                : beneficiary.data?.fullName || "Unknown"
            } (${splitDetail.percentage}%)`
          : "Unknown Beneficiary";
        })
        .join(", ") || "No Beneficiaries Assigned";
        return [
            index + 1, 
            asset.data.nameOfBank || "N/A",
            `Loan Amount: ${asset.data.loanAmount}` || "N/A",
            beneficiaryDetails
        ];
    case "other_liabilities":
      assetSplitDetails = liabilityDistribution.beneficiaries.find(
        (distAsset: { asset_id: any; }) => distAsset.asset_id === asset.id
      );

      beneficiaryDetails = assetSplitDetails?.beneficiarieslist
        .map((splitDetail: { beneficiaryId: any; percentage: any; }) => {
          const beneficiary = beneficiaries.find((b: { id: any; }) => b.id === splitDetail.beneficiaryId);
          return beneficiary
          ? `${
              beneficiary.data?.type === "Charity"
                ? beneficiary.data?.organizationName
                : beneficiary.data?.fullName || "Unknown"
            } (${splitDetail.percentage}%)`
          : "Unknown Beneficiary";
        })
        .join(", ") || "No Beneficiaries Assigned";
        return [
            index + 1, 
            asset.data.loanAmount || "N/A",
            [
              asset.data.Lender ? `Lender Name: ${asset.data.Lender}` : null,
              asset.data.accountNumber ? `Account Number: ${maskAccountNumber(asset.data.accountNumber)}` : null,
              asset.data.remainingAmount ? `Remaining Amount: ${asset.data.remainingAmount}` : null,
              asset.data.description ? `Description: ${asset.data.description}` : null,
            ].filter(Boolean).join("\n") || "N/A",
            beneficiaryDetails
        ];

      default:
        return [index + 1, asset.subtype || "N/A", "N/A"];
    }
  }

  function getRowsForSpecificDistribution(
    distributionDetails: IUserAssetsSpecific,
    assets: IAsset[],
    beneficiaries: IBeneficiary[]
  ): (string | number | { text: string; bold?: boolean })[][] {
    if (!assets || !distributionDetails) {
      return [];
    }
  
    return assets
      .filter((asset) => asset.type !== "liabilities")
      .map((asset, index) => {
        const assetSplitDetails = distributionDetails.assets.find(
          (distAsset) => distAsset.asset_id === asset.id
        );
  
        const beneficiaryDetails = assetSplitDetails?.beneficiarieslist?.length
          ? assetSplitDetails.beneficiarieslist
              .map((splitDetail) => {
                const beneficiary =
                  beneficiaries.find(
                    (b) => b.id === splitDetail.beneficiaryId
                  )
  
                if (!beneficiary) {
                  console.warn(
                    `Beneficiary not found for ID: ${splitDetail.beneficiaryId}`
                  );
                  return `Unknown (${splitDetail.percentage}%)`;
                }
  
                const fullName = beneficiary?.data?.fullName || "Unknown";
                const organization = beneficiary?.data?.organization || "";
                const isCharity = beneficiary?.data?.type === "Charity";
  
                // Use organization name if it's a charity
                const displayName = isCharity
                  ? `${organization || fullName || "Unnamed Charity"}`
                  : fullName;
  
                return `${displayName.trim()} (${splitDetail.percentage}%)`;
              })
              .join(", ")
          : "No Beneficiaries Assigned";
  
        const description = getAssetDescription(asset.subtype, asset);
        const formattedSubtype =
        asset.subtype.toLowerCase() === 'escops'
          ? 'ESOPS'
          : asset.subtype.replace(/_/g, ' ').toUpperCase();

        return [
          index + 1,
          {
            text: [
              { text: `${formattedSubtype}:\n`, bold: true },
              { text: description },
            ],
          } as any,
          beneficiaryDetails,
        ];
      });
  }

  function getAssetDescription(subtype: string, asset: any): string {
    switch (subtype) {
      case "bank_accounts":
        return `${asset.data.accountType} Account, Account Number: ${maskAccountNumber(asset.data.accountNumber)}; Branch Address: ${asset.data.branch}, ${asset.data.city}`;
      case "properties":
        return `${asset.data.address}, ${asset.data.city}, ${asset.data.pincode}` || "N/A";
      case "vehicles":
        return `Registration Number: ${asset.data.registrationNumber}`;
      case "jewelleries":
        return `${asset.data.preciousMetalInWeight || "N/A "}g, ${asset.data.description || "N/A"}`;
      case "insurance_policies":
        return `Company: ${asset.data.insuranceProvider}, Policy Number: ${maskAccountNumber(asset.data.policyNumber)}`;
      case "mutual_funds":
        return `${asset.data.noOfHolders} Holder(s)`;
      case "demat_accounts":
        return `Account Number: ${maskAccountNumber(asset.data.accountNumber)}`;
      case "digital_assets":
        return `Wallet: ${asset.data.walletAddress}`;
        case "provident_funds": {
      const { type, bankName, branch, city, uanNumber, gpfNumber } = asset.data;
        
          let detail = "";
          if (type === "EPF") {
            detail = `Type: EPF; UAN Number: ${maskAccountNumber(uanNumber) || "N/A"}`;
          } else if (type === "GPF") {
            detail = `Type: GPF; GPF Number: ${maskAccountNumber(gpfNumber) || "N/A"}; State: ${asset.data.state || "N/A"}`;
          } else if (type === "PPF") {
            detail = `Type: PPF; Bank: ${bankName || "N/A"}; Branch: ${branch || "N/A"}; City: ${city || "N/A"}`;
          } else {
            detail = `Type: ${type || "Unknown"}`;
          }
        
          return detail;
        }
      case "fixed_deposits":
        return `${asset.data.noOfHolders} Holder(s), Account number: ${maskAccountNumber(asset.data.accountNumber)}; Branch Address: ${asset.data.branch}, ${asset.data.city}`;
      case "safety_deposit_boxes":
        return `${asset.data.bankName}, Branch Address: ${asset.data.branch}, ${asset.data.city}`;
      case "pension_accounts":
        return `Scheme Name: ${asset.data.schemeName}`;
      case "businesses":
        return `Company Name: ${asset.data.companyName}, Address: ${asset.data.address}`;
      case "bonds":
      case "debentures":
      case "other_investments":
        return `Financial Provider: ${asset.data.financialServiceProviderName}, Folio Number: ${asset.data.certificateNumber}`;
      case "escops":
        return `Vested: ${asset.data.noOfVestedEscops}, Unvested: ${asset.data.noOfUnVestedEscops}, Units Granted: ${asset.data.noOfUnitGraged}`;
      case "intellectual_property":
        return `ID: ${asset.data.identificationNumber}, Description: ${asset.data.description}`;
      case "art_works":
        return asset.data.description || "N/A";
      case "pets":
        return `Breed: ${asset.data.animalBreed}, Amount: ${asset.data.amount}`;
      case "custom_assets":
        return asset.data.description || "N/A";
      default:
        return "N/A";
    }
  }

  function getTitleForSubtype(subtype: string): string {
    switch (subtype) {
      case "properties":
        return "IMMOVABLE PROPERTIES";
      case "bank_accounts":
        return "BANK ACCOUNT DETAILS";
      case "fixed_deposits":
        return "FIXED DEPOSIT DETAILS";
      case "insurance_policies":
        return "INSURANCE POLICY DETAILS";
      case "safety_deposit_boxes":
        return "SAFETY DEPOSIT BOX DETAILS";
      case "demat_accounts":
        return "DEMAT ACCOUNT DETAILS";
      case "mutual_funds":
        return "MUTUAL FUND DETAILS";
      case "provident_funds":
        return "PROVIDENT FUND DETAILS";
      case "pension_accounts":
        return "PENSION ACCOUNT DETAILS";
      case "businesses":
        return "BUSINESS DETAILS";
      case "bonds":
        return "BOND DETAILS";
      case "debentures":
        return "DEBENTURE DETAILS";
      case "escops":
        return "ESOP DETAILS";
      case "other_investments":
        return "OTHER INVESTMENT DETAILS";
      case "vehicles":
        return "VEHICLE DETAILS";
      case "jewelleries":
        return "JEWELLERY DETAILS";
      case "digital_assets":
        return "DIGITAL ASSET DETAILS";
      case "intellectual_property":
        return "INTELLECTUAL PROPERTY DETAILS";
      case "pets":
        return "PET DETAILS";
      case "art_works":
        return "ART WORK DETAILS";
      case "custom_assets":
        return "CUSTOM ASSET DETAILS";
  
      case "home_loan":
        return "HOME LOAN DETAILS";
      case "personal_loan":
        return "PERSONAL LOAN DETAILS";
      case "vechicle_loan":
        return "VECHICLE LOAN DETAILS";
      case "education_loan":
        return "EDUCATION LOAN";
      case "other_liabilities":
        return "OTHER LIABILITY DETAILS";
  
      default:
        return subtype.replace(/_/g, " ").toUpperCase();
    }

  }function addSpaceEveryNChars(input: string, groupSize: number): string {
    const regex = new RegExp(`.{1,${groupSize}}`, 'g');
    return input.match(regex)?.join(' ') ?? '';
  }
  