/**
 * External dependencies.
 */
import { LibreOfficeFileConverter } from "libreoffice-file-converter";

/**
 * Convert document types into different other document formats
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export const POST = async (req, res) => {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const outputFormat = formData.get("format");

    const formats = ["DOCX", "ODT", "PDF"];

    if (!file) {
      return new Response(JSON.stringify({ error: "No files received." }), {
        status: 400,
      });
    }

    if (!formats.includes(outputFormat?.toUpperCase())) {
      return new Response(JSON.stringify({ error: "No format selected." }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalFilename = file.name.replaceAll(" ", "_");
    const newFilename = originalFilename.replace(
      /\.\w+$/,
      `.${outputFormat.toLowerCase()}`
    );

    if (Buffer.byteLength(buffer) >= 104857600) {
      // 100 MB limit
      return new Response(
        JSON.stringify({ error: "File size exceeds limit." }),
        {
          status: 400,
        }
      );
    }

    const libreOfficeFileConverter = new LibreOfficeFileConverter();

    const outputBuffer = await libreOfficeFileConverter.convertBuffer(
      buffer,
      outputFormat
    );

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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
