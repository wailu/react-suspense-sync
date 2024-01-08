import React, { useEffect, useState } from "react";
import fetchDinoData from "./fetch";
import { createSuspenseSyncHook } from "../../../../index";

const useSuspenseSyncDino = createSuspenseSyncHook(fetchDinoData);

const Dino = () => {
  const [flag, setFlag] = useState(false);
  const data = useSuspenseSyncDino();

  useEffect(() => {
    console.log("Dino mounted~");
    return () => console.log("Dino unmounted~");
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFlag((flag) => !flag);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ border: "1px solid black", margin: "4px 0", padding: 4 }}>
      <div>This is the Dino component</div>
      <p style={{ backgroundColor: flag ? "white" : "gold" }}>{data}</p>
    </div>
  );
};

export default Dino;
