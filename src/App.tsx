import { useState } from "react";
import logo from "./assets/logo.svg";

type View = "landing" | "login";

function App() {
  const [view, setView] = useState<View>("landing");

  if (view === "login") {
    return (
      <main className="page page-center page-narrow">
        <section className="card panel panel-wide">
          <div className="brand margin-bottom-sm">
            <img src={logo} alt="Blef logo" />
            <span>Blef / Login</span>
          </div>

          <form>
            <div className="form-row">
              <label className="label" htmlFor="username">Username</label>
              <input className="input" id="username" name="username" type="text" defaultValue="player_one" />
            </div>

            <div className="form-row form-row-last">
              <label className="label" htmlFor="password">Password</label>
              <input className="input" id="password" name="password" type="password" defaultValue="secret123" />
            </div>

            <button className="button primary button-block" type="button">Log In</button>
          </form>

          <button className="button ghost margin-top-sm" type="button" onClick={() => setView("landing")}>Back</button>
        </section>
      </main>
    );
  }

  return (
    <main className="page page-center">
      <section className="card panel panel-center">
        <img src={logo} alt="Blef logo" width={96} height={96} />
        <h1 className="title title-top">Blef</h1>
        <p className="subtitle">Read faces. Raise the stake. Call the bluff.</p>
        <div className="actions">
          <button className="button primary" type="button" onClick={() => setView("login")}>Login</button>
        </div>
      </section>
    </main>
  );
}

export default App;
