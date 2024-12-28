import React, { useEffect, useRef } from "react";
import "./observer.scss";

const IntersectionObserverComponent = ({ children, next, hasMore }) => {
  const observerRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Prevent triggering on initial mount
        if (isInitialMount.current) {
          isInitialMount.current = false;
          return;
        }

        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          next();
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    const currentElement = observerRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [next, hasMore]);

  return (
    <div className="observer-container">
      {children}
      <div ref={observerRef} style={{ height: "10px" }} />
      {hasMore && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default IntersectionObserverComponent;