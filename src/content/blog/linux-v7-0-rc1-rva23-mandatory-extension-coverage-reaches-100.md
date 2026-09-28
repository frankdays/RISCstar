---
title: "Linux v7.0-rc1: RVA23 mandatory extension coverage reaches 100%"
date: "2026-03-18T03:09:14+00:00"
modified: "2026-03-18T16:00:57+00:00"
author: "Guodong Xu"
authorSlug: "guodong-xu"
categories: ["linux-kernel", "open-source", "risc-v"]
image: "/wp-content/uploads/2026/03/RISC-V.png"
imageWidth: 807
imageHeight: 572
seoTitle: "Linux v7.0-rc1: RVA23 mandatory extension coverage reaches 100% - RISCstar"
excerpt: "Since RISC-V International ratified the RVA23 Profile in October 2024, the standard has seen wide adoption across the industry. But at the Linux Kernel level, coverage of RVA23 mandatory extensions remained incomplete."
legacyStyles: ["/wp-content/uploads/elementor/css/post-6574.css"]
---

Since RISC-V International ratified the RVA23 Profile in October 2024, the standard has seen wide adoption across the industry. But at the Linux kernel level, coverage of RVA23 mandatory extensions remained incomplete.

A few days ago (February 22, 2026), Linux v7.0-rc1 was released on schedule. You may have noticed a detail on the RISC-V side: the kernel’s support for rva23u64 and rva23s64 mandatory extensions has reached 100%.

<p><img class="aligncenter size-full wp-image-6587" src="/wp-content/uploads/2026/03/RVA23_mandatory_extension_kernel_support-1.png" alt="" width="1136" height="684"></p>

**Figure 1: RVA23 mandatory extension kernel support evolution (from v6.5 to v7.0-rc1), Interactive Version \[8\]**

Looking at that curve finally hitting 100%, I’m quite pleased. That last steep climb was my doing – reading specs, writing code, and “arguing” on the mailing list. Here’s how it went.

## **Who is driving kernel RVA23 support?**

Industry is the main driver here.

At the RISC-V Summit China in July 2025, multiple chip vendors announced roadmaps for RVA23-compliant chips (see my summit write-up \[6\]). SpacemiT’s K3 completed tape-out in December 2025 and shipped development boards, making it the first RVA23 chip you can actually buy (cloud access is available \[5\]).

<p><img class="aligncenter size-full wp-image-6586" src="/wp-content/uploads/2026/03/K3_development_timeline.png" alt="" width="1143" height="473"></p>

**Figure 2: K3 development timeline (Image credit: SpacemiT)**

While working on behalf of RISCstar with SpacemiT to bring up K3 support, I noticed that mainline kernel support for RVA23 was still incomplete. With input from community maintainers, and using the K3 upstream effort as a starting point, I identified the missing RVA23 mandatory extensions and added them to the K3 Basic Device Tree patchset \[1\].

The extensions covered multiple families:

-   Sha family (Hypervisor virtualization): Shcounterenw, Shgatpa, Shtvala, Shvsatpa, Shvstvala, Shvstvecd, Ssstateen
-   Ss family (Supervisor mode features): Ssccptr, Sscounterenw, Sstvala, Sstvecd, Ssu64xl
-   Zicc family (Cache coherence guarantees): Ziccamoa, Ziccif, Zicclsm
-   Plus Za64rs (Atomic reservation set)

After three iterations (v2, v3, v4), the patches were accepted and merged into mainline.

<p><i>🎬Aside: the supm debate</i><i><br></i><i><br></i><i>When submitting the K3 DTS, Heinrich Schuchardt (Canonical) pointed out that the ISA string was missing supm (User-mode Pointer Masking), questioning whether the chip truly conformed to RVA23. This kicked off a discussion between Conor Dooley (Microchip, RISC-V DT maintainer), Samuel Holland (SiFive), and myself.</i><i><br></i><i><br></i><i>The question was whether supm belongs in a DTS at all. supm does not directly correspond to hardware circuitry – it describes the execution environment’s ability to provide pointer masking for U-mode, while the actual hardware is Smnpm or Ssnpm. Samuel Holland’s position was clear: the K3 DTS targets S-mode, not U-mode, and is not bound to a specific version of S-mode software. supm should be synthetically enabled in the kernel by detecting Ssnpm/Smnpm, not parsed from the DTS.</i><i><br></i><i><br></i><i>The community reached consensus: allow supm in dt-bindings (extensions.yaml), but not in the DTS ISA string. I then submitted a dedicated supm patchset [7] to define the ISA extension ID and dependency-checking logic.</i></p>

