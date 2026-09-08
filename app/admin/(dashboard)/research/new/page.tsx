import ResearchForm from "../ResearchForm";

export default function NewResearchPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Add research</h1>
      <ResearchForm research={null} />
    </div>
  );
}
