export default function Dashboard() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="bg-gray-900 p-4 rounded">
        <div className="text-gray-400 text-sm">Total Movies</div>
        <div className="text-2xl font-bold">—</div>
      </div>
      <div className="bg-gray-900 p-4 rounded">
        <div className="text-gray-400 text-sm">Total Shows</div>
        <div className="text-2xl font-bold">—</div>
      </div>
      <div className="bg-gray-900 p-4 rounded">
        <div className="text-gray-400 text-sm">Revenue</div>
        <div className="text-2xl font-bold">—</div>
      </div>
    </div>
  )
}
