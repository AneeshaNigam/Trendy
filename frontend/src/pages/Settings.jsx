export default function Settings() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account preferences and data sources.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm selection:bg-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" defaultValue="Guest User" className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" defaultValue="hello@example.com" className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500" />
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Data Sources</h3>
          <p className="text-sm text-gray-500 mb-4">Select the platforms you want to gather trend signals from.</p>
          
          <div className="space-y-3">
            {['Hacker News', 'Reddit (r/technology, r/startups)', 'Product Hunt', 'GitHub Trending'].map((source, i) => (
              <label key={source} className="flex items-center gap-3">
                <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-500" />
                <span className="text-sm text-gray-800">{source}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
