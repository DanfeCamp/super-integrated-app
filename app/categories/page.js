import Breadcrumb from "@components/Breadcrumb";

export const metadata = {
  title: "SIA - Categories",
  description: "",
};

const Categories = () => {
  const paths = [{ link: "/categories", title: "Categories" }];

  return (
    <>
      <Breadcrumb paths={paths} />
    </>
  );
};

export default Categories;
