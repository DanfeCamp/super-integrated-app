/**
 * Internal dependencies.
 */
import { Breadcrumb, FAQAccordion } from "@components";

const Home = () => {
  return (
    <Breadcrumb>
      <div className="flex flex-col gap-4 sm:gap-8">
        {/* SIA */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Super Integrated App
          </h1>
          <p className="leading-relaxed text-base">
            Super Integrated App (SIA) stands as a beacon of convenience and
            functionality in the digital realm. With its expansive array of
            tools, all conveniently located within one platform, SIA offers
            users unparalleled access to a diverse toolkit. From simplifying
            everyday tasks to catering to specialized needs, SIA is the ultimate
            destination for those seeking efficiency and versatility. By
            bringing together a myriad of functions under a single roof, SIA
            empowers users to navigate their online endeavors with ease. Whether
            it's harnessing the power of quotes for inspiration or converting
            files with precision, SIA ensures that every interaction is seamless
            and every outcome is optimized. Embark on a journey of exploration
            and discovery with SIA, where the possibilities are limitless, and
            convenience reigns supreme.
          </p>
        </div>

        {/* Our Motive */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Our Motive
          </h1>
          <p className="leading-relaxed text-base">
            "Our Motive" at Super Integrated App is simple yet profound: to
            empower users with an unparalleled digital experience. We believe in
            streamlining online interactions and enhancing productivity through
            innovation and accessibility. Our goal is to provide a comprehensive
            suite of tools and resources conveniently housed under one platform,
            enabling users to accomplish tasks efficiently and effectively.
            Whether it's generating quotes to inspire creativity, converting
            files for seamless sharing, or editing images with precision, our
            motive remains steadfast—to simplify digital workflows and enrich
            the online journey for everyone. We're driven by the desire to
            elevate your digital experience.
          </p>
        </div>

        {/* Accordion for FAQ */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            FAQ
          </h1>
          <FAQAccordion />
        </div>
      </div>
    </Breadcrumb>
  );
};

export default Home;
