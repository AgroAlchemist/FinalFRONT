import { useEffect, useState } from "react";

const Welcome = () => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch the HTML file");
        }
        return res.text(); // Read the response as text (since it's HTML)
      })
      .then((data) => {
        setHtmlContent(data); // Store the HTML content
      })
      .catch((error) => {
        console.error("Error fetching HTML:", error);
      });
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default Welcome;
