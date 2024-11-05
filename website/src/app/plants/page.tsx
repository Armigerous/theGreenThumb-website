// Main plants listing page
import PlantCard from "@/components/PlantDatabase/PlantCard";
import SearchForm from "@/components/PlantDatabase/PlantSearch";
import Image from "next/image";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const plants = [
    {
      _id: 2322,
      scientificName: "Acorus calamus",
      commonName: "Sweet Flag",
      img: {
        img: "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/Acorus_calamus-close_up_of_leaf_blade-Krzysztof_Ziarnek-CC_BY-SA_3.0.jpeg",
        thumbnail_med:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_med/Acorus_calamus-close_blKuuWY379qh.jpeg",
        thumbnail_small:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_sm/Acorus_calamus-close_6HHmOoiXBX20.jpeg",
        alt_text: "Acorus calamus",
        caption: "Leaf Blade",
        attribution: "Krzysztof Ziarnek",
      },
    },
    {
      _id: 576,
      scientificName: "Acorus calamus 'Variegatus'",
      commonName: "Variegated Sweet Flag",
      img: {
        img: "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/Acorus_calamus_Vari_vdHEJ6qDBSU9.jfif",
        thumbnail_med:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_med/Acorus_calamus_Vari__n0GQsS8bdo1B.jfif",
        thumbnail_small:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_sm/Acorus_calamus_Vari__FhdQcV8gO7B3.jfif",
        alt_text: "Leaf close up",
        caption: "Leaf close up",
        attribution: "David J.Stang",
      },
    },
    {
      _id: 3946,
      scientificName: "Agastache  'Acapulco Orange'",
      commonName: "'Acapulco Orange' Giant Hyssop",
      img: {
        img: "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/Agastache__Acapulco_85fIApcuw3tx.jfif",
        thumbnail_med:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_med/Agastache__Acapulco_KRVpsOGqYZif.jfif",
        thumbnail_small:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_sm/Agastache__Acapulco_Mwu3Xcg8eIwE.jfif",
        alt_text: "Form",
        caption: "Form",
        attribution: "K. Andre",
      },
    },
    {
      _id: 4619,
      scientificName: "Agave virginica",
      commonName: "American Agave",
      img: {
        img: "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/Agave_virginica_John_D2iJt0Sx87U0.jpe",
        thumbnail_med:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_med/Agave_virginica_John_XNus5xMnmpMs.jpe",
        thumbnail_small:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_sm/Agave_virginica_John_DJwPPpFeCXti.jpe",
        alt_text: "Agave virginica",
        caption: "Basal rosette of leaves",
        attribution: "John Brandauer",
      },
    },
    {
      _id: 947,
      scientificName: "Agrostemma githago",
      commonName: "Cockle",
      img: {
        img: "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/Agrostemma_githago_f_r8l7FvqKYgSl.jpg",
        thumbnail_med:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_med/Agrostemma_githago_f_jnAOIa6HUZBR.jpeg",
        thumbnail_small:
          "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/thumb_sm/Agrostemma_githago_f_ehmYH0O2cQK8.jpeg",
        alt_text: "form",
        caption: "form",
        attribution: "Nicolas Weghaupt",
      },
    },
  ];

  return (
    <>
      <section className="max-w-7xl mx-auto px-6">
        <div className="space-y-4 ">
          <Image
            src="/plant-search.png"
            alt="plants"
            width={300}
            height={200}
            className="w-full"
            priority
          />
          <div className=" flex flex-col gap-5 items-center justify-start pt-[12vh] text-center">
            <div>
              <h2 className="tracking-normal text-[5vh] md:text-[8vh] text-green font-bold text-shadow-sm shadow-dark">
                Discover
              </h2>
              <h2 className="text-[3vh]">Amazing Plants in North Carolina</h2>
            </div>
          </div>
        </div>

        <SearchForm query={query} />

        <section>
          <p className="">
            {query ? `Search results for "${query}"` : "All Plants"}
          </p>

          <div className="mt-7 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 place-content-center w-full">
            {plants?.length > 0 ? (
              plants.map((plant: PlantCardType, index: number) => (
                <PlantCard key={plant?._id} plant={plant} />
              ))
            ) : (
              <p> No plants found</p>
            )}
          </div>
        </section>
      </section>
    </>
  );
}
