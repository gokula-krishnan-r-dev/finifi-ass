import ContainerHeader from "@/components/layout/container-header";
import FormList from "@/components/shared/form-list";
import MediaList from "@/components/shared/media-list";

export default function Home() {
  return (
    <main className="px-8 py-4">
      <ContainerHeader />
      <div className="flex mt-6">
        <FormList />
        <MediaList />
      </div>
    </main>
  );
}
