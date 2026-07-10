import {
  generateStructuredData,
  type EventInfo,
  type SeoMessages,
} from "@/app/_utils/seo";

type Props = {
  locale: string;
  seoMessages: SeoMessages;
  event: EventInfo;
};

/** schema.org Event JSON-LD for one conference edition. */
export default function StructuredData(props: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateStructuredData(props)),
      }}
    />
  );
}
