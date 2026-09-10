import BlogForm from "../BlogForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Write post</h1>
      <BlogForm post={null} />
    </div>
  );
}
