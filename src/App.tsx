import { Suspense } from "react";
import AppRoutes from "./routes";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          Loading...
        </div>
      }
    >
      <AppRoutes />
    </Suspense>
  );
}

export default App;
