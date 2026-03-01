export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border mt-16 py-8 bg-background/80">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-display font-bold text-foreground">
              Chattogram Cantonment Public College
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Admission Analytics Dashboard · HSC 2024 & 2025
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Data sourced from official CCPC records and Udvash-Unmesh
              rankings.
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comparison data for peer colleges is estimated.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              © {year}. Built with ❤️ using{" "}
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
