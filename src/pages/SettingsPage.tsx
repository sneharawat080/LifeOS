import { motion } from "framer-motion";
import { User, Bell, Shield, CreditCard, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-header">Settings</h1>
        <p className="page-subtitle mt-1">Manage your account and preferences</p>
      </motion.div>

      {[
        { icon: User, title: "Profile", desc: "Update your name, email, and avatar", fields: [
          { label: "Name", value: "Alex Johnson" },
          { label: "Email", value: "alex@example.com" },
        ]},
        { icon: Bell, title: "Notifications", desc: "Configure alerts and reminders", fields: [
          { label: "Email Notifications", value: "Enabled" },
          { label: "Push Notifications", value: "Enabled" },
          { label: "Daily Summary", value: "8:00 AM" },
        ]},
        { icon: CreditCard, title: "Subscription", desc: "Manage your plan", fields: [
          { label: "Current Plan", value: "Pro Plan" },
          { label: "Billing", value: "$9.99/month" },
        ]},
        { icon: Shield, title: "Privacy", desc: "Data and security settings", fields: [
          { label: "Two-Factor Auth", value: "Enabled" },
          { label: "Data Export", value: "Available" },
        ]},
      ].map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <section.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{section.title}</p>
              <p className="text-xs text-muted-foreground">{section.desc}</p>
            </div>
          </div>
          <div className="space-y-3">
            {section.fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{f.label}</span>
                <span className="text-sm font-medium text-foreground">{f.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
