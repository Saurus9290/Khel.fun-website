const Button = ({title, id, rightIcon, leftIcon, containerClass, variant = "primary", href, target, rel, ariaLabel}) => {
  const variants = {
    primary: "bg-violet-300 text-white hover:bg-violet-400 hover:shadow-lg hover:shadow-violet-300/50",
    secondary: "bg-transparent border-2 border-violet-300 text-violet-300 hover:bg-violet-300 hover:text-black",
    gaming: "bg-gradient-to-r from-violet-300 to-blue-300 text-white hover:from-violet-400 hover:to-blue-400",
    neon: "bg-black border-2 border-violet-300 text-violet-300 hover:bg-violet-300 hover:text-black hover:shadow-lg hover:shadow-violet-300/50"
  };

  const commonClasses = `group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full px-7 py-3 font-general text-xs uppercase transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] smooth-hover ${variants[variant] || variants.primary} ${containerClass}`;

  const content = (
    <>
      {leftIcon && <span className="mr-2 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">{leftIcon}</span>}
      
      <span className='relative inline-flex'>
        <span className="transition-all duration-300 ease-out group-hover:translate-y-[-1px]">
          {title}
        </span>
      </span>
      
      {rightIcon && <span className="ml-2 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">{rightIcon}</span>}
      
      {/* Subtle hover shine effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
    </>
  );

  if (href) {
    return (
      <a id={id} href={href} target={target} rel={rel} aria-label={ariaLabel || title} role="button" className={commonClasses}>
        {content}
      </a>
    );
  }

  return (
    <button id={id} type="button" aria-label={ariaLabel || title} className={commonClasses}>
      {content}
    </button>
  )
}

export default Button