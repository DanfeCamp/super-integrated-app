"use client";

import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import AppCard from "@components/AppCard";
import { LIST_OF_APPS } from "@utils";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col gap-8 sm:gap-12">
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

      {/* General Tools */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            <span className="text-gray-500">#</span> General Tools
          </h1>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => router.push("/list-of-apps")}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
          {LIST_OF_APPS.filter((app) => app.tag === "general")
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

      {/* Latest Tools */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            <span className="text-gray-500">#</span> Latest Tools
          </h1>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => router.push("/list-of-apps")}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
          {LIST_OF_APPS.filter((app) => app.tag === "latest")
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

      {/* Games */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            <span className="text-gray-500">#</span> Games
          </h1>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => router.push("/list-of-apps")}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
          {LIST_OF_APPS.filter((app) => app.tag === "game")
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
    </main>
  );
}
