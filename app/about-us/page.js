import Breadcrumb from "@components/Breadcrumb";
import TeamMembers from "@components/TeamMembers";
import FAQAccordion from "@components/AboutUsFAQAccordion";

export const metadata = {
  title: "SIA - About Us",
  description: "",
};

const AboutUs = () => {
  const paths = [{ link: "/about-us", title: "About Us" }];

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumb paths={paths} />

      <div class="flex flex-col w-full">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 my-4 sm:my-6">
          Super Integrated App
        </h1>
        <p class="leading-relaxed text-base">
          Super Integrated App (SIA) is a comprehensive web platform providing
          free access to a diverse set of tools, all available in one central
          location. Simplify your online experience by utilizing a range of
          tools designed to meet different needs. Explore the possibilities with
          SIA, where convenience meets functionality.
        </p>
      </div>

      {/* Team Members */}
      <TeamMembers />

      {/* Accordion for FAQ */}
      <FAQAccordion />
    </>
  );
};

export default AboutUs;
