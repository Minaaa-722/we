import { useState } from 'react'

const Navbar = ({ openAuthModal }) => {
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur z-50 transition-all duration-300 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#" class="flex items-center space-x-2">
          <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <i class="fa fa-gift text-white text-xl"></i>
          </div>
          <span class="text-xl font-bold text-neutral-700">盲盒星球</span>
        </a>
        
        {/* 搜索框 - 桌面版 */}
        <div class="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input type="text" placeholder="搜索盲盒..." class="w-full pl-10 pr-4 py-2 rounded-full bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
          </div>
        </div>
        
        {/* 用户菜单 */}
        <div class="flex items-center space-x-4">
          <button onClick={() => setMobileSearchOpen(!isMobileSearchOpen)} class="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <i class="fa fa-search text-neutral-500"></i>
          </button>
          
          <button class="relative p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <i class="fa fa-shopping-cart text-neutral-500"></i>
            <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center">3</span>
          </button>
          
          <button onClick={openAuthModal} class="p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <i class="fa fa-user-circle text-neutral-500 text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* 移动端搜索框 */}
      {isMobileSearchOpen && (
        <div class="hidden px-4 pb-3">
          <div class="relative w-full">
            <input type="text" placeholder="搜索盲盒..." class="w-full pl-10 pr-4 py-2 rounded-full bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar  