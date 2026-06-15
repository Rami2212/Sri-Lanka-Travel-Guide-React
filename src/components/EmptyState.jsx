const EmptyState = ({ title, message, action }) => (
  <section className="rounded-[2rem] border border-dashed border-lagoon-200 bg-white/75 p-6 text-center shadow-soft">
    <h2 className="font-display text-2xl font-black text-slate-950">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </section>
);

export default EmptyState;
