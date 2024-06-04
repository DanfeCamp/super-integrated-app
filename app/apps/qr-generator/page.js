"use client";

/**
 * External dependencies.
 */
import React, { useState, useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import * as htmlToImage from "html-to-image";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";

const Home = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/apps/qr-generator", title: "QR Generator" },
  ];

  const [text, setText] = useState("");
  const qrCodeRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const downloadQR = () => {
    if (!qrCodeRef.current) return;

    htmlToImage.toPng(qrCodeRef.current).then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Sort Lists */}
        <div>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              className="p-4 flex min-h-[360px] max-h-[500px] overflow-y-scroll sia-scrollbar sia-scrollbar-light w-full rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onChange={handleTextChange}
              value={text}
              placeholder="Place your text here"
            ></textarea>
            <div
              className="w-full h-full grid place-content-center rounded-md border border-input bg-white text-sm shadow-sm"
              ref={qrCodeRef}
            >
              <QRCode value={text} size={256} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            <div className="flex gap-4 sm:gap-8">
              <button
                className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-blue-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                type="button"
                onClick={downloadQR}
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Users can input text they want to convert into a QR code into the
              text area. They can type or paste text directly into the text
              area.
            </li>
            <li className="ml-4">
              As users input or modify the text, the app provides a live preview
              of the generated QR code.
            </li>
            <li className="ml-4">
              The live preview of the generated QR code is prominently displayed
              within the app's interface, allowing users to see the visual
              representation of their input text in real-time.
            </li>
            <li className="ml-4">
              Users can scan the displayed QR code using a QR code scanner app
              or device camera. This allows them to extract the original text
              encoded within the QR code for various purposes.
            </li>
            <li className="ml-4">
              Users have the option to download the generated QR code as a PNG
              image file "<code>qrcode.png</code>" by clicking on a download
              button.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Home;
