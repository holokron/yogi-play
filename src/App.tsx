import { ReactElement, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Footer from "@/components/Footer";
import configureStore from "@/store";

const Sounds = lazy(() => import("./routes/Sounds"));
const Favourites = lazy(() => import("./routes/Favourites"));

export const APP_NAME = "Yogi PLAY";
export const APP_VERSION = "0.37.2";

const store = configureStore();

export default function App(): ReactElement {
  return (
    <Provider store={store}>
      <Router>
        <main>
          <Suspense>
            <Routes>
              <Route path="/" element={<Sounds />} />
              <Route path="/ulubione" element={<Favourites />} />
            </Routes>
          </Suspense>
        </main>
        <Footer>v{APP_VERSION}&nbsp;</Footer>
      </Router>
    </Provider>
  );
}
