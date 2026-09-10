import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import CategoriesManager from "./CategoriesManager";

export default async function AdminProjectCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("project_categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <Link
        href="/admin/projects"
        className="text-sm text-moss hover:text-moss-dark"
      >
        &larr; Back to projects
      </Link>
      <p className="text-sm text-muted mt-6 mb-10 max-w-xl">
        These categories power the filter pills at the top of your public
        Projects page. Add the options you want here, then select from them when
        creating or editing a project. Each project&apos;s free-text tags (shown
        as badges on the project card) are separate and unaffected.
      </p>
      <CategoriesManager initialCategories={categories ?? []} />
    </div>
  );
}
