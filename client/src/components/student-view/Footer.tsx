import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { Link } from "react-router-dom";
// import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-gray-200/80">
      <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="logo"
                className="h-12 w-36 mr-2 bg-accent"
              />
            </Link>
            <p className="mb-4 text-sm text-gray-600">
              Share your stories, ideas, and expertise with the world.
            </p>
            <div className="flex gap-4">
              <Link
                to="https://github.com/Mohammad-Hassan027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500"
                aria-label="GitHub"
              >
                {/* <FaGithub size={20} /> */}
                <GithubIcon />
              </Link>
              <Link
                to="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500"
                aria-label="Twitter"
              >
                {/* <FaTwitter size={20} /> */}
                <TwitterIcon />
              </Link>
              <Link
                to="https://www.linkedin.com/in/mohammad-hassan-shaikh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-500"
                aria-label="LinkedIn"
              >
                {/* <FaLinkedin size={20} /> */}
                <LinkedinIcon />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Explore Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Programming
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Web Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500"
                >
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
