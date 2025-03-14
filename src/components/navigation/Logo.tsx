
export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-primary">
      <img 
        src="https://sso.tima.vn/images/logo.png" 
        alt="Tima Logo" 
        className="h-8 w-auto object-contain animate-fade-in" 
      />
      <span className="hidden sm:inline-block pl-2 border-l">Contact Center</span>
    </div>
  );
}
