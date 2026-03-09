import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  icon?: React.ElementType;
}

export function EmptyState({ message = "Start logging your progress to see insights.", icon: Icon = BarChart3 }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </motion.div>
  );
}
