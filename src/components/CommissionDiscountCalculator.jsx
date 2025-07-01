import React, { useState } from "react";

export default function CommissionDiscountCalculator() {
  const [totalBookingAmount, setTotalBookingAmount] = useState(500000);
  const [discountPercentOnBase, setDiscountPercentOnBase] = useState(5);
  const [commissionBaseAmount, setCommissionBaseAmount] = useState(45601);
  const gstRate = 18; // Fixed GST rate

  // Derived values
  const discountAmount = ((totalBookingAmount / 1.18) * discountPercentOnBase) / 100;
  const netTaxableValue = commissionBaseAmount - discountAmount;
  const gstAmount = (netTaxableValue * gstRate) / 100;
  const finalReceivable = netTaxableValue + gstAmount;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Commission & Discount Calculator</h2>

      <div className="space-y-3">
        <div>
          <label className="block font-medium">Total Hall Booking Amount (incl. GST):</label>
          <input
            type="number"
            value={totalBookingAmount}
            onChange={(e) => setTotalBookingAmount(Number(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Discount % on Base Booking Amount:</label>
          <input
            type="number"
            value={discountPercentOnBase}
            onChange={(e) => setDiscountPercentOnBase(Number(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Commission (Base Value before GST):</label>
          <input
            type="number"
            value={commissionBaseAmount}
            onChange={(e) => setCommissionBaseAmount(Number(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>

        <hr className="my-4" />

        <div className="bg-gray-100 p-3 rounded space-y-2">
          <p><strong>Discount to User:</strong> ₹{discountAmount.toFixed(2)}</p>
          <p><strong>Net Taxable Commission:</strong> ₹{netTaxableValue.toFixed(2)}</p>
          <p><strong>GST @ {gstRate}%:</strong> ₹{gstAmount.toFixed(2)}</p>
          <p className="text-lg font-bold"><strong>Total Receivable Amount (incl. GST):</strong> ₹{finalReceivable.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
