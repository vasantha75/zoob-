export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-3xl font-bold text-cyan-400">
              Zoob AI
            </h2>

            <p className="mt-4">
              AI Powered Enterprise HRMS Platform built using
              Next.js, FastAPI and PostgreSQL.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Company
            </h3>

            <ul className="space-y-2">
              <li>About</li>
              <li>Platform</li>
              <li>Services</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Support
            </h3>

            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Contact
            </h3>

            <p>Email: info@zoobai.com</p>
            <p>Phone: +91 9876543210</p>
            <p>Hyderabad, Telangana</p>
          </div>

        </div>

        <hr className="my-8 border-gray-700" />

        <p className="text-center">
          © 2026 Zoob AI Solutions Pvt. Ltd. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}