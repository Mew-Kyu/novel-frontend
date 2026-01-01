import EditChapterPageClient from "./EditChapterPageClient";

export default function EditChapterPage({
  params,
}: {
  params: { id: string; chapterId: string };
}) {
  const storyId = parseInt(params.id);
  const chapterId = parseInt(params.chapterId);

  return <EditChapterPageClient storyId={storyId} chapterId={chapterId} />;
}
