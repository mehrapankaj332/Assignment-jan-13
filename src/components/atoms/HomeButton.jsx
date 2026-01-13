import { ArrowLeft } from "lucide-react";

export default function HomeButton({ onClick }) {
  return (
    <div className="fixed top-4 left-4">
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 bg-white shadow rounded hover:shadow-lg"
      >
        <ArrowLeft size={18} />
        <span>Home</span>
      </button>
    </div>
  );
}