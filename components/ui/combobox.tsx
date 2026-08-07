"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Extra text folded into the match, e.g. an ISO code or a country name. */
  keywords?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  /**
   * Required. The ARIA `combobox` role does not compute its name from the
   * trigger's contents, so without this the control is unnamed for assistive
   * technology even though it visibly shows the selected option.
   */
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  contentClassName?: string;
  id?: string;
  disabled?: boolean;
}

/**
 * Accessible replacement for the old `react-select` usage: a Radix popover
 * over a cmdk list, so it gets real listbox semantics and keyboard support.
 *
 * The list is windowed to `MAX_VISIBLE` matches — several call sites feed it
 * 400+ timezones, and rendering them all costs more than it's worth.
 */
const MAX_VISIBLE = 60;

function Combobox({
  options,
  value,
  onValueChange,
  label,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  className,
  contentClassName,
  id,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>();

  const selected = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, MAX_VISIBLE);

    const matches: ComboboxOption[] = [];
    for (const option of options) {
      const haystack = `${option.label} ${option.keywords ?? ""}`.toLowerCase();
      if (haystack.includes(q)) matches.push(option);
      if (matches.length >= MAX_VISIBLE) break;
    }
    return matches;
  }, [options, query]);

  React.useEffect(() => {
    if (open) setTriggerWidth(triggerRef.current?.offsetWidth);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between px-3 font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("p-0", contentClassName)}
        style={triggerWidth ? { width: triggerWidth } : undefined}
      >
        {/* cmdk's own filter is disabled: we pre-filter to cap the list size. */}
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filtered.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(next) => {
                    onValueChange(next);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      option.value === value ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden
                  />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
