export default function AiRequestRowSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 animate-pulse">
          <td className="px-5 py-4">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
          <td className="px-5 py-4">
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="w-32 h-3 bg-gray-100 dark:bg-gray-900 rounded" />
            </div>
          </td>
          <td className="px-5 py-4">
            <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
          </td>
          <td className="px-5 py-4 max-w-xs">
            <div className="w-48 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
          <td className="px-5 py-4 max-w-xs">
            <div className="w-48 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
          <td className="px-5 py-4">
            <div className="w-16 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
          </td>
          <td className="px-5 py-4">
            <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
          <td className="px-5 py-4">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
          <td className="px-5 py-4">
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded" />
          </td>
        </tr>
      ))}
    </>
  );
}
