import { Product } from "@/types";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition border-slate-300">
      <div className="flex justify-between">
        <h2 className=" font-semibold">{product.name}</h2>
        <Link
          href={`/products/edit/${product.id}`}
          className="bg-blue-600 px-2 py-1 rounded-md text-white mr-2 ml-auto text-sm"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
