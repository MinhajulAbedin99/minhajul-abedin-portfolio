import ProjectForm from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Add project</h1>
      <ProjectForm project={null} />
    </div>
  );
}
