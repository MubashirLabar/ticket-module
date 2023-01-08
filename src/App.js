import Routing from "./routes/Routing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// CSS
import "./assets/scss/index.scss";

function App() {
  return (
    <div className="App">
      <Routing />
      <ToastContainer
        autoClose={6000}
        position="top-right"
        className="toast-container"
      />
    </div>
  );
}

export default App;
