"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  return (
    <div className="w-full">
      <section className="py-12 lg:py-24 xl:py-32">
        <div className="container grid items-center gap-4 px-4 text-center md:gap-8 md:px-6 lg:grid-cols-2 lg:text-left">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Us
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Mission & Expertise
              </p>
            </div>
            <div className="prose max-w-none">
              <p>
                We help companies transform their business through data-driven
                insights and strategic guidance. Our team of experts is
                dedicated to delivering results and adding value at every step
                of the journey.
              </p>
            </div>
          </div>
          <div className="mx-auto">
            <img
              alt="Hero"
              className="rounded-xl"
              height="300"
              src="/placeholder.svg"
              style={{
                aspectRatio: "500/300",
                objectFit: "cover",
              }}
              width="500"
            />
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-24 xl:py-32">
        <div className="container grid items-center gap-4 px-4 text-center md:gap-8 md:px-6 lg:grid-cols-2 lg:text-left">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Team
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Experts & Innovators
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 border overflow-hidden dark:bg-gray-800">
                    <img
                      alt="Avatar"
                      className="rounded-full object-cover w-full h-full"
                      height="48"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "48/48",
                        objectFit: "cover",
                      }}
                      width="48"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold">Alice Smith</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Data Analyst
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500/70 dark:text-gray-400/70">
                  Alice is passionate about turning complex data into actionable
                  insights. With a background in statistics and machine
                  learning, she brings a data-driven approach to every project.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 border overflow-hidden dark:bg-gray-800">
                    <img
                      alt="Avatar"
                      className="rounded-full object-cover w-full h-full"
                      height="48"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "48/48",
                        objectFit: "cover",
                      }}
                      width="48"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold">Bob Johnson</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Business Strategist
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500/70 dark:text-gray-400/70">
                  Bob has over a decade of experience helping companies develop
                  growth strategies. He is a creative thinker who excels in
                  identifying new opportunities.
                </p>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-[400px] grid items-center justify-center gap-4">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm text-sm font-medium px-4 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              href="#"
            >
              Join the Team
            </Link>
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-24 xl:py-32">
        <div className="container grid items-center gap-4 px-4 text-center md:gap-8 md:px-6 lg:grid-cols-2 lg:text-left">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Values
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Guiding Principles
              </p>
            </div>
            <div className="prose max-w-none">
              <ul className="list-disc list-inside">
                <li>Customer Focus</li>
                <li>Innovation</li>
                <li>Integrity</li>
                <li>Collaboration</li>
                <li>Excellence</li>
              </ul>
            </div>
          </div>
          <div className="divide-y rounded-lg border">
            <div className="grid w-full grid-cols-3 items-stretch justify-center divide-x md:grid-cols-3">
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-3 items-stretch justify-center divide-x md:grid-cols-3">
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-24 xl:py-32">
        <div className="container grid items-center gap-4 px-4 text-center md:gap-8 md:px-6 lg:grid-cols-2 lg:text-left">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Clients
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Trusted Partners
              </p>
            </div>
            <div className="grid w-full grid-cols-2 items-center justify-center gap-4 md:grid-cols-4 lg:gap-8">
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <img
                  alt="Logo"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="70"
                  src="/placeholder.svg"
                  width="140"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-24 xl:py-32">
        <div className="container grid items-center gap-4 px-4 text-center md:gap-8 md:px-6 lg:grid-cols-2 lg:text-left">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Contact Us
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Get in Touch</p>
            </div>
            <div className="mx-auto max-w-[400px] space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 items-center gap-4">
                <label
                  className="text-sm font-medium tracking-wide"
                  htmlFor="name"
                >
                  Name
                </label>
                <Input
                  className="font-medium h-10 col-span-1"
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <label
                  className="text-sm font-medium tracking-wide"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  className="font-medium h-10 col-span-1"
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <label
                  className="text-sm font-medium tracking-wide"
                  htmlFor="subject"
                >
                  Subject
                </label>
                <Input
                  className="font-medium h-10 col-span-1"
                  id="subject"
                  placeholder="Enter your subject"
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 items-start gap-4">
                <label
                  className="text-sm font-medium tracking-wide"
                  htmlFor="message"
                >
                  Message
                </label>
                <Textarea
                  className="col-span-1"
                  id="message"
                  placeholder="Enter your message"
                />
              </div>
              <Button className="w-full md:w-auto">Submit</Button>
            </div>
          </div>
          <div className="mx-auto grid max-w-sm items-center justify-center gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium tracking-tighter">
                Want to work with us?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contact our team for personalized recommendations and support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
