export const metadata = {
  title: "SIA - Apps",
  description: "",
};

export default function PageLayout({ children }) {
  return <div className="flex flex-col gap-2 sm:gap-4">{children}</div>;
}
