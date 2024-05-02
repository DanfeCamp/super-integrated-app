export const metadata = {
  title: "About Us",
  description: "",
};

export default function PageLayout({ children }) {
  return <div className="flex flex-col gap-2 sm:gap-4">{children}</div>;
}
