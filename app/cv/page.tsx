import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

const skills = [
  "Python",
  "JavaScript",
  "C/C++",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "YOLOv5-v11",
  "Generative Models",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "MySQL",
  "BioPython",
  "Protein-Ligand Modeling",
  "Roboflow",
  "Google Colab",
  "Kaggle",
  "Jupyter Notebook",
];

export default async function CVPage() {
  const { data: profile } = await supabase
    .from("profile")
    .select("cv_url")
    .limit(1)
    .single();

  const { data: education } = await supabase
    .from("education")
    .select("*")
    .order("display_order", { ascending: true });

  const { data: experience } = await supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true });

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
            CV
          </h1>
          {profile?.cv_url ? (
            <a
              href={profile.cv_url}
              className="inline-flex items-center bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-moss-dark"
            >
              Download PDF
            </a>
          ) : null}
        </div>
      </section>

      {education && education.length > 0 ? (
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <h2 className="font-serif text-2xl mb-8">Education</h2>
            <ul className="space-y-8">
              {education.map((edu) => (
                <li key={edu.id}>
                  <p className="font-serif text-lg">{edu.degree}</p>
                  <p className="mt-1 text-sm text-muted">
                    {edu.university}
                    {edu.location ? ", " + edu.location : ""}
                    {edu.cgpa ? " \u00B7 CGPA " + edu.cgpa : ""}
                  </p>
                  {edu.description ? (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
                      {edu.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {experience && experience.length > 0 ? (
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <h2 className="font-serif text-2xl mb-8">Experience</h2>
            <ul className="space-y-8">
              {experience.map((exp) => (
                <li key={exp.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-serif text-lg">{exp.role}</p>
                    <p className="text-sm text-muted">
                      {exp.start_date}
                      {exp.end_date ? " \u2013 " + exp.end_date : ""}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {exp.organization}
                    {exp.location ? ", " + exp.location : ""}
                  </p>
                  {exp.description ? (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
                      {exp.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {certifications && certifications.length > 0 ? (
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <h2 className="font-serif text-2xl mb-8">Certifications</h2>
            <ul className="space-y-5">
              {certifications.map((cert) => (
                <li
                  key={cert.id}
                  className="flex flex-wrap items-baseline justify-between gap-2"
                >
                  <div>
                    <p className="font-serif text-lg">{cert.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {cert.issuer}
                      {cert.date ? " \u00B7 " + cert.date : ""}
                    </p>
                  </div>
                  {cert.certificate_url ? (
                    <a
                      href={cert.certificate_url}
                      className="text-sm text-moss hover:text-moss-dark"
                    >
                      View certificate
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="font-serif text-2xl mb-8">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink/70"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
