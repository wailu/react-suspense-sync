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
    <div style={{ border: "1px solid black", margin: "4px 0", padding: 4 }}>
      <div>This is the duck component</div>
      <p style={{ backgroundColor: count % 2 !== 0 ? "gold" : "initial" }}>
        If I&apos;m blinking it means I&apos;ve been hydrated! I should be
        blinking before the cat component is loaded due to{" "}
        <b>selective hydration</b>.
      </p>
    </div>
  );
};

export default Duck;
