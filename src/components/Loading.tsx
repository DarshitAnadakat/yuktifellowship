const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-16 h-16 rounded-full border-4 border-green-200 animate-pulse"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full animate-spin">
          <div className="w-16 h-16 rounded-full border-4 border-green-600 border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading; 