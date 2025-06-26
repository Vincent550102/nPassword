"use client";
import React, {
  ReactNode,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";

interface ModalProps {
  children: ReactNode;
  onCloseAction: () => void; // Renamed from onClose to onCloseAction
}

export default function Modal({ children, onCloseAction }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onCloseAction, 300);
  }, [onCloseAction]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    },
    [handleClose],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    },
    [handleClose],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [handleClickOutside, handleKeyDown]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black transition-opacity duration-300 z-50 p-4 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
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
          aria-label="Close dialog"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
