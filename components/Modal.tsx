import { ReactNode, useRef, useEffect, useState } from "react";

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black transition-opacity duration-300 z-50 p-4 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`
          bg-white rounded-lg shadow-xl relative
          transform transition-transform duration-300
          w-full md:w-1/3 max-h-[90vh] overflow-y-auto
          ${isVisible ? "scale-100" : "scale-90"}
        `}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