## **From declaration to export: CPU feature parsing**

The Devicetree work was a necessary first step – it let the kernel “recognize” all RVA23 mandatory extensions for the first time, pushing coverage to 100%. But for userspace programs to actually detect these extensions, you also need CPU feature parsing and export via cpuinfo and hwprobe.

I worked on this together with Andrew Jones (Qualcomm).

Andrew posted his patchset \[2\] to the mailing list one day before mine. His work added logic to parse rva23u64 / rva23s64 as dedicated Base ISA entries. My work \[3\] focused on filling in the S-extension exports.

After reviewing his patchset, I proposed several changes – rva23u64 detection should be based on ISA\_EXT (ground truth) rather than HWPROBE\_EXT (the export subset), commit references should point to the ratified version, and the B extension should be added to hwprobe. We’re still going back and forth on these. Andrew raised a good question about hwprobe export policy: should all extensions be exported (including bundle extensions), or only individual ones? This will affect the hwprobe interface going forward.

Target for merge is v7.1, though it may slip to v7.2.

## **Epilogue**

<p style="text-align: center;"><strong><img class="aligncenter size-full wp-image-6598" src="/wp-content/uploads/2026/03/Redditpost_TomGallcomment.png" alt="" width="645" height="812"></strong></p>

**Figure 3: Reddit r/RISCV post and Tom Gall’s comment.**

I shared this on Reddit r/RISCV \[4\], and RISC-V International CTO Tom Gall upvoted and commented “Way to go! Very glad to see this!”, The post has 60 upvotes so far. People are paying attention to RVA23 landing in mainline – it’s a real milestone for the RISC-V software ecosystem.

RVA23 kernel support is coming together.

────────────────────────────────────────

About the author

Guodong Xu (Docular), Director, Software Engineering at RISCstar. Twenty years in Linux kernel and platform software, spanning Arm and RISC-V. Focused on upstream code contributions and open-source adoption. Frequent speaker at international conferences. More info: [docularxu.github.io](https://docularxu.github.io)

────────────────────────────────────────

References:

\[1\] K3 Basic Device Tree Patchset (v4): [https://lore.kernel.org/all/20260110-k3-basic-dt-v4-0-d492f3a30ffa@riscstar.com/](https://lore.kernel.org/all/20260110-k3-basic-dt-v4-0-d492f3a30ffa@riscstar.com/) 

\[2\] Andrew Jones – rva23u64 base behavior RFC: https://lore.kernel.org/all/20260206002349.96740-1-andrew.jones@oss.qualcomm.com/

\[3\] CPU feature parsing and hwprobe export Patchset: https://lore.kernel.org/all/20260207-isa-ext-parse-export-v1-0-a64d3a8bc20a@riscstar.com/

\[4\] Reddit r/RISCV post: https://www.reddit.com/r/RISCV/comments/1rd3ke7/linux\_70rc1\_spacemit\_k3\_soc\_lands\_in\_mainline/

\[5\] K3 cloud access: https://forum.spacemit.com/t/topic/932

\[6\] RISC-V Summit China 2025 write-up: https://riscv.org/blog/risc-v-summit-china-2025-reflections-from-a-risc-v-software-contributor/

\[7\] supm extension patchset: [https://lore.kernel.org/all/20260125-supm-ext-id-v2-0-1e3b9714c860@riscstar.com/](https://lore.kernel.org/all/20260125-supm-ext-id-v2-0-1e3b9714c860@riscstar.com/)

\[8\] RVA23 in Linux Kernel evolution, interactive version: https://docularxu.github.io/rva23/rva23-kernel-support-evolution.html
