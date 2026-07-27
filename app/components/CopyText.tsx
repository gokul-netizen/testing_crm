'use client';

import ButtonCopy from "@/components/smoothui/button-copy";
import { useState } from "react";
import { toast } from "sonner";

type CopyTextProps ={
    text : string | number;
}

export default function CopyText({text} : CopyTextProps) {
 

    const copyText = async()=>{
        try {
            await navigator.clipboard.writeText(text.toString());
             
            
        } catch (error) {   
            toast.error('Failed to copy text')
        }
    }


    return (
    <div className="hidden md:inline-flex">
      <ButtonCopy duration={800} loadingDuration={400} onCopy={copyText} />
    </div>
    )
}