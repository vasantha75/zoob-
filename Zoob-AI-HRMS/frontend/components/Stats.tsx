export default function Stats() {
  const stats = [
    {
      number: "500+",
      title: "Employees Managed",
    },
    {
      number: "100+",
      title: "Enterprise Clients",
    },
    {
      number: "25+",
      title: "AI Projects",
    },
    {
      number: "99.9%",
      title: "System Uptime",
    },
  ];

  return (
    <section className="bg-cyan-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {stats.map((item, index) => (

            <div
              key={index}
              className="text-center"
            >

              <h2 className="text-5xl font-bold">
                {item.number}
              </h2>

              <p className="mt-3 text-lg">
                {item.title}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}