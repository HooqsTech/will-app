import React, { useState } from "react";
import { IAdminUserData } from "../models/user";
import { Accordion, AccordionDetails, AccordionSummary, Chip, Modal, Typography } from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useRecoilState, useSetRecoilState } from "recoil";
import { IPdfVersionState, pdfVersionsState } from "../atoms/PdfVersioningState";
import { pageLoadingState } from "../atoms/PageLoadingState";
import { IsEmptyString } from "../utils";
import { downloadPdfFile, getPDFVersions } from "../api/pdf";
import CustomSelect from "./CustomSelect";
import CustomButton from "./CustomButton";

interface IAdminUserCardProps {
    user: IAdminUserData;
}

const AdminUserCard: React.FC<IAdminUserCardProps> = ({ user }) => {
    const [pdfVersions, setPdfVersions] = useRecoilState(pdfVersionsState);
    const [isValid, setIsValid] = useState(true);
    const [currentPdfVersion, setcurrentPdfVersion] = useState("");
    const [openPdfDownloadModal, setOpenPdfDownloadModal] = useState(false);
    const setPageLoading = useSetRecoilState(pageLoadingState);

    const fetchPdfVersions = async () => {
        if (user.userid) {
            let response: IPdfVersionState[] = await getPDFVersions(user.userid);
            setPdfVersions(response);
            setOpenPdfDownloadModal(true);
        }
    };

    const handleDownload = async () => {
        setPageLoading(true);
        try {
            setIsValid(true);
            if (IsEmptyString(currentPdfVersion)) {
                setIsValid(false);
                return;
            }
            var versionId = pdfVersions.find(
                (s) => s.folderpath.includes(currentPdfVersion) == true
            )?.versionid;

            await downloadPdfFile(user.userid, versionId ?? "", currentPdfVersion);
        }
        catch (error) { }
        setPageLoading(false);
    };

    return (
        <>
            <Accordion className="rounded-2xl shadow-md">
                <AccordionSummary expandIcon={<ArrowDropDownIcon />} className="bg-white">
                    <div className="flex flex-col">
                        <Typography variant="h6" className="font-semibold">
                            {user.personaldetails.details.title} {user.personaldetails.details.firstName} {user.personaldetails.details.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user.role}
                        </Typography>
                    </div>
                </AccordionSummary>

                <AccordionDetails className="bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                        <div>
                            <p><span className="font-semibold">Phone:</span> {user.phonenumber}</p>
                            <p><span className="font-semibold">Email:</span> {user.addressdetails.address.email}</p>
                            <p><span className="font-semibold">City:</span> {user.addressdetails.address.city}</p>
                            <p><span className="font-semibold">State:</span> {user.addressdetails.address.state}</p>
                        </div>
                        <div>
                            <p><span className="font-semibold">Father Name:</span> {user.personaldetails.details.fatherName}</p>
                            <p><span className="font-semibold">DOB:</span> {new Date(user.personaldetails.details.dob).toLocaleDateString()}</p>
                            <p><span className="font-semibold">Religion:</span> {user.personaldetails.details.religion}</p>
                            <p><span className="font-semibold">Aadhaar:</span> {user.personaldetails.details.aadhaarNumber}</p>
                        </div>
                    </div>

                    {user.payment_transactions.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Payments</h3>
                            {user.payment_transactions.map((payment) => (
                                <Accordion key={payment.id} className="mb-4">
                                    <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                                        <Typography variant="body1">Order ID: {payment.orderid}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails className="bg-white p-4">
                                        {/* Payment Status Badge */}
                                        <Chip
                                            label="PAID"
                                            color="success"
                                            size="small"
                                            className="mb-2"
                                        />

                                        <p><span className="font-semibold">Total Price:</span> ₹{payment.totalprice}</p>

                                        <div className="mt-2">
                                            <h4 className="font-semibold">Selected Services:</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-700">
                                                {payment.selectedservices.map((service) => (
                                                    <li key={service.serviceId}>
                                                        {service.serviceName} -
                                                        <span className="text-green-600 font-medium"> ₹{service.serviceDiscountPrice}</span>
                                                        <span className="line-through text-gray-400 ml-2">₹{service.serviceStandardPrice}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-2">
                                            <h4 className="font-semibold">Selected Category:</h4>
                                            <p className="text-sm text-gray-700 mt-1">
                                                <span className="font-semibold">Name:</span> {payment.selectedcategories.categoryName}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Description:</span> {payment.selectedcategories.categoryDescription}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Discounted Price:</span>
                                                <span className="text-green-600 font-medium"> ₹{payment.selectedcategories.categoryDiscountPrice}</span>
                                                <span className="line-through text-gray-400 ml-2">₹{payment.selectedcategories.categoryStandardPrice}</span>
                                            </p>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                            <CustomButton label="Download PDF" onClick={fetchPdfVersions} />
                        </div>
                    )}
                </AccordionDetails>
            </Accordion>
            <Modal
                className="flex flex-col justify-center w-full items-center"
                open={openPdfDownloadModal}
                onClose={() => {
                    setOpenPdfDownloadModal(false);
                }}
            >
                <div className="bg-white p-6 max-w-lg flex flex-col w-full">
                    <p className="pb-4">Download PDF</p>
                    <CustomSelect
                        options={pdfVersions.map((s) =>
                            decodeURIComponent(
                                s.folderpath.substring(s.folderpath.lastIndexOf("/") + 1)
                            )
                        )}
                        value={currentPdfVersion}
                        helperText={!isValid ? "required" : ""}
                        onChange={(e) => {
                            setcurrentPdfVersion(e);
                        }}
                        label="Pdf Versions"
                    />
                    <CustomButton label="Download" onClick={handleDownload} />
                </div>
            </Modal>
        </>
    );
};

export default AdminUserCard;
