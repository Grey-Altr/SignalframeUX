"use client";

import { SFTabs, SFTabsList, SFTabsTrigger } from "@/components/sf/sf-tabs";

export function PreviewTabs() {
  return (
    <div className="w-[80%] max-w-[200px]">
      <SFTabs defaultValue="signal">
        <SFTabsList>
          <SFTabsTrigger value="signal" className="text-[11px]">SIGNAL</SFTabsTrigger>
          <SFTabsTrigger value="frame" className="text-[11px]">FRAME</SFTabsTrigger>
        </SFTabsList>
      </SFTabs>
    </div>
  );
}
