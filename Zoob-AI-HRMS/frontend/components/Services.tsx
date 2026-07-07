export default function Services() {
  const services = [
    {
      title: "Artificial Intelligence",
      description: "Build intelligent applications using modern AI technologies.",
      icon: "🤖",
    },
    {
      title: "Machine Learning",
      description: "Predictive models and smart automation for enterprises.",
      icon: "🧠",
    },
    {
      title: "Cloud Computing",
      description: "Scalable cloud infrastructure and deployment solutions.",
      icon: "☁️",
    },
    {
      title: "Computer Vision",
      description: "Image processing, facial recognition and object detection.",
      icon: "👁️",
    },
    {
      title: "Data Analytics",
      description: "Transform business data into meaningful insights.",
      icon: "📊",
    },
    {
      title: "HRMS Solutions",
      description: "Complete employee lifecycle management platform.",
      icon: "💼",
    },
  ];

  return (
    <section
      id="services"
      className="bg-slate-900 text-white py-24 px-8"
    >
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center text-cyan-400">
          Our Services
        </h2>

        <p className="text-center text-gray-400 mt-6 max-w-3xl mx-auto">
          We provide cutting-edge AI solutions that help businesses innovate,
          automate, and grow faster.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-8 hover:scale-105 transition duration-300 shadow-lg"
            >
              <div className="text-5xl">{service.icon}</div>

              <h3 className="text-2xl font-bold mt-5 text-cyan-400">
                {service.title}
              </h3>

              <p className="mt-4 text-gray-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}