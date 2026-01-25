import Image from "next/image";
import ShinyText from "@/components/ShinyText";

type Props = {
  title?: string;
  description?: string;
};

export default function ComingSoon({ title, description }: Props) {
  return (
    <div className="w-full mb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
          <Image
            src="/2026/coex_3.jpg"
            alt="COEX Conference Hall"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center p-8 md:p-12">
            <div className="text-4xl md:text-6xl font-bold mb-4 text-center">
              <ShinyText text={title || "COMING SOON"} speed={3} />
            </div>
            {description && (
              <p className="text-lg md:text-xl text-white/90 text-center max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
