import { ScrollArea } from "radix-ui";

interface ScrollAreaProps {
  children: React.ReactNode;
}

export default function MyScrollArea(props: ScrollAreaProps) {
  return (
    <ScrollArea.Root className="overflow-hidden size-full relative flex flex-col">
      <ScrollArea.Viewport className="size-full">
        {props.children}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar
        orientation="vertical"
        className={"flex select-none touch-none p-0.5 bg-slate-100 dark:bg-slate-700 transition-colors duration-150 ease-out hover:bg-slate-200 dark:hover:bg-slate-200 w-2.5"}
      >
        <ScrollArea.Thumb className="flex-1 bg-slate-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-slate-200" />
    </ScrollArea.Root >
  );
}
