import PublicationForm from "../PublicationForm";

export default function NewPublicationPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Add publication</h1>
      <PublicationForm publication={null} />
    </div>
  );
}
