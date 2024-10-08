/**
 * Internal dependencies.
 */
import { Breadcrumb, ClickableList } from "@components";
import { LIST_OF_APPS } from "@constants";

const Home = () => {
  return (
    <Breadcrumb>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 justify-center items-center">
        {LIST_OF_APPS.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0;
        }).map((app) => {
          return (
            <div
              key={app.title}
              className={`w-full rounded-lg border border-gray-200 shadow-sm ${
                app.isComplete ? "" : "hidden"
              }`}
              // className={`w-full rounded-lg border ${
              //   app.isComplete ? "border-green-600" : "border-red-600"
              // }`}
            >
              <ClickableList
                title={app.title}
                icon={app.icon}
                link={app.link}
                categories={app.categories}
              />
            </div>
          );
        })}
      </div>
    </Breadcrumb>
  );
};

export default Home;
