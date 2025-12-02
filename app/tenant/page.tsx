export default function TenantHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">Welcome</h1>
      <p className="text-gray-600">
        Manage your lease, payments, and maintenance requests from one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-5 bg-white rounded-xl shadow-sm border">
          <h3 className="font-semibold text-lg">Lease</h3>
          <p className="text-gray-500 mt-1">View your lease details</p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border">
          <h3 className="font-semibold text-lg">Payments</h3>
          <p className="text-gray-500 mt-1">Track your payment history</p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border">
          <h3 className="font-semibold text-lg">Maintenance</h3>
          <p className="text-gray-500 mt-1">Submit and track issues</p>
        </div>
      </div>
    </div>
  );
}
