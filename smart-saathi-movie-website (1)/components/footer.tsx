export function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-300 text-sm">
        <p className="mb-1">Made in India 🇮🇳</p>
        <p>&copy; {new Date().getFullYear()} Owner by Kashyap</p>
      </div>
    </footer>
  )
}
