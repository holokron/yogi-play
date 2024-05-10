import { ReactElement } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Sounds from "./routes/Sounds";
import Favourites from "./routes/Favourites";
import Request from "./routes/Request";
import Footer from "./components/Footer";
import configureStore from "./store";

export const APP_NAME = "Yogi PLAY";
export const APP_VERSION = "0.37.2";

const store = configureStore();

export default function App(): ReactElement {
  return (
    <Provider store={store}>
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<Sounds />} />
            <Route path="/ulubione" element={<Favourites />} />
            <Route path="/dodaj" element={<Request />} />
          </Routes>
        </main>
        <Footer>v{APP_VERSION}&nbsp;</Footer>
      </Router>
    </Provider>
  );
}
