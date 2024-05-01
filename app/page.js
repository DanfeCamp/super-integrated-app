"use client";

import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import AppCard from "@components/AppCard";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col gap-8 sm:gap-12">
      <div className="container py-8 sm:py-12 mx-auto">
        <div className="flex flex-col text-center w-full">
          <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
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
            onClick={() => router.push("/categories")}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
          <AppCard
            title={"Quotes 💭"}
            link={"/tools/quotes"}
            description={
              "Discover inspiration through an incredible selection of thought-provoking quotes to inspire, and motivate you."
            }
          />
          <AppCard
            title={"Jokes 🎭"}
            link={"/tools/jokes"}
            description={
              "Experience daily doses of laughter with a delightful array of humor, providing the perfect mood boost for every occasion."
            }
          />
          <AppCard
            title={"Timer ⏱️"}
            link={"/tools/timer"}
            description={
              "Enhance productivity and time management with timer, ensuring focused task completion."
            }
          />

          <AppCard
            title={"AI Prompts 🤖"}
            link={"/tools/ai-prompts"}
            description={
              "Unlock your creativity with AI Prompts, generating endless inspiration for your next project or idea."
            }
          />
          <AppCard
            title={"Image Editor 🖼️"}
            link={"/tools/image-editor"}
            description={
              "Refine visuals effortlessly using the Image Editor, ideal for enhancing photos and graphics."
            }
          />
          <AppCard
            title={"Video Editor 🎞️"}
            link={"/tools/image-editor"}
            description={
              "Elevate your videos with the Video Editor, offering powerful editing tools for professional-quality content."
            }
          />
          <AppCard
            title={"Audio Downloader 🎵"}
            link={"/tools/image-editor"}
            description={
              "Effortlessly download audio with the Audio Downloader, for offline enjoyment of your favorite music and podcasts."
            }
          />
          <AppCard
            title={"Video Downloader ▶️"}
            link={"/tools/image-editor"}
            description={
              "Effortlessly download videos with the Video Downloader, enabling offline viewing of your favorite content."
            }
          />
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
            onClick={() => router.push("/categories")}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
          <AppCard
            title={"Sitemap Compiler 🗊"}
            link={"/tools/sitemap-compiler"}
            description={
              "Simplify website organization with the Sitemap Compiler, making `sitemap.xml` generation effortless."
            }
          />
          <AppCard
            title={"Currency Converter 💲"}
            link={"/tools/currency-converter"}
            description={
              "Enable seamless currency conversion with the Currency Converter, offering up-to-date exchange rates."
            }
          />
          <AppCard
            title={"QR Generator 🏁"}
            link={"/tools/qr-generator"}
            description={
              "Generate QR codes instantly with the QR Generator, simplifying data sharing and communication."
            }
          />
          <AppCard
            title={"PDF Generator 📄"}
            link={"/tools/pdf-generator"}
            description={
              "Create PDFs instantly with the PDF Generator, simplifying document creation and sharing."
            }
          />
          <AppCard
            title={"Cookie Details 🍪"}
            link={"/tools/cookie-details"}
            description={
              "Gain insight into website cookies with Cookie Details, offering transparency and browsing control."
            }
          />
          <AppCard
            title={"To-Do 🎯"}
            link={"/tools/to-do"}
            description={
              "Stay organized and on top of your tasks with the To-Do App for management of your daily agenda and deadlines."
            }
          />
          <AppCard
            title={"World Clock 🕓"}
            link={"/tools/world-clock"}
            description={
              "Keep track of time around the globe with the World Clock, providing real-time updates for various time zones."
            }
          />
          <AppCard
            title={"Summary Generator 🗒"}
            link={"/tools/summary-generator"}
            description={
              "Save time by reading summaries generated by the Summary Generator instead of reading lengthy articles."
            }
          />
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
            onClick={() => router.push("/categories")}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
          <AppCard
            title={"Quiz 🤔"}
            link={"/games/quiz"}
            description={
              "Test your knowledge with the Quiz App, featuring fun and challenging questions on various topics."
            }
          />
          <AppCard
            title={"Word Scramble 🔠"}
            link={"/games/word-scramble"}
            description={
              "Challenge your vocabulary and unscramble words to test your skills with the Word Scramble game."
            }
          />
          <AppCard
            title={"Tic-Tac-Toe ⭕❌"}
            link={"/games/tic-tac-toe"}
            description={
              "Enjoy classic fun and challenge your friends with the Tic-Tac-Toe game, perfect for passing the time."
            }
          />
          <AppCard
            title={"Hangman 🪝"}
            link={"/games/hangman"}
            description={
              "Guess the word and test your vocabulary skills with the Hangman game, fun for players of all ages."
            }
          />
          <AppCard
            title={"Snake 🐍"}
            link={"/games/snake"}
            description={
              "Navigate the snake and gobble up food to grow longer in the Snake game, a timeless classic for all ages."
            }
          />
          <AppCard
            title={"Crossword ✍"}
            link={"/games/to-do"}
            description={
              "Challenge yourself with the interactive Crossword puzzle, perfect for word enthusiasts."
            }
          />
          <AppCard
            title={"Trivia 🧩"}
            link={"/games/trivia"}
            description={
              "Test your knowledge and have fun with the Trivia game, offering questions on a variety of topics."
            }
          />
          <AppCard
            title={"Ping Pong ⚾"}
            link={"/games/ping-pong"}
            description={
              "Compete in a fast-paced game of Ping Pong, perfect for some quick entertainment."
            }
          />
        </div>
      </div>

      {/* Trending Tools */}
      {/* <div className="flex flex-col gap-2 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          <span className="text-gray-500">#</span> Trending Tools
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
          <AppCard
            title={"Password Generator 🗊"}
            link={"/tools/password-generator"}
            description={
              "Simplify website organization with the Sitemap Compiler, making `sitemap.xml` generation effortless."
            }
          />
          <AppCard
            title={"Currency Converter 💲"}
            link={"/tools/currency-converter"}
            description={
              "Enable seamless currency conversion with the Currency Converter, offering up-to-date exchange rates."
            }
          />
          <AppCard
            title={"QR Generator 🏁"}
            link={"/tools/qr-generator"}
            description={
              "Generate QR codes instantly with the QR Generator, simplifying data sharing and communication."
            }
          />
          <AppCard
            title={"PDF Generator 📄"}
            link={"/tools/pdf-generator"}
            description={
              "Create PDFs instantly with the PDF Generator, simplifying document creation and sharing."
            }
          />
          <AppCard
            title={"Cookie Details 🍪"}
            link={"/tools/cookie-details"}
            description={
              "Gain insight into website cookies with Cookie Details, offering transparency and browsing control."
            }
          />
          <AppCard
            title={"To-Do 🎯"}
            link={"/tools/to-do"}
            description={
              "Stay organized and on top of your tasks with the To-Do App for management of your daily agenda and deadlines."
            }
          />
          <AppCard
            title={"World Clock 🕓"}
            link={"/tools/world-clock"}
            description={
              "Keep track of time around the globe with the World Clock, providing real-time updates for various time zones."
            }
          />
          <AppCard
            title={"Summary Generator 🗒"}
            link={"/tools/summary-generator"}
            description={
              "Save time by reading summaries generated by the Summary Generator instead of reading lengthy articles."
            }
          />
        </div>
      </div> */}
    </main>
  );
}
