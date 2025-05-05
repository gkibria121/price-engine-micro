import { ArrowRight } from "lucide-react";
import React from "react";

function FormActions() {
  return (
    <div className="flex justify-end mt-8">
      <button className="bg-blue-600 text-white px-6 py-2 rounded flex items-center">
        Next
        <ArrowRight className="ml-2 w-4 h-4" />
      </button>
    </div>
  );
}

export default FormActions;
