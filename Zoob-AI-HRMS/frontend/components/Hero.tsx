export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center text-center px-6"
    >
      <h1 className="text-6xl md:text-7xl font-extrabold">
        AI Powered
        <br />
        Employee Management System
      </h1>

      <p className="mt-6 max-w-3xl text-xl text-gray-400">
        Zoob AI Solutions Private Limited empowers organizations with
        Artificial Intelligence, Machine Learning, Cloud Computing,
        Data Analytics and Intelligent Automation.
      </p>

      <div className="mt-10 flex gap-6">
        <button className="bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-xl font-semibold">
          Get Started
        </button>

        <button className="border border-cyan-500 hover:bg-cyan-500 px-8 py-3 rounded-xl font-semibold">
          Learn More
        </button>
      </div>
    </section>
  );
}