import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-primary/20 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-transform hover:scale-110">
            <span className="text-lg font-bold text-white">S</span>
          </div>
              <span className="text-xl font-bold">SDA</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Revolutionizing team development with AI-powered collaboration and real-time code execution.
            </p>
           <div className="flex gap-4">
  <a
    href="https://github.com/piyushthawale19"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/20 flex items-center justify-center transition-colors"
  >
    <Github className="w-5 h-5" />
  </a>

  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/20 flex items-center justify-center transition-colors"
  >
    <Twitter className="w-5 h-5" />
  </a>

  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/20 flex items-center justify-center transition-colors"
  >
    <Linkedin className="w-5 h-5" />
  </a>

  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/20 flex items-center justify-center transition-colors"
  >
    <Mail className="w-5 h-5" />
  </a>
</div>

          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

            <div className="pt-8 border-t border-primary/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground block">
                © 2025 Smart Developer Assistant. All rights reserved.
                {/* <samp className="mt-2 block">Built with ❤️ by the SDA Team.</samp> */}
                {/* <br  />
                <span className="text-purple-600 font-semibold">1.Piyush Thawale</span>
                <br  />
                <span className="text-purple-600 font-semibold">2.Abhishek Patil</span>
                <br />
                <span className="text-purple-600 font-semibold">3.Siddharth Khandare</span> */}
            </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
