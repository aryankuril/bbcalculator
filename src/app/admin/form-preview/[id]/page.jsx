'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FormPreviewPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`/api/getFormById?id=${id}`);
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchForm();
  }, [id]);

  // if (!formData) return <div className="flex items-center justify-center min-h-[100vh]  bg-white">
  //     {/* <img src="/BB-web-chai-1.gif" alt="Loading..." className="w-60 h-60" /> */}
  //   </div>;

  return (
<div className="min-h-screen flex items-center justify-center">
  <div
    className="max-w-3xl w-full p-6 flex flex-col
               md:p-[20px_20px]
               bg-white rounded-[8px] border border-[#1E1E1E]
               shadow-[6px_5px_0px_0px_#262626]"
  >
    <h2 className="text-2xl font-bold mb-4 text-center">Customer Quotation Preview</h2>

    <div className="mb-4">
      <strong>Name:</strong> {formData.name || "N/A"}
    </div>
    <div className="mb-4">
      <strong>Email:</strong> {formData.email || "N/A"}
    </div>
    <div className="mb-4">
      <strong>Phone:</strong> {formData.phone || "N/A"}
    </div>
    <div className="mb-4">
      <strong>Service:</strong> {formData.serviceCalculator || "N/A"}
    </div>
    <div className="mb-4">
      <strong>Final Price:</strong>{" "}
      {formData.finalPrice
        ? `₹${formData.finalPrice.toLocaleString("en-IN")}`
        : "N/A"}
    </div>

    <div className="mb-4">
      <strong>Quotation:</strong>
      <div className="mt-2 p-4 bg-gray-100 rounded space-y-2">
        {Array.isArray(formData.quote) && formData.quote.length > 0 ? (
          formData.quote.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-1 last:border-b-0"
            >
              <span>
                {item.type} - {item.label}  < br/> 
                Option : {item.value}
              </span>
              <span>₹{item.price.toLocaleString("en-IN")}</span>
            </div>
          ))
        ) : (
          <div>N/A</div>
        )}
      </div>
    </div>
  </div>
</div>

  );
}
