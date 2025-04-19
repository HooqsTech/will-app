import Swal from "sweetalert2";
import { IPdfVersion } from "../models/pdf";

export const getPDFVersions = async (userId: string): Promise<IPdfVersion[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdfversionByUserId`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch pdf versions");
    }

    const asset: IPdfVersion[] = await response.json();
    return asset;
};

export const generatePdfFile = async (userId: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generatePDF`, {
            method: "POST",
            headers: {
                "Content-Type": "application/JSON",
            },
            body: JSON.stringify({
                userId: userId
            })
        });

        if (!response.ok) {
            throw new Error("Failed to download file");
        }

        console.log(response)
        // const blob = await response.blob();
        // const url = window.URL.createObjectURL(blob);

        // const a = document.createElement("a");
        // a.href = url;
        // a.download = userId + ".pdf"; // Change filename as needed
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);

        // window.URL.revokeObjectURL(url);
        Swal.fire({
                title: "Verification In Progress!",
                text: "The team is verifying the document. They will get back to you, and the response will be sent to your Gmail.",
                icon: "success",
                confirmButtonColor: "var(--color-will-green)",
                customClass: {
                  popup: "swal-sm",
                  title: "swal-title",
                  confirmButton: "swal-confirm-btn",
                },
              });
    } catch (error) {
        console.error("Error downloading the file:", error);
    }
};

export const downloadPdfFile = async (userId: string, versionId: string, fileName: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/downloadPdfByUserIdAndVersionId`, {
            method: "POST",
            headers: {
                "Content-Type": "application/JSON",
            },
            body: JSON.stringify({
                userId: userId,
                versionId: versionId
            })
        });

        if (!response.ok) {
            throw new Error("Failed to download file");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Change filename as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading the file:", error);
    }
};