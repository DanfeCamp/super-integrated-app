/**
 * External dependencies.
 */
import { Inter } from "next/font/google";

/**
 * Internal dependencies.
 */
import "@styles/globals.css";
import { Navbar, Footer, Container } from "@components";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SIA - Super Integrated App",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + " sia-scrollbar sia-scrollbar-light"}>
        <Container>
          <Navbar />
          <div className="mx-auto px-4 py-8 w-full">{children}</div>
          <Footer />
        </Container>
      </body>
    </html>
  );
}
