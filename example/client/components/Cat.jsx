import React, { useEffect } from "react";
import { useSuspenseSync } from "../../../index";

const Cat = () => {
  const data = useSuspenseSync("mockFetchCatData");

  useEffect(() => {
    console.log("Cat mounted~");
  }, []);

  return (
    <>
      <div>This is the cat component</div>
      <p>{data}</p>
    </>
  );
};

export default Cat;
