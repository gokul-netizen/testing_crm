"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbPath {
  label: string;
  href?: string;
  onClick?: () => void;
  isPage?: boolean;  
}

interface CustomBreadcrumbProps {
  paths: BreadcrumbPath[];
}

export default function CustomBreadcrumb({ paths }: CustomBreadcrumbProps) {
  const router = useRouter();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <span key={index} className="flex items-center">
            <BreadcrumbItem>
              {path.isPage ? (
                <BreadcrumbPage>{path.label}</BreadcrumbPage>
              ) : path.href ? (
                <BreadcrumbLink asChild>
                  <Link href={path.href}>{path.label}</Link>
                </BreadcrumbLink>
              ) : path.onClick ? (
                <BreadcrumbLink asChild>
                  <button
                    onClick={path.onClick}
                    className="cursor-pointer"
                  >
                    {path.label}
                  </button>
                </BreadcrumbLink>
              ) : (
                <span>{path.label}</span>
              )}
            </BreadcrumbItem>

            {index < paths.length - 1 && <BreadcrumbSeparator />}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
