const Container = ({ children }) => {
  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="py-4 flex flex-col justify-between min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Container;
