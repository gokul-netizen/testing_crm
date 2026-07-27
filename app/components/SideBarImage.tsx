import Link from "next/link";


interface SideBarProps {
  domainLogo: string | null;
  href?: string;
}

export default function SidebarImage({ domainLogo, href = '/admin/dashboard' }: SideBarProps) {
  if (!domainLogo) return null;

  return (
    <Link href={href}>
      <img
        src={domainLogo}
        alt="Logo"
        onError={(e)=> {
          e.currentTarget.src = '/mars_logo.png'
        }}
        className="w-28 h-16 object-contain"
      />
    </Link>
  );
}
