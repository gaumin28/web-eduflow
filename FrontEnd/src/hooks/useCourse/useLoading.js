import { useEffect, useState } from "react";

const useLoading = (loading, minTime = 300) => {
  const [visible, setVisible] = useState(Boolean(loading));

  useEffect(() => {
    const delay = loading ? 0 : minTime;
    const timer = setTimeout(() => {
      setVisible(loading);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [loading, minTime]);

  return visible;
};

export default useLoading;
