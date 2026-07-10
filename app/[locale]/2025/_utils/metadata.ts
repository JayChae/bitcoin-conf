import { createPageMetadata } from "@/app/_utils/seo";
import { seoMessages } from "@/app/messages/2025/seo";
import { event } from "@/app/messages/2025/event";

export const pageMetadata = createPageMetadata({
  seoMessages,
  event,
  basePath: "/2025",
});
