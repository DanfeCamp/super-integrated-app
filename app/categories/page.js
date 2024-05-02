import Breadcrumb from "@components/Breadcrumb";
import AppCard from "@components/AppCard";
import { LIST_OF_APPS } from "@utils";

const Categories = () => {
  const paths = [{ link: "/categories", title: "Categories" }];

  const LIST_OF_CATEGORIES = [
    ...new Set(
      LIST_OF_APPS.reduce((initial, app) => [...initial, ...app.categories], [])
    ),
  ].sort();

  return (
    <Breadcrumb paths={paths}>
      <div className="flex flex-col gap-8 sm:gap-12">
        {LIST_OF_CATEGORIES.map((category) => {
          return (
            <div className="flex flex-col gap-4" key={category}>
              <div className="flex justify-between">
                <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                  <span className="text-gray-500">#</span> {category}
                </h1>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
                {LIST_OF_APPS.filter((app) =>
                  app.categories.includes(category)
                ).map((app) => {
                  return (
                    <AppCard
                      key={app.title}
                      title={`${app.title} ${app.icon}`}
                      link={app.link}
                      description={app.description}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Breadcrumb>
  );
};

export default Categories;
