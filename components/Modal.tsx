import { ReactNode } from "react";

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black">
      <div className="bg-white p-4 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
