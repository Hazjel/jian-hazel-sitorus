import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("visible");

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage("fadeOut");
    }
  }, [children, displayChildren]);

  const handleTransitionEnd = () => {
    if (transitionStage === "fadeOut") {
      setDisplayChildren(children);
      setTransitionStage("fadeIn");
      window.scrollTo(0, 0);
    } else if (transitionStage === "fadeIn") {
      setTransitionStage("visible");
    }
  };

  return (
    <div
      className={`page-transition ${
        transitionStage === "fadeOut"
          ? "opacity-0 translate-y-2"
          : transitionStage === "fadeIn"
          ? "opacity-100 translate-y-0"
          : "opacity-100 translate-y-0"
      }`}
      style={{
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
