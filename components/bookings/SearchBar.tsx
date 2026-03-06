import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="px-4 pb-4">
      <label className="flex w-full flex-col">
        <span className="sr-only">Search bookings</span>
        <div className="flex h-12 w-full items-stretch rounded-xl bg-semantic-global-neutral-lighter">
          <div className="flex items-center justify-center pl-4">
            <Search className="h-5 w-5 text-semantic-global-text-light" />
          </div>
          <input
            type="search"
            className="w-full border-none bg-transparent px-3 text-base font-normal text-semantic-global-text-default placeholder:text-semantic-global-text-light focus:outline-none focus:ring-0"
            placeholder="Search by unit number, ILU code, customer..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </label>
    </div>
  );
}
