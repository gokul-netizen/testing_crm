"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

type StatCardProps = {
  icon: LucideIcon | IconType;
  iconColor: string;      
  iconBgColor: string;    
  title: string;
  subTitle1: string;
  subTitle2?: string | number;
};

export default function StatCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  subTitle1,
  subTitle2,
}: StatCardProps) {
  return (

    <div className="bg-white p-2 py-4 md:p-5 md:py-8 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.1)] flex flex-col items-start max-w-64">
   
      <div className={`p-3 rounded-lg ${iconBgColor} mb-4`}>
        <Icon className={`w-4 h-4  md:w-7 md:h-7 ${iconColor}`} />
      </div>

      
      <div className="flex flex-col gap-1">
        <h3 className="text-sm md:text-xl font-medium text-[#444050]">{title}</h3>
        <p className="text-sm md:text-base   text-gray-400">{subTitle1}</p>
        {subTitle2 && (
          <p className=" text-base md:text-lg  mt-1">{subTitle2} </p>
        )}
      </div>
    </div>
  );
}