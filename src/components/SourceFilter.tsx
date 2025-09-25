"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

export type SourceOption = { id: string; name: string };

export function SourceFilter({
  sources,
  initialSelected,
}: {
  sources: SourceOption[];
  initialSelected?: string[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const allIds = useMemo(() => sources.map((s) => s.id), [sources]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(() => {
    const urlSel = (initialSelected && initialSelected.length) ? initialSelected : undefined;
    const local = typeof window !== "undefined" ? localStorage.getItem("sourceSelection") : null;
    const stored = local ? (JSON.parse(local) as string[]) : undefined;
    return urlSel ?? stored ?? allIds;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sourceSelection", JSON.stringify(selected));
    }
  }, [selected]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const apply = () => {
    const params = new URLSearchParams(sp?.toString());
    if (selected.length === allIds.length) {
      params.delete("sources");
    } else {
      params.set("sources", selected.join(","));
    }
    params.delete("force");
    const next = `${pathname}?${params.toString()}` as Route;
    router.push(next);
    setOpen(false);
  };

  const clearAll = () => setSelected([]);
  const selectAll = () => setSelected(allIds);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-white/70">
        సోర్సులు: {selected.length}/{allIds.length}
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 hover:bg-white/10">
            <Filter className="w-4 h-4" /> ఫిల్టర్
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md rounded-xl border border-white/10 bg-[#111] p-4 shadow-xl">
            <Dialog.Title className="text-lg font-semibold mb-2">సోర్స్ ఫిల్టర్</Dialog.Title>
            <div className="max-h-[50vh] overflow-auto pr-1 space-y-2">
              {sources.map((s) => (
                <label key={s.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="accent-white"
                    checked={selected.includes(s.id)}
                    onChange={() => toggle(s.id)}
                  />
                  <span className="text-sm">{s.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-xs opacity-80 hover:opacity-100 underline">
                  అన్నీ
                </button>
                <button onClick={clearAll} className="text-xs opacity-80 hover:opacity-100 underline">
                  క్లియర్
                </button>
              </div>
              <div className="flex gap-2">
                <Dialog.Close asChild>
                  <button className="px-3 py-1.5 rounded border border-white/20 hover:bg-white/10">రద్దు</button>
                </Dialog.Close>
                <button onClick={apply} className="px-3 py-1.5 rounded bg-white text-black hover:opacity-90">అప్లై</button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
