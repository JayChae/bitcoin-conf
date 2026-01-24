type Props = {
  videoId: string;
  title?: string;
  description?: string;
};

export default function Video({ videoId, title, description }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Video Container */}
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-purple-900/20 via-red-900/20 to-orange-900/20 border border-accent/10">
        {/* Aspect Ratio Container */}
        <div className="relative w-full pb-[56.25%]">
          {/* YouTube iframe */}
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="mt-6 text-center">
          <p className="text-accent/80 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
