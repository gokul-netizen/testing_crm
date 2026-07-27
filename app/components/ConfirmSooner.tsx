import { toast } from "sonner";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  variant?: "danger" | "primary";
}

export const confirmAction = ({
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  variant = "primary",
}: ConfirmOptions) => {
  
  const accentClass = variant === "danger" 
    ? "!bg-red-600 hover:!bg-red-700" 
    : "!bg-blue-600 hover:!bg-blue-700";

  return toast(title, {
    position: "top-center",
    description,
    classNames: {
      toast: "group !bg-white !rounded-xl !shadow-2xl !border-gray-100 !p-5",
      title: "text-gray-900 font-bold text-lg",
      description: "text-gray-500 text-sm mt-1",
      actionButton: `${accentClass} !text-white !font-semibold !px-4 !py-2 !rounded-lg !transition-all !duration-200`,
      cancelButton: "!bg-gray-100 hover:!bg-gray-200 !text-gray-700 !font-medium !px-4 !py-2 !rounded-lg !transition-all",
    },
    action: {
      label: confirmLabel,
      onClick: async () => {
        try {
          await onConfirm();
        } catch (err: any) {
          toast.error(err.message || "Action failed");
        }
      },
    },
    cancel: {
      label: "Cancel",
      onClick: () => {},
    },
  });
};