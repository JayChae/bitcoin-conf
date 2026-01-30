import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import Link from "next/link";

export default function HistoryDropdown({ lang }: { lang: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center justify-center gap-1 group text-lg">
          <span className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer">
            History
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-black/90 border-white/20 backdrop-blur-md min-w-24"
        sideOffset={12}
      >
        <DropdownMenuItem className="text-md focus:bg-white/10 focus:text-white">
          <Link
            href="/"
            locale={lang}
            className="flex items-center gap-2 w-full text-white/80 hover:text-white cursor-pointer"
          >
            2026
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
