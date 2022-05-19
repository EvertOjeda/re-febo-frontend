import React from "react";
import Routes from "./routes/Routes";
import UserState from "./context/User/UserState";
function App() {
  return <UserState><Routes/></UserState>;
}
export default App;