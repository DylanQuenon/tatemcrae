import { useEffect } from "react";

const NewsPage = () => {
    useEffect(() => {
      document.title = "Tate McRae | News";
    })
  return ( 
    <>
      <h1>NewsPage</h1>
    </> 
  );
}
 
export default NewsPage;