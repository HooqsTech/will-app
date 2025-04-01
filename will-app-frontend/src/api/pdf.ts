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

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = userId + ".pdf"; // Change filename as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading the file:", error);
    }
};

export const downloadPdfFile = async (userId: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/downloadPDF`, {
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

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = userId + ".pdf"; // Change filename as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading the file:", error);
    }
};