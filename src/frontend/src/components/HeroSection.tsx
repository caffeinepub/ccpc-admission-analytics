import { Award, GraduationCap, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { buet2024, medical2024, medical2025 } from "../data";

const stats = [
  {
    label: "BUET Admissions",
    value: buet2024.length,
    year: "HSC 2024",
    icon: GraduationCap,
    color: "text-gold",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
  {
    label: "Medical Admissions",
    value: medical2024.length,
    year: "HSC 2024",
    icon: Award,
    color: "text-teal",
    bg: "bg-accent/10",
    border: "border-accent/30",
  },
  {
    label: "Medical Admissions",
    value: medical2025.length,
    year: "HSC 2025",
    icon: TrendingUp,
    color: "text-gold",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
];

export default function HeroSection() {
  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* Background grid pattern */}
      <div className="absolute inset-0 hero-grid opacity-40" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative container max-w-7xl mx-auto px-4 pt-12 pb-10">
        {/* College Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono font-semibold text-gold tracking-widest uppercase">
              Official Analytics Dashboard
            </span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            <span className="text-foreground">Chattogram Cantonment</span>
            <br />
            <span className="text-gold">Public College</span>
          </h1>
          <p className="mt-3 text-muted-foreground font-body text-lg md:text-xl max-w-2xl">
            Excellence in Education —{" "}
            <span className="text-teal font-semibold">
              Admission Analytics Dashboard
            </span>
          </p>
          <p className="mt-1 text-muted-foreground/60 text-sm font-mono">
            CCPC · Tracking Success Across Bangladesh's Premier Institutions
          </p>
        </motion.div>

        {/* Stat Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={`${stat.label}-${stat.year}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className={`relative glass rounded-xl border ${stat.border} p-5 overflow-hidden`}
            >
              <div className={`inline-flex p-2.5 rounded-lg ${stat.bg} mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="stat-counter text-4xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm font-body font-semibold text-muted-foreground mt-1">
                {stat.label}
              </div>
              <div className={`text-xs font-mono ${stat.color} mt-0.5`}>
                {stat.year}
              </div>
              {/* Decorative corner */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} rounded-bl-3xl opacity-50`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/25 max-w-fit"
        >
          <span className="text-xl">🏆</span>
          <p className="text-sm font-body text-foreground/80">
            <span className="text-gold font-semibold">Tanrum Nur Seeam</span>{" "}
            secured{" "}
            <span className="text-gold font-bold">National Rank #143</span> —
            Dhaka Medical College (HSC 2025)
          </p>
        </motion.div>
      </div>
    </header>
  );
}
