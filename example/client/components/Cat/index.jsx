import React, { useEffect } from "react";
import { fetchCatData } from "./fetch";
import { createSuspenseSyncHook } from "../../../../index";

const useSuspenseSyncCat = createSuspenseSyncHook(fetchCatData);

const Cat = () => {
  const data = useSuspenseSyncCat();

  useEffect(() => {
    console.log("Cat mounted~");
  }, []);

  return (
    <div style={{ border: "1px solid black", margin: "4px 0", padding: 4 }}>
      <div>This is the cat component</div>
      <p>{data}</p>
    </div>
  );
};

export default Cat;
