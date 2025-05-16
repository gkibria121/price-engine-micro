import { motion } from "framer-motion";

const ExpandableSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 1 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="overflow-hidden flex flex-col gap-4 pb-4"
    >
      {children}
    </motion.div>
  );
};

export default ExpandableSection;
