import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export default function HistoryDropdown({ lang }: { lang: string }) {
    return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center justify-center gap-1 group text-md">
                    <span className="text-white/80 group-hover:text-white cursor-pointer transition-colors duration-200">
                      History
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-black/90 border-white/20 backdrop-blur-md min-w-24"
                  sideOffset={12}
                >
                  <DropdownMenuItem
                    className={`text-md text-white/80 hover:text-white focus:bg-white/10 focus:text-white ${
                      lang === "en"
                        ? "text-white bg-white/10 cursor-default"
                        : "text-white/80 hover:text-white cursor-pointer"
                    }`}
                  >
                    <Link
                      href="/"
                      locale={lang + "/2025"}
                      className="flex items-center gap-2 w-full"
                    >
                      2025
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`text-md focus:bg-white/10 focus:text-white ${
                      lang === "ko"
                        ? "text-white bg-white/10 cursor-default"
                        : "text-white/80 hover:text-white cursor-pointer"
                    }`}
                  >
                    <Link href="/" locale="ko/2025" className="flex items-center gap-2 w-full">
                      2025
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
    )
}