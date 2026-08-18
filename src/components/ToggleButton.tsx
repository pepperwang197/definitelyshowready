interface ToggleButtonProps {
  value: boolean;
  handleClick: () => void;
  square: boolean;
  children: React.ReactNode;
}

export default function ToggleButton({
  value,
  handleClick,
  children,
  square = true,
}: ToggleButtonProps) {
  return (
    <button
      onClick={handleClick}
      className={`h-10 ${square ? "aspect-square" : "px-4"} rounded-sm font-bold items-center cursor-pointer ${value ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "bg-slate-300 dark:bg-gray-600 hover:bg-slate-400 dark:hover:bg-gray-700"}`}
    >
      {children}
    </button>
  );
}
