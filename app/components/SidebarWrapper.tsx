import { cookies } from "next/headers";
import SidebarClient from "./SideBar";

export default async function SidebarWrapper(props: any) {
  const cookieStore = await cookies();
  const logo = cookieStore.get("domainLogo")?.value || "/mars_logo.png";

  return <SidebarClient {...props} initialLogo={logo} />;
}
