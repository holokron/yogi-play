import { ReactElement, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ContextProviders } from "@/ContextProviders";
import useInitialize from "@/hooks/useInitialize";
import { Layout } from "@/components/Layout";

const Sounds = lazy(() => import("@/routes/Sounds"));
const Favourites = lazy(() => import("@/routes/Favourites"));

export const APP_NAME = "Yogi PLAY";
export const APP_VERSION = "0.38.0";

function App(): ReactElement {
  useInitialize();

  return (
    <Layout>
      <Suspense>
        <Routes>
          <Route index path="/" element={<Sounds />} />
          <Route index path="/ulubione" element={<Favourites />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function AppWithProviders(): JSX.Element {
  return (
    <ContextProviders>
      <App />
    </ContextProviders>
  );
}
