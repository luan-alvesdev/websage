import React, { useState } from "react"; 
import Cards from "../components/Cards";

export default function Home() {
  const [activePage, setActivePage] = useState("index");
  const navigateToPage = (page) => {
    setActivePage(page);
  };

  return (
    <>
      {activePage === "index" && <Cards navigateToPage={navigateToPage} />}
      {activePage === "new" && <New navigateToPage={navigateToPage} />}
    </>
  );
}
