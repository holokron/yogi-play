import { ReactElement, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ContextProviders } from "@/ContextProviders";
import useInitialize from "@/hooks/use-initialize";
import { Layout } from "@/components/Layout";

const Sounds = lazy(() => import("@/routes/Sounds"));
const Favourites = lazy(() => import("@/routes/Favourites"));
const CommandMenu = lazy(() => import("@/components/CommandMenu"));

export const APP_NAME = "Yogi PLAY";
export const APP_VERSION = "0.39.0";

function App(): ReactElement {
  useInitialize();

  return (
    <Layout>
      <Suspense>
        <Routes>
          <Route index path="/" element={<Sounds />} />
          <Route index path="/ulubione" element={<Favourites />} />
        </Routes>
        <CommandMenu />
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
