export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">BB</span>
              </div>
              <span className="text-white font-bold">Bengali Bondhu</span>
            </div>
            <p className="mt-2 text-sm">Your AI companions for Bengali conversations</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h3 className="text-white font-bold mb-3">Contact</h3>
              <p className="text-sm">mir.m.reza@gmail.com</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-3">Powered By</h3>
              <p className="text-sm">GPT-4o-mini</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Bengali Bondhu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
