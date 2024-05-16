const SitemapPreview = ({ urls }) => {
  const sitemap = urls.map((url, index) => {
    return (
      <div key={index}>
        <p className="ml-4">
          <span className="text-gray-400">{"<"}</span>
          <span className="text-blue-400">{"url"}</span>
          <span className="text-gray-400">{">"}</span>
        </p>
        <span className="ml-8 text-gray-400">{"<"}</span>
        <span className="text-blue-400">{"loc"}</span>
        <span className="text-gray-400">{">"}</span>
        <span>{url}</span>
        <span className="text-gray-400">{"</"}</span>
        <span className="text-blue-400">{"loc"}</span>
        <span className="text-gray-400">{">"}</span>
        <p className="ml-4">
          <span className="text-gray-400">{"</"}</span>
          <span className="text-blue-400">{"url"}</span>
          <span className="text-gray-400">{">"}</span>
        </p>
      </div>
    );
  });

  return (
    <div className="p-4 bg-gray-900 shadow-sm rounded-md max-h-[500px] overflow-y-scroll sia-scrollbar sia-scrollbar-dark">
      <pre className="text-gray-200 text-sm">
        <p>
          <span className="text-gray-400">{"<?"}</span>
          <span className="text-blue-400">{"xml"}</span>{" "}
          <span className="text-light-blue-200">{"version"}</span>
          {`=`}
          <span className="text-amber-800">{'"'}</span>
          {`1.0`}
          <span className="text-amber-800">{'"'}</span>{" "}
          <span className="text-light-blue-200">{"encoding"}</span>
          {"="}
          <span className="text-amber-800">{'"'}</span>
          {"UTF-8"}
          <span className="text-amber-800">{'"'}</span>
          <span className="text-gray-400">{"?>"}</span>
        </p>
        <p>
          <span className="text-gray-400">{"<"}</span>
          <span className="text-blue-400">{"urlset"}</span>{" "}
          <span className="text-light-blue-200">{"xmlns"}</span>
          {`=`}
          <span className="text-amber-800">{'"'}</span>
          {`https://www.sitemaps.org/schemas/sitemap/0.9`}
          <span className="text-amber-800">{'"'}</span>
          <span className="text-gray-400">{">"}</span>
        </p>
        {sitemap}
        <p>
          <span className="text-gray-400">{"</"}</span>
          <span className="text-blue-400">{"urlset"}</span>
          <span className="text-gray-400">{">"}</span>
        </p>
      </pre>
    </div>
  );
};

export default SitemapPreview;
