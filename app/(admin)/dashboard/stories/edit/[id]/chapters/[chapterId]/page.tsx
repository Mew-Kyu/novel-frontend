import EditChapterPageClient from "./EditChapterPageClient";

export default async function EditChapterPage({
  params,
}: {
  params: { id: string; chapterId: string };
}) {
  const resolvedParams = await params;
  const storyId = parseInt(resolvedParams.id);
  const chapterId = parseInt(resolvedParams.chapterId);

  return <EditChapterPageClient storyId={storyId} chapterId={chapterId} />;
}
