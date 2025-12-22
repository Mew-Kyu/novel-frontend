import EditStoryPageClient from "./EditStoryPageClient";

// Server Component - handles async params
export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const storyId = parseInt(id);

  // Validate ID
  if (isNaN(storyId) || storyId <= 0) {
    return (
      <div className="max-w-4xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
            Invalid Story ID
          </h2>
          <p className="text-red-600 dark:text-red-400">
            The story ID provided is invalid. Please check the URL and try
            again.
          </p>
        </div>
      </div>
    );
  }

  return <EditStoryPageClient storyId={storyId} />;
}
