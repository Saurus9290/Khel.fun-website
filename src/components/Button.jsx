const Button = ({title, id, rightIcon, leftIcon, containerClass, variant = "primary"}) => {
  const variants = {
    primary: "bg-violet-300 text-white hover:bg-violet-400 hover:shadow-lg hover:shadow-violet-300/50",
    secondary: "bg-transparent border-2 border-violet-300 text-violet-300 hover:bg-violet-300 hover:text-black",
    gaming: "bg-gradient-to-r from-violet-300 to-blue-300 text-white hover:from-violet-400 hover:to-blue-400",
    neon: "bg-black border-2 border-violet-300 text-violet-300 hover:bg-violet-300 hover:text-black hover:shadow-lg hover:shadow-violet-300/50"
  };

  return (
    <button 
      id={id} 
      className={`group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full px-7 py-3 font-general text-xs uppercase transition-all duration-300 ${variants[variant] || variants.primary} ${containerClass}`}
    >
      {leftIcon && <span className="mr-2 inline-block transition-transform duration-300 group-hover:-rotate-12">{leftIcon}</span>}
      
      <span className='relative inline-flex overflow-hidden'>
        <div className="transition-transform duration-300 group-hover:-translate-y-full group-hover:opacity-0">
          {title}
        </div>
        <div className="absolute left-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {title}
        </div>
      </span>
      
      {rightIcon && <span className="ml-2 inline-block transition-transform duration-300 group-hover:rotate-45">{rightIcon}</span>}
      
      {/* Hover shine effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </button>
  )
}

export default Button