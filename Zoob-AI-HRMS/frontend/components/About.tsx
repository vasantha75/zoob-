export default function About() {
  return (
    <section
      id="about"
      className="bg-slate-900 text-white py-24 px-8"
    >
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center text-cyan-400">
          About Zoob AI Solutions
        </h2>

        <p className="text-center text-gray-400 mt-6 max-w-4xl mx-auto">
          Zoob AI Solutions Private Limited empowers organizations to harness
          Artificial Intelligence, Machine Learning, Cloud Computing,
          Computer Vision, Data Analytics, and Intelligent Automation
          for digital transformation.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          <div className="bg-slate-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-cyan-400">
              Our Vision
            </h3>

            <p className="mt-4 text-gray-300">
              To become a global AI company delivering innovative enterprise
              solutions.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-cyan-400">
              Our Mission
            </h3>

            <p className="mt-4 text-gray-300">
              Empower organizations through intelligent automation and secure
              digital platforms.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-cyan-400">
              AI Expertise
            </h3>

            <p className="mt-4 text-gray-300">
              Generative AI, Machine Learning, Computer Vision,
              Cloud Computing, and HRMS.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}