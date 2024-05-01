import Breadcrumb from "@components/Breadcrumb";

const Categories = () => {
  const paths = [{ link: "/categories", title: "Categories" }];

  return (
    <>
      <Breadcrumb paths={paths} />
    </>
  );
};

export default Categories;
