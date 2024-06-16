"use client";

/**
 * External dependencies.
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

/**
 * Internal dependencies.
 */
import { Breadcrumb } from "@components";

const Home = () => {
  return (
    <Breadcrumb>
      <section className="py-1">
        <div className="relative h-[300px] rounded overflow-hidden bg-cover bg-[50%] bg-no-repeat bg-[url('/img/contact-us-bg.jpg')]"></div>
        <div className="container px-6 md:px-12">
          <div className="block rounded-lg bg-[hsla(0,0%,100%,0.7)] px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-[hsla(0,0%,5%,0.7)] dark:shadow-black/20 md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px]">
            <div className="flex justify-center">
              <div className="mb-12 flex gap-6">
                <a
                  target="_blank"
                  href="https://github.com/DanfeCamp"
                  title="GitHub"
                >
                  <FontAwesomeIcon icon={faGithub} size="2xl" />
                  {/* <h6 className="font-medium">DanfeCamp</h6> */}
                </a>
                <a
                  target="_blank"
                  href="https://www.facebook.com/DanfeCamp"
                  title="Facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} size="2xl" />
                  {/* <h6 className="font-medium">DanfeCamp</h6> */}
                </a>
                <a
                  target="_blank"
                  href="https://www.instagram.com/DanfeCamp"
                  title="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} size="2xl" />
                  {/* <h6 className="font-medium">DanfeCamp</h6> */}
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="mx-auto max-w-[700px]">
              <form>
                <div className="relative mb-6">
                  <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="exampleInput90"
                    placeholder="Name"
                  />
                  <label
                    className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    htmlFor="exampleInput90"
                  >
                    Name
                  </label>
                </div>
                <div className="relative mb-6">
                  <input
                    type="email"
                    className="peer block min-h-[auto] w-full rounded border bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="exampleInput91"
                    placeholder="Email address"
                  />
                  <label
                    className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    htmlFor="exampleInput91"
                  >
                    Email address
                  </label>
                </div>
                <div className="relative mb-6">
                  <textarea
                    className="peer block min-h-[auto] w-full rounded border bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Your message"
                  ></textarea>
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                  >
                    Message
                  </label>
                </div>
                <button
                  type="button"
                  className="inline-block border w-full rounded px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-900 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] lg:mb-0"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Breadcrumb>
  );
};

export default Home;
