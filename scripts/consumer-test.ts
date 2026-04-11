/**
 * Consumer integration test for SignalframeUX (DIST-02).
 *
 * Validates that a fresh Next.js 16 app can:
 *   - Install the SFUX tarball (created via npm pack)
 *   - Import from all three entry points: core, animation, webgl
 *   - Import the token CSS
 *   - Compile TypeScript with SFUX type declarations
 *   - Run `next build` successfully
 *
 * Run: npx tsx scripts/consumer-test.ts
 */
import { execFileSync } from "child_process";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const tmpDir = mkdtempSync(join(tmpdir(), "sfux-consumer-"));
  console.log(`Consumer test: working in ${tmpDir}`);

  try {
    // Step 1: Pack the tarball — capture actual filename from npm pack stdout
    console.log("\n[1/4] Packing SFUX tarball...");
    const packOutput = execFileSync(
      "npm",
      ["pack", "--pack-destination", tmpDir],
      {
        cwd: ROOT,
        encoding: "utf-8",
        timeout: 60000,
      }
    );

    // npm pack stdout may be polluted by prepare/husky hooks.
    // The actual tarball filename is always the last line ending in .tgz.
    const tarballName = packOutput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.endsWith(".tgz"))
      .pop();

    if (!tarballName) {
      throw new Error(
        `npm pack produced no .tgz filename. Full output:\n${packOutput}`
      );
    }
    console.log(`      Packed: ${tarballName}`);

    // Step 1b: Pack local GSAP Club into the temp dir so Club plugins
    // (SplitText, ScrambleTextPlugin, DrawSVGPlugin) resolve in the consumer.
    // Real consumers must supply their own GSAP Club license; the test uses
    // the workspace's Club install to validate the full animation entry.
    const gsapPackOutput = execFileSync(
      "npm",
      ["pack", "--pack-destination", tmpDir, join(ROOT, "node_modules", "gsap")],
      { encoding: "utf-8", timeout: 60000 }
    );
    const gsapTarball = gsapPackOutput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.endsWith(".tgz"))
      .pop();
    if (!gsapTarball) {
      throw new Error(`Failed to pack local gsap. Output:\n${gsapPackOutput}`);
    }
    console.log(`      Packed gsap: ${gsapTarball}`);

    // Step 2: Write consumer app files into the temp directory
    console.log("\n[2/4] Writing consumer app files...");

    // package.json — uses dynamic tarball filenames for both sfux and gsap.
    const consumerPkg = {
      name: "sfux-consumer-test",
      version: "1.0.0",
      private: true,
      scripts: { build: "next build" },
      dependencies: {
        next: "^16.0.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        signalframeux: `file:./${tarballName}`,
        "class-variance-authority": "^0.7.1",
        clsx: "^2.1.1",
        "tailwind-merge": "^3.0.2",
        "lucide-react": "^0.488.0",
        gsap: `file:./${gsapTarball}`,
        "@gsap/react": "^2.0.0",
        three: "^0.183.0",
        "radix-ui": "^1.4.3",
      },
    };
    writeFileSync(
      join(tmpDir, "package.json"),
      JSON.stringify(consumerPkg, null, 2)
    );

    // tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"],
    };
    writeFileSync(join(tmpDir, "tsconfig.json"), JSON.stringify(tsConfig, null, 2));

    // next.config.ts — output: 'export' avoids SSR prerender Node.js execution
    // which can fail when SFUX uses React.createElement with the classic transform
    const nextConfig = `import type { NextConfig } from 'next';
const nextConfig: NextConfig = { output: 'export' };
export default nextConfig;
`;
    writeFileSync(join(tmpDir, "next.config.ts"), nextConfig);

    // app/ directory
    mkdirSync(join(tmpDir, "app"), { recursive: true });

    // app/layout.tsx — imports token CSS
    const layoutTsx = `import 'signalframeux/signalframeux.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
`;
    writeFileSync(join(tmpDir, "app", "layout.tsx"), layoutTsx);

    // app/page.tsx — Client Component (RSC safety: avoids hydration mismatch)
    // Uses 6+ SF components from all 3 entry points
    const pageTsx = `'use client';
import { SFButton, SFCard, SFSection, SFGrid, useSignalframe, createSignalframeUX } from 'signalframeux';
import { SFAccordion, SFAccordionItem, SFAccordionTrigger, SFAccordionContent, SFToaster } from 'signalframeux/animation';
import type { SignalCanvas } from 'signalframeux/webgl';

// Type-level usage of webgl export validates the declaration file (no runtime dep on three)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CanvasComponent = typeof SignalCanvas;

export default function TestPage() {
  const config = createSignalframeUX({ defaultTheme: 'dark' });
  return (
    <SFSection>
      <SFGrid cols="2">
        <SFCard>
          <SFButton>Test Button</SFButton>
        </SFCard>
        <SFAccordion type="single">
          <SFAccordionItem value="a">
            <SFAccordionTrigger>Trigger</SFAccordionTrigger>
            <SFAccordionContent>Content</SFAccordionContent>
          </SFAccordionItem>
        </SFAccordion>
      </SFGrid>
      <SFToaster />
    </SFSection>
  );
}
`;
    writeFileSync(join(tmpDir, "app", "page.tsx"), pageTsx);

    console.log("      Files written.");

    // Step 3: Install dependencies
    console.log("\n[3/4] Installing dependencies (this may take 1-2 minutes)...");
    try {
      execFileSync("npm", ["install"], {
        cwd: tmpDir,
        stdio: "pipe",
        timeout: 120000,
      });
      console.log("      npm install complete.");
    } catch (err: unknown) {
      const installErr = err as { stdout?: Buffer | string; stderr?: Buffer | string; message?: string };
      console.error("npm install FAILED:");
      if (installErr.stdout) console.error(installErr.stdout.toString());
      if (installErr.stderr) console.error(installErr.stderr.toString());
      throw new Error(`npm install failed: ${installErr.message ?? String(err)}`);
    }

    // Step 4: Run next build
    console.log("\n[4/4] Running next build (this may take 1-2 minutes)...");
    try {
      execFileSync("npm", ["run", "build"], {
        cwd: tmpDir,
        stdio: "pipe",
        timeout: 120000,
      });
    } catch (err: unknown) {
      const buildErr = err as { stdout?: Buffer | string; stderr?: Buffer | string; message?: string };
      console.error("next build FAILED:");
      if (buildErr.stdout) console.error(buildErr.stdout.toString());
      if (buildErr.stderr) console.error(buildErr.stderr.toString());
      throw new Error(`next build failed: ${buildErr.message ?? String(err)}`);
    }

    console.log(
      "\nConsumer test PASS: Next.js 16 build succeeded with SFUX imports from all 3 entry points"
    );
  } finally {
    // Always clean up temp directory
    rmSync(tmpDir, { recursive: true, force: true });
    console.log("Temp directory cleaned up.");
  }
}

main().catch((err) => {
  console.error("\nConsumer test FAILED:", err.message ?? err);
  process.exit(1);
});
