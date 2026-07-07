export default function WhyChoose() {
  const features = [
    {
      title: "AI Powered",
      description: "Built with Artificial Intelligence and Machine Learning.",
      icon: "🤖",
    },
    {
      title: "Secure Platform",
      description: "Enterprise-grade security with role-based access.",
      icon: "🔒",
    },
    {
      title: "Fast Performance",
      description: "Optimized for speed using Next.js and FastAPI.",
      icon: "⚡",
    },
    {
      title: "Cloud Ready",
      description: "Deploy easily on AWS, Azure, or Google Cloud.",
      icon: "☁️",
    },
  ];

  return (
    <section className="bg-slate-950 text-white py-24 px-8">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center text-cyan-400">
          Why Choose Zoob AI?
        </h2>

        <p className="text-center text-gray-400 mt-6 max-w-3xl mx-auto">
          Our HRMS platform combines Artificial Intelligence, cloud technologies,
          and enterprise-grade security to simplify workforce management.
        </p>

        <div className="grid md:grid-cols-4 gap-8 mt-16">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-8 text-center hover:scale-105 transition duration-300"
            >
              <div className="text-5xl">{item.icon}</div>

              <h3 className="text-2xl font-bold mt-5 text-cyan-400">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}