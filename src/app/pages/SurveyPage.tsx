export function SurveyPage() {
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-black text-[#333333]">NHL Shop NYC Survey</h1>
      </div>

      {/* Content */}
      <div className="flex-1 w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Survey Interface</h2>
          <p className="text-gray-500">The survey interface has been updated. Please use Survey V2.</p>
        </div>
      </div>
    </div>
  );
}
