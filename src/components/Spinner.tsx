export default function Spinner() {
  return (
    <div
      className="flex items-center justify-center"
      role="status"
      aria-label="loading"
    >
      <div
        className={`animate-spin rounded-full border-t-transparent border-cyan-500 w-10 h-10 border-5`}
      />
    </div>
  );
}
