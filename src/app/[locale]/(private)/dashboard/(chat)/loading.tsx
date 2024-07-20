import Spinner from "@/components/common/Spinner";

export default function Loading() {
  return (
    <div className="flex items-center gap-x-2 px-6 py-4">
      Loading chat...
      <Spinner />
    </div>
  );
}
