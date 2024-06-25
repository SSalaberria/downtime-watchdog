import { ImageWithFallback } from "~/common/ui";
import { TrackerDashboard } from "~/features/dashboard";
import { GetTrackerDocument } from "~/features/dashboard/gql/documents.generated";
import { getClient } from "~/lib/apollo";

export const dynamic = "force-dynamic";

export default async function TrackerPage({ params }: { params: { trackerId: string } }) {
  const { data } = await getClient().query({
    query: GetTrackerDocument,
    variables: { _id: params.trackerId },
  });

  return (
    <div className="mb-12 flex w-full flex-col md:mb-0">
      <div className="mx-auto flex items-center gap-2 py-2">
        <ImageWithFallback
          alt={`${data.tracker.website} favicon`}
          fallbackSrc="/images/loading.svg"
          height={40}
          src={`https://www.google.com/s2/favicons?domain=${data.tracker.website}&sz=64`}
          width={40}
        />
        <a
          className=" text-xl font-semibold text-white"
          href={data.tracker.website}
          target="_blank"
        >
          {data.tracker.website}
        </a>
      </div>
      <TrackerDashboard tracker={data.tracker} />
    </div>
  );
}
