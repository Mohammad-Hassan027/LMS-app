import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { Link } from "react-router-dom";
// Make sure this path matches your project structure
import { courseCategories } from "@/config";

function Footer() {
  const socialLinks = [
    {
      icon: <GithubIcon className="w-5 h-5" />,
      url: "https://github.com/Mohammad-Hassan027",
      label: "GitHub",
    },
    {
      icon: <TwitterIcon className="w-5 h-5" />,
      url: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <LinkedinIcon className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/mohammad-hassan-shaikh",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-background border-t border-border text-foreground">
      <div className="container px-6 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <div className="h-10 w-auto flex items-center">
                <img
                  src="/logo.png"
                  alt="PathOS Logo"
                  className="h-full w-auto object-contain"
                  loading="lazy"
                />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Share your stories, ideas, and expertise with the world. Join our
              community of learners today.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider uppercase text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                ["Home", "/"],
                ["About Us", "/about"],
                ["Contact", "/contact"],
                ["Explore Courses", "/courses"],
                ["Become an Instructor", "/become-instructor"],
              ].map((item) => (
                <li key={item[0]}>
                  <Link
                    to={item[1]}
                    className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    {item[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Categories */}
          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider uppercase text-foreground">
              Categories
            </h3>
            <ul className="space-y-4">
              {courseCategories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/courses?category=${category.id}`}
                    className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider uppercase text-foreground">
              Legal
            </h3>
            <ul className="space-y-4">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "GDPR",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PathOS. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <span className="text-red-500 animate-pulse">❤</span> by
            Mohammad Hassan
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
