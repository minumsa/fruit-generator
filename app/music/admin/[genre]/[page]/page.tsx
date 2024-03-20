import { MusicLayout } from "@/app/music/components/MusicLayout";
import Content from "@/app/music/components/Content";
import { PageProps } from "@/app/music/modules/types";

export default async function Page({ params }: PageProps) {
  let currentGenre = params.genre;
  const currentPage = params.page;

  const genreFilters = currentGenre === "kpop" || currentGenre === "jpop";
  if (genreFilters) {
    currentGenre = currentGenre.slice(0, 1) + "-" + currentGenre.slice(1);
  }

  try {
    const pathName = currentGenre;
    const currentMethod = "별점";
    const currentCriteria = "내림차순";
    const currentTagKey = "";

    const queryString = `?pathName=${pathName}&currentPage=${currentPage}&currentMethod=${currentMethod}&currentCriteria=${currentCriteria}&currentTagKey=${currentTagKey}`;
    const url = `https://divdivdiv.com/music/api${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch music data");
    }

    const { slicedData, totalDataLength } = await response.json();

    return (
      <MusicLayout>
        <Content data={slicedData} totalDataLength={totalDataLength} currentPage={currentPage} />
      </MusicLayout>
    );
  } catch (error) {
    console.error(error);
  }
}
