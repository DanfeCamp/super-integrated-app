"use client";

/**
 * Internal dependencies.
 */
import { AppCard } from "@components";
import { LIST_OF_APPS } from "@constants";

export default function Home() {
  const LIST_OF_TAGS = [
    ...new Set(
      LIST_OF_APPS.map((app) => app.tag, []).filter((tag) => tag !== "")
    ),
  ];

  return (
    <main className="flex flex-col gap-8 sm:gap-12">
      {/* Hero Section */}
      <div className="container py-8 sm:py-12 mx-auto">
        <div className="flex flex-col text-center w-full">
          <h2 className="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
            Welcome to Super Integrated App
          </h2>
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Your All-in-One Digital Companion
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Explore a world of convenience and functionality as we bring
            together a diverse array of tools to simplify your online
            experience. From inspiring quotes to handy utilities, entertainment,
            and productivity enhancers, everything you need is just a click
            away. Join us on this journey where convenience meets innovation.
            Let's dive in!
          </p>
        </div>
      </div>

      {LIST_OF_TAGS.map((tag) => {
        return (
          <div className="flex flex-col gap-4" key={tag}>
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
              <span className="text-gray-500">#</span> {tag}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
              {LIST_OF_APPS.filter((app) => app.tag === tag && app.isComplete === true)
                .slice(0, 8)
                .map((app) => {
                  return (
                    <AppCard
                      key={app.title}
                      title={`${app.title} ${app.icon}`}
                      link={app.link}
                      description={app.description}
                    />
                  );
                })}
            </div>
          </div>
        );
      })}
    </main>
  );
}
