import React from "react";
import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    x: "100vw", // Starts off the screen from the right
  },
  animate: {
    opacity: 1,
    x: 0, // Moves into place
  },
  exit: {
    opacity: 0,
    x: "-100vw", // Moves off the screen to the left
  },
};

const pageTransition = {
  duration: 0.5,
  ease: "easeInOut",
};

const PageTransitionWrapper = ({ children }: any) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransitionWrapper;
