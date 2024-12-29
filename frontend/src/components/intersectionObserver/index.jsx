/**
 * Intersection Observer Component
 * 
 * A React component that implements infinite scrolling functionality using the Intersection Observer API.
 * When the observed element comes into view, it triggers the next page load if more content is available.
 */

import React, { useEffect, useRef } from "react";
import "./observer.scss";

/**
 * IntersectionObserverComponent handles infinite scroll functionality
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Function} props.next - Callback function to load next page of content
 * @param {boolean} props.hasMore - Flag indicating if more content is available
 * @returns {JSX.Element} Component with infinite scroll functionality
 */
const IntersectionObserverComponent = ({ children, next, hasMore }) => {
  // Reference to the observed element
  const observerRef = useRef(null);
  // Flag to prevent loading on initial mount
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Initialize Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        // Skip the first intersection on mount
        if (isInitialMount.current) {
          isInitialMount.current = false;
          return;
        }

        const [entry] = entries;
        // Trigger next page load when element is visible and more content exists
        if (entry.isIntersecting && hasMore) {
          next();
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: "20px", // Trigger slightly before element is visible
        threshold: 0.1, // Trigger when 10% of element is visible
      }
    );

    // Start observing the target element
    const currentElement = observerRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    // Cleanup observer on unmount
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