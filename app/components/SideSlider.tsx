"use client";

import { Button } from "@/components/ui/button";

interface SliderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  title?: string;
}

export default function SliderPanel({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-md",
  title = "Advance Search"
}: SliderPanelProps) {
  return (
    <>
     
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40"
          
        />
      )}

      
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"} w-full ${maxWidth}`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <Button
              variant="ghost"
              className="text-gray-600 text-2xl cursor-pointer"
              onClick={onClose}
            >
              ×
            </Button>
          </div>

        
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
