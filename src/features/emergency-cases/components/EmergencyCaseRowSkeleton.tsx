export default function EmergencyCaseRowSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 animate-pulse">
          {/* ID */}
          <td className="px-5 py-4">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
          {/* User ID */}
          <td className="px-5 py-4">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
          {/* Severity Level */}
          <td className="px-5 py-4">
            <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
          </td>
          {/* Case Summary */}
          <td className="px-5 py-4 max-w-xs">
            <div className="w-48 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
          {/* Created At */}
          <td className="px-5 py-4">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
          {/* Actions */}
          <td className="px-5 py-4">
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}
