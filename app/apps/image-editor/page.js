"use client";

/**
 * External dependencies.
 */
import dynamic from "next/dynamic";
import "react-image-picker-editor/dist/index.css";

const ReactImagePickerEditor = dynamic(
  () => import("react-image-picker-editor"),
  { ssr: false }
);

/**
 * Internal dependencies.
 */
import { Breadcrumb, AppContainer } from "@components";

const Home = () => {
  const initialImage = "";
  const config = {
    borderRadius: "5px",
    language: "en",
    width: "320px",
    height: "auto",
    aspectRatio: 1 / 1,
    objectFit: "cover",
    compressInitial: null,
  };

  return (
    <Breadcrumb>
      <AppContainer>
        {/* Image Editor */}
        <ReactImagePickerEditor config={config} imageSrcProp={initialImage} />

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Click the camera icon to select an image from your device. This
              will open the file upload dialog. Choose the image you want to
              edit.
            </li>
            <li className="ml-4">
              Click the edit icon to begin editing the image.
            </li>
            <li className="ml-4">
              Use the editing tools provided to make adjustments to your image.
              You can crop, rotate, or apply filters as needed.
            </li>
            <li className="ml-4">
              Changes are previewed in real-time. However, please note that due
              to the high processing requirements, the image preview may take
              some time to update.
            </li>
            <li className="ml-4">
              Click the "Save" button to apply your edits and save the image.
              The edited image will then be available for download or further
              use.
            </li>
            <li className="ml-4">
              After saving, you can download the edited image to your device or
              share it as needed.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Home;
