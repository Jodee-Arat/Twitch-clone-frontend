import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="flex justify-between mx-20">
        <header className="py-5 flex gap-4"></header>
        <Outlet />
      </div>
    </>
  );
}

export default App;
