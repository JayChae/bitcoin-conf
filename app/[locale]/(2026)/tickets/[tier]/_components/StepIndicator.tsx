import { cn } from "@/lib/utils";

type Step = { key: string; label: string };

export default function StepIndicator({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: string;
}) {
  const currentIdx = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2 md:gap-4">
          {i > 0 && <div className="w-8 md:w-12 h-px bg-white/20" />}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm",
              i === currentIdx
                ? "bg-white/10 border border-white/20 text-white font-medium"
                : i < currentIdx
                  ? "text-white/60"
                  : "text-white/30",
            )}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                i === currentIdx
                  ? "bg-white text-black"
                  : i < currentIdx
                    ? "bg-white/20 text-white/60"
                    : "bg-white/10 text-white/30",
              )}
            >
              {i + 1}
            </span>
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}
