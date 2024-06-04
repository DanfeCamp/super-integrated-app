/**
 * External dependencies.
 */
import sharp from "sharp";

export const POST = async (req, res) => {
  const formData = await req.formData();

  const file = formData.get("file");
  const format = formData.get("format");

  const formats = ["PNG", "JPG", "JPEG", "WEBP", "AVIF"];

  if (!file) {
    return new Response(JSON.stringify({ error: "No files received." }), {
      status: 400,
    });
  }

  if (!formats.includes(format?.toUpperCase())) {
    return new Response(JSON.stringify({ error: "No format selected." }), {
      status: 400,
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const originalFilename = file.name.replaceAll(" ", "_");
  const newFilename = originalFilename.replace(/\.\w+$/, `.${format}`);

  if (Buffer.byteLength(buffer) >= 104857600) {
    return new Response(JSON.stringify({ error: "File size exceed limit." }), {
      status: 400,
    });
  }

  try {
    let sharpInstance = sharp(buffer);

    // Apply format-specific optimizations
    switch (format.toLowerCase()) {
      case "jpg":
      case "jpeg":
        sharpInstance = sharpInstance.jpeg({ quality: 90 }); // Adjust quality as needed
        break;
      case "png":
        sharpInstance = sharpInstance.png({ compressionLevel: 9 }); // Adjust compression level as needed
        break;
      case "webp":
        sharpInstance = sharpInstance.webp({ quality: 90 }); // Adjust quality as needed
        break;
      case "avif":
        sharpInstance = sharpInstance.avif({ quality: 90 }); // Adjust quality as needed
        break;
      default:
        throw new Error("Unsupported format");
    }

    const outputBuffer = await sharpInstance.toBuffer();

    return new Response(
      JSON.stringify({
        file: outputBuffer.toString("base64"),
        filename: newFilename,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(error.message, {
      status: 500,
    });
  }
};
