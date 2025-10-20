import { Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card/95 backdrop-blur mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <span className="font-medium">Powered by TechSanta</span>
            <span className="mx-2">|</span>
            <span>Reliable. Community-focused. Tech-savvy.</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <a 
              href="tel:+211924251197" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              +211 924 251 197
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
