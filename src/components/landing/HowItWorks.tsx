export function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Paste the job posting",
      desc: "We analyze requirements, detect red flags, extract what matters",
    },
    {
      num: "2",
      title: "Add your background",
      desc: "Paste anything - old CV, LinkedIn, notes. AI figures it out.",
    },
    {
      num: "3",
      title: "Get your application",
      desc: "Tailored CV, cover letter, match score. Download or apply.",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
