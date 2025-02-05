import { createRoot } from "react-dom/client";
import { Pixi } from "./Pixi";
import { World } from "./World";

const App = () => {
  return <World />;
};

const root = createRoot(document.getElementById("app"));
root.render(<App />);
