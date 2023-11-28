import React, { useState, useEffect } from "react";

const Duck = () => {
  useEffect(() => {
    console.log("Duck mounted~");
  }, []);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount((count) => count + 1), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div>This is the duck component</div>
      <p style={{ backgroundColor: count % 2 !== 0 ? "gold" : "initial" }}>
        If I&apos;m blinking it means I have been hydrated!
      </p>
      <p>I should be blinking before the cat component has been loaded</p>
    </>
  );
};

export default Duck;
