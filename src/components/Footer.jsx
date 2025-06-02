import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">MyCitiverse</h3>
            <p className="text-gray-400 max-w-xs">
              Connecting you to the best experiences in your city
            </p>
          </div>

          {/* Social links */}
          <div className="flex space-x-6">
            <a
            href="#!" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a
            href="https://twitter.com/MyCitiverse" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a
            href="https://www.instagram.com/mycitiverse" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} MyCitiverse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
