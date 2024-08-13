import { useEffect } from "react";

const RefreshPage = ({ refreshTime }: { refreshTime: number }) => {
  useEffect(() => {
    // Function to reload the page
    const refreshPage = () => {
      window.location.reload();
    };

    const intervalId = setInterval(refreshPage, refreshTime * 60 * 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return null; // This component doesn't render anything
};

export default RefreshPage;
