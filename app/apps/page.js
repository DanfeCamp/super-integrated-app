import Breadcrumb from "@components/Breadcrumb";

export const metadata = {
  title: "SIA - Apps",
  description: "",
};

const Apps = () => {
  const paths = [{ link: "/apps", title: "Apps" }];

  return (
    <>
      <Breadcrumb paths={paths} />
    </>
  );
};

export default Apps;
