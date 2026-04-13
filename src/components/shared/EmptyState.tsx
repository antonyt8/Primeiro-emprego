import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
}

const EmptyState = ({ icon: Icon = FolderOpen, title, description }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 mb-4">
      <Icon className="h-10 w-10 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

export default EmptyState;
