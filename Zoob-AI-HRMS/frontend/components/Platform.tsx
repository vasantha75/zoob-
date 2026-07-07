export default function Platform() {
  return (
    <section
      id="platform"
      className="bg-slate-950 text-white py-24 px-8"
    >
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center text-cyan-400">
          Our Platform
        </h2>

        <p className="text-center text-gray-400 mt-6 max-w-3xl mx-auto">
          One intelligent platform with three powerful portals designed for
          Employees, HR Teams, and Administrators.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {/* Employee */}
          <div className="bg-slate-800 rounded-2xl p-8 hover:scale-105 transition duration-300">
            <div className="text-5xl">👨‍💼</div>

            <h3 className="text-2xl font-bold mt-4 text-cyan-400">
              Employee Portal
            </h3>

            <p className="mt-4 text-gray-300">
              View profile, attendance, salary, leave requests, notifications,
              and raise support tickets.
            </p>
          </div>

          {/* HR */}
          <div className="bg-slate-800 rounded-2xl p-8 hover:scale-105 transition duration-300">
            <div className="text-5xl">👩‍💼</div>

            <h3 className="text-2xl font-bold mt-4 text-purple-400">
              HR Portal
            </h3>

            <p className="mt-4 text-gray-300">
              Manage employees, attendance, notifications, leave approvals,
              and communicate with the admin team.
            </p>
          </div>

          {/* Admin */}
          <div className="bg-slate-800 rounded-2xl p-8 hover:scale-105 transition duration-300">
            <div className="text-5xl">🛡️</div>

            <h3 className="text-2xl font-bold mt-4 text-pink-400">
              Admin Portal
            </h3>

            <p className="mt-4 text-gray-300">
              Full system control including users, departments, tickets,
              reports, analytics, and platform settings.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}