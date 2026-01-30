"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { handleModalRef } from "@/app/_utils/modal";

// 모달 컴포넌트
function Modal({
  isOpen,
  onClose,
  image,
}: {
  isOpen: boolean;
  onClose: () => void;
  image: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      ref={() => handleModalRef(onClose)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Scrollable Image Container */}
      <div className="relative max-w-[90vw] max-h-[90vh] overflow-auto bg-white/5 rounded-lg">
        <Image
          src={image}
          alt="행사 브로셔"
          width={1200}
          height={800}
          className="w-auto h-auto"
          priority
        />
      </div>
    </div>
  );
}

type Props = {
  triggerText: string;
  image: string;
};

export default function BrochureModalTrigger({ triggerText, image }: Props) {
  if (!image) return null;

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="group relative inline-flex items-center justify-center gap-3 px-10 py-3 bg-orange-500/80 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-out cursor-pointer"
      >
        {triggerText}
      </button>
      <Modal isOpen={isOpen} onClose={closeModal} image={image} />
    </>
  );
}
