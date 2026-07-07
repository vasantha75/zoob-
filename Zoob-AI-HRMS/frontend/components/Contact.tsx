export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-slate-900 text-white py-24 px-8"
    >
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-5xl font-bold text-cyan-400">
          Contact Us
        </h2>

        <p className="text-gray-400 mt-6">
          We'd love to hear from you. Reach out for AI solutions,
          HRMS implementation, or enterprise software services.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          <div className="bg-slate-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-cyan-400">
              📍 Address
            </h3>

            <p className="mt-4">
              Zoob AI Solutions Pvt. Ltd.
              <br />
              Hyderabad, Telangana
              <br />
              India
            </p>
          </div>

          <div className="bg-slate-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-cyan-400">
              📧 Email
            </h3>

            <p className="mt-4">
              info@zoobai.com
            </p>
          </div>

          <div className="bg-slate-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-cyan-400">
              📞 Phone
            </h3>

            <p className="mt-4">
              +91 9876543210
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}