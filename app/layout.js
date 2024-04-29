import { Inter } from "next/font/google";
import "@styles/globals.css";

import Navbar from "@components/NavarWithMegaMenu";
import Footer from "@components/FooterWithLogo";
import Container from "@components/Container";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SIA - Super Integrated App",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Container>
          <Navbar />
          <div className="container mx-auto py-8 flex flex-col gap-6">
            {children}
          </div>
          <Footer />
        </Container>
      </body>
    </html>
  );
}
