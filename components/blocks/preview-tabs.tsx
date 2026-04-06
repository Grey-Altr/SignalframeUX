"use client";

import { SFTabs, SFTabsList, SFTabsTrigger } from "@/components/sf";

export function PreviewTabs() {
  return (
    <div className="w-[80%] max-w-[200px]">
      <SFTabs defaultValue="signal">
        <SFTabsList>
          <SFTabsTrigger value="signal" className="text-[var(--text-sm)]">SIGNAL</SFTabsTrigger>
          <SFTabsTrigger value="frame" className="text-[var(--text-sm)]">FRAME</SFTabsTrigger>
        </SFTabsList>
      </SFTabs>
    </div>
  );
}
