// components/IncludedSection.jsx
const IncludedSection = ({ includes }) => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">What is Included?</h2>
      <div className="mt-4 flex flex-col gap-3">
        {includes.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-green-500">✔</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IncludedSection;
