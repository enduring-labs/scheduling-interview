export const cellStyles = {
  unavailable: "bg-gray-50 border-gray-200",
  available: "bg-emerald-100 border-emerald-300",
  availableHover:
    "hover:bg-emerald-200 hover:ring-1 hover:ring-inset hover:ring-emerald-400",
  selected:
    "bg-blue-500 border-blue-600 text-white ring-1 ring-inset ring-blue-600",
  booked: "bg-green-100 border-green-300",
  assigned: "bg-blue-400 border-blue-500 text-white",
  empty: "bg-white border-gray-200",
  unselectedHover:
    "hover:bg-blue-50 hover:ring-1 hover:ring-inset hover:ring-blue-300",
} as const;

export const priorityBadge: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  normal: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-600",
};

export const priorityBlock: Record<string, string> = {
  urgent: "bg-red-200 border-red-300 text-red-900",
  high: "bg-orange-200 border-orange-300 text-orange-900",
  normal: "bg-blue-200 border-blue-300 text-blue-900",
  low: "bg-gray-200 border-gray-300 text-gray-800",
};
