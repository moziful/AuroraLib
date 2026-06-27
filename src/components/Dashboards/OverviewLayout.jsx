"use client";

export default function OverviewLayout({ stats, charts }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Col 1: Stats Cards (Order 2 on mobile, 1 on desktop) */}
      <div className="order-2 lg:order-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          {stats}
        </div>
      </div>

      {/* Col 2: Charts (Order 1 on mobile, 2 on desktop) */}
      <div className="order-1 lg:order-2">
        {charts}
      </div>
    </div>
  );
}
