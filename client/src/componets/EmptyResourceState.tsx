import Link from "next/link";
import pluralize from "pluralize";
export default function EmptyResourceState({
  resourceName,
  addResource,
}: {
  resourceName: string;
  addResource: string;
}) {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      <p className="mb-4">No {pluralize(resourceName)} found.</p>
      <Link href={addResource} className="text-blue-600 hover:underline">
        Add your first {resourceName}
      </Link>
    </div>
  );
}
