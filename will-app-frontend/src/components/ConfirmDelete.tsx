import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";

interface ConfirmDeleteProps {
  onConfirm: () => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onConfirm }) => {
  const handleDeleteClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-will-green)",
      cancelButtonColor: "var(--color-will-green)",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "swal-sm",
        title: "swal-title",
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
        Swal.fire({
          title: "Deleted!",
          text: "Your record has been deleted.",
          icon: "success",
          confirmButtonColor: "var(--color-will-green)",
          customClass: {
            popup: "swal-sm",
            title: "swal-title",
            confirmButton: "swal-confirm-btn",
          },
        });
      }
    });
  };

  return (
    <button onClick={handleDeleteClick} className="p-2 h-full bg-will-green">
      <DeleteIcon fontSize="small" className="text-white bg-will-green" />
    </button>
  );
};

export default ConfirmDelete;
