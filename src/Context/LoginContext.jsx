import { createContext, useState } from "react";

const Homecontext = createContext();

export default function HomeProvider({ children }) {
  const [homepass, setHomePass] = useState(false);

  return (
    <Homecontext.Provider value={{ homepass, setHomePass }}>
      {children}
    </Homecontext.Provider>
  );
}

export { Homecontext };
