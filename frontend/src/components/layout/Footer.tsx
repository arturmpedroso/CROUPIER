export default function Footer() {
  return (
    <footer className="w-full bg-[#121312] border-t border-zinc-800 px-12 py-16 text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#E6FAFC]">CROUPIER</h3>
          <div className="flex space-x-4 text-lg pt-2">
            <span className="hover:text-[#97DB4F] cursor-pointer">🌐</span>
            <span className="hover:text-[#97DB4F] cursor-pointer">🔗</span>
            <span className="hover:text-[#97DB4F] cursor-pointer">📺</span>
            <span className="hover:text-[#97DB4F] cursor-pointer">📸</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#E6FAFC] mb-3">Tópico</h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li className="hover:text-[#A9BBBD] cursor-pointer">Página</li>
            <li className="hover:text-[#A9BBBD] cursor-pointer">Página</li>
            <li className="hover:text-[#A9BBBD] cursor-pointer">Página</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#E6FAFC] mb-3">Tópico</h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li className="hover:text-[#A9BBBD] cursor-pointer">Página</li>
            <li className="hover:text-[#A9BBBD] cursor-pointer">Página</li>
            <li className="hover:text-[#A9BBBD] cursor-pointer">Página</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#E6FAFC] mb-3">Tópico</h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li className="hover:text-[#A9BBBD] cursor-pointer">Página</li>
            <li className="hover:text-[#A9BBBD] cursor-pointer">Página</li>
            <li className="hover:text-[#A9BBBD] cursor-pointer">Página</li>
          </ul>
        </div>

      </div>
    </footer>
  );
}