---
title: "RVA23: From Ratification to Real-World Readiness"
date: "2026-08-12T13:14:09+00:00"
modified: "2026-08-12T14:39:10+00:00"
author: "Guodong Xu"
authorSlug: "guodong-xu"
categories: ["linux-kernel", "open-source", "risc-v"]
image: "/wp-content/uploads/2026/08/Screenshot-2026-08-11-at-8.34.04-PM.png"
imageWidth: 1112
imageHeight: 914
seoTitle: "RVA23: From Ratification to Real-World Readiness - RISCstarRVA23: From Ratification to Real-World Readiness"
excerpt: "RVA23 was ratified in October 2024. For most of the months since, the world was essentially waiting for hardware to run it! Now the SpacemiT K3 is on shelves and more RVA23 silicon is close behind. So what was the industry up to during that time, and is the software ready for the chips that have arrived?"
legacyStyles: ["/wp-content/uploads/elementor/css/post-7551.css"]
---

<style>/* Elementor-friendly: paragraphs, headings, and links carry NO typography here, so they inherit the theme kit's Paragraph / Heading / Link styles. Only the tables are styled, with colors that inherit the surrounding text so they adapt to whatever background the theme uses. */ table { border-collapse: collapse; width: 100%; margin: 1.25rem 0; font-size: 0.85em; /* smaller, relative to theme paragraph size */ line-height: 1.4; border: 1.5px solid currentColor; /* clear outer line, matches text color */ } th, td { border: 1px solid; /* clear gridline on every cell */ border-color: rgba(128,128,128,0.6); padding: 6px 9px; text-align: left; vertical-align: top; } thead th { background: rgba(128,128,128,0.15); /* subtle, works on light or dark */ border-bottom: 1.5px solid currentColor; font-weight: 700; white-space: nowrap; } td i { font-size: 0.92em; } /* First column reads as a row label */ tbody td:first-child { font-weight: 600; } @media (max-width: 600px) { table { font-size: 0.78em; } th, td { padding: 5px 6px; } }</style>

RVA23 was ratified in October 2024. For most of the months since, the world was essentially waiting for hardware to run it! Now the SpacemiT K3 is on shelves and more RVA23 silicon is close behind. So what was the industry up to during that time, and is the software ready for the chips that have arrived?

The answer plays out on two fronts. The first is the silicon itself. Chip and IP vendors had to turn RVA23 from a paper profile into working parts, moving from early QEMU emulation models to taped-out, mass-produced chips like the K3, while the major IP portfolios realigned around the profile.

The second front is the software stack. As the hardware took shape, the Linux distributions had to decide how, and whether, to absorb the new baseline so that user-space could actually exploit it. Their answers diverged sharply: one has already shipped the first mainstream RVA23 LTS, others are backporting RVA23 into stable enterprise lines, while several global heavyweights deliberately hold back.

This article follows both tracks. We begin with the silicon and IP vendors and the hardware milestones they delivered, then turn to the divergent strategies of the global and regional distributions, a concrete account of what these twenty months actually produced.

## Silicon and IP Vendors

### SpacemiT: Tape-out and Mainline Hand-in-Hand

Executing a flawless pipeline from design to lock-in to tape-out, the **K3** (featuring a heterogeneous 8 X100 + 8 A100 core configuration) emerged as the industry’s first RVA23 SoC—a milestone cemented by the public release of K3-based single board computers (SBCs) for retail sale in May 2026.

Building on the same X100 core IP, SpacemiT also unveiled the **V100, a 40 X100 + 6 Xiangshan v3 (Kunminghu KMH \[8\]) cores** heterogeneous platform. At the April 2026 openEuler Developer Day, the V100 booted the openEuler 24.03 SP3 official ISO directly without any board-level customization. This full-stack adaptation of the standardized boot chain—UEFI/EDK2 + ACPI + SMBIOS + SBI 3.0—demonstrates the industry’s determination to push the ecosystem from the “custom image era” toward cross-platform standardization.

Just as critical as shipping silicon is SpacemiT’s strong commitment to the upstream community. Since December 2025, RISCstar has been involved in SpacemiT’s Linux kernel upstream efforts for their K3 RVA23 compliant SoC. This collaboration allowed SpacemiT and RISCstar to boost the mainline kernel support for RVA23 extensions from 68% to 100%.

### SiFive: A Full-Stack RVA23 Portfolio

As an IP vendor that licenses cores to chip design houses, SiFive sits at a different place in the supply chain compared to SpacemiT. While SoCs embedding their latest IPs have yet to hit mass production, SiFive’s alignment with the new profile is unequivocal.

According to their latest public materials, SiFive has confirmed RVA23 support across a comprehensive portfolio of four distinct cores spanning recent release cycles: the **P870-D** (launched in 2024), the **X280 Gen 2** and **X390 Gen 2** (both introduced in 2025), and the recently announced **P570 Gen 3** (May 2026) \[7\].

The recently announced P570 Gen 3 aggressively targets the Hypervisor + RVV + Vector Crypto trifecta, backed by System IPs like AIA and IOMMU Gen 2. SiFive’s market messaging takes explicit aim at the Linux server, Android, and enterprise infrastructure markets, mirroring the ecosystem positioning that RVA23 was designed to serve.

The adoption of RVA23 by SpacemiT and SiFive reflects a broader trend in the high-performance RISC-V market. Similar alignment can be seen across other commercial and open-source designs, including Andes’ AX66 \[9\], Tenstorrent’s Ascalon \[10\], and open-source platforms like the XiangShan Kunminghu (KMH) \[8\] project. At the recently concluded 2026 RISC-V Summit Europe in Bologna, RISC-V International CEO Andrea Gallo dedicated twelve consecutive slides of his keynote, one per vendor, to the twelve companies planning RVA23 product releases this year. He declared that “2026 is the year of RVA23 silicon”.

This standardization reshapes how high-performance RISC-V silicon and IP vendors define their products. By establishing a unified feature baseline, RVA23 removes the need to navigate complex trade-offs among basic extensions. Instead, engineering efforts can be fully directed toward core microarchitectural parameters—such as IPC improvements and energy efficiency—tailored to the performance demands of server and enterprise markets.

At the same time, this unified target gives OS maintainers and software engineers a clear specification to compile and optimize against.

## Linux Distributions

With the hardware foundation beginning to solidify, the OS vendors needed to answer a critical question: How do we migrate our massive software archives to this new RVA23 baseline? Looking across the landscape, three distinct strategies have emerged.

Most traditional global heavyweights — Debian, Fedora, Red Hat, SUSE — are uniformly adopting a conservative stance, remaining for the time being on the legacy RV64GC baseline. Canonical broke from that mold with an aggressive system-wide cutover, making Ubuntu the first mainstream LTS Linux distribution to mandate RVA23. (Pre-RVA23 silicon remains supported through their 24.04 LTS release, which carries a five-year support lifecycle.)

The Chinese Linux distribution ecosystem, pushed by local silicon vendors already shipping RVA23 hardware, is moving fastest of all — through coordinated backports and bleeding-edge software tracking.

### The Global Heavyweights: Conservative Approach

To understand the current landscape, we take a quick glance at the baseline architectures of the global major distribution families:

| Distribution | Default RISC-V Baseline | Stance on RVA23 Adoption (as of May 2026) |
| --- | --- | --- |
| Ubuntu 26.04 LTS | RVA23U64 | Aggressive Cutover; First LTS to mandate RVA23 |
| Fedora | RV64GC | Wait-and-see; RISC-V SIG explicitly paused RVA23 |
| Debian 13 (Trixie) | RV64GC | Strictly anchored to legacy baseline |
| Red Hat (RHEL 10) | RV64GC | Dev Preview only; No baseline commitment |
| SUSE (SLES 16) | — (No RISC-V SKU at all) | Commercially absent; Zero official messaging |
| openSUSE Tumbleweed | RV64GC | OBS has no native RISC-V workers; QEMU-emulated builds |

If we look at these major distributions — by which I mean Debian, Fedora, Red Hat, and SUSE — the consensus as of July 2026 is stark: **none of them have adopted RVA23 as their build baseline.** They are for now uniformly remaining with the older RV64GC profile.

-   **Debian** — current stable Debian 13 “Trixie” (August 2025), build baseline RV64GC\[1\].
    -   **Why RV64GC today:** Debian holds the baseline here for two practical reasons. First, raising it to RVA23 would force users to discard hardware they bought only months ago and would break the smooth upgrade path from Trixie to Forky. Second, there is still very little RVA23 hardware with upstream kernel support: the SpaceMiT K3 looks on track to be covered by the Forky release, but no second vendor yet appears to be, and Debian does not want to create vendor lock-in around a single board.
    -   **Next release:** Debian 14 “Forky,” expected around mid-2027 (Debian sets no fixed release dates).
    -   **Next-release RVA23 stance:** Forky is expected to move the baseline at most to RVA20U64, which is essentially RV64GC but formalizes the use of the Zicntr and Zicsr extensions, not to RVA23. The realistic near-term path to RVA23 value is not a baseline change but runtime-dispatched optimized libraries via glibc’s hwcaps mechanism. This is not hypothetical: enterprise distributions already do exactly this on x86-64, where SUSE’s SLES 16, for example, ships glibc-hwcaps builds that automatically load CPU-optimized versions of more than thirty libraries (including openssl, libgcrypt, and libjpeg-turbo) above its baseline\[4\]. On RISC-V the missing piece is capability detection, supplied by the kernel’s hwprobe interface rather than a flat HWCAP bitmask. The glibc-hwcaps mechanism is not enabled for RISC-V yet, but the author has been upstreaming a hwprobe series that exposes the RVA23U64 base to user space\[11\], and Aurélien Jarno, who works on Debian’s riscv64 port, has called it a good fit for shipping RVA23-optimized builds of some libraries through glibc-hwcaps once that work is accepted.

*Author’s read: Debian’s first taste of RVA23 will most plausibly come through hwcaps-selected libraries rather than a baseline change; the baseline flip is a multi-year question gated on hardware availability and a clean upgrade path for existing users, not on principle.*

-   **Fedora** — current stable, build baseline RV64GC\[2\].
    -   **Why RV64GC today:** Fedora carries deep upstream RISC-V involvement, but at its February 2026 RISC-V SIG meeting the group chose, for now, *not* to take the RV64GC → RVA23 question to the primary Koji or to FESCo (the Fedora Engineering Steering Committee), with its RISC-V lead David Abdurachmanov calling RVA23 “a loaded topic”\[2\]. The reason on the record is sequencing: the SIG’s near-term energy is going into bringing the existing riscv64 port to parity with the primary architecture — its diff against primary Koji is now at a “record low” — and through general availability, before opening a baseline question on top of it.
    -   **Next release:** Fedora ships on a ~6-month cadence (F43 current, F44 branching from Rawhide); no point is scheduled at which the RVA23 question is set to be revisited.
    -   **Next-release RVA23 stance:** rv64gc remains the Koji buildroot target, and no FESCo-level RVA23 transition is on the table.

*Author’s read: Fedora is unlikely to reopen the RVA23 baseline question until riscv64 is a fully promoted primary architecture — the profile move sits downstream of that promotion, not in parallel with it.*

-   **Red Hat (RHEL)** — current RV64GC; RISC-V ships only as a Developer Preview, with no baseline commitment \[3\] \[12\].
    -   **Why RV64GC today:** Red Hat’s RISC-V port is still a Developer Preview, not a GA product. As of its June 2026 refresh it tracks RHEL 10.2, and the only hardware Red Hat has tested remains the SiFive HiFive Premier P550 — an RV64GC board, not RVA23. That refresh widened *experimental* boot support to a few existing boards (StarFive JH7110, UltraRISC DP1000) and QEMU, but Red Hat continues to feed its work upstream rather than commit to a baseline, framing RISC-V adoption as “**a choice that the market will make based on each segment’s own criteria**“\[12\]. The emphasis stays on supporting the large installed base of pre-RVA23 hardware, not on moving to an RVA23 baseline.
    -   **Next release:** RHEL 11 is expected around 2028–2029 (Red Hat does not commit to long-range dates; major versions have historically arrived roughly every three years).
    -   **Next-release RVA23 stance:** No baseline commitment, which keeps Red Hat free to choose its RISC-V baseline as the RHEL 11 timeframe (2028–2029) firms up, rather than committing now.

*Author’s read: a RHEL RVA23 baseline is unlikely before RVA23 silicon is broadly deployed in the server-class systems RHEL targets — a RHEL 11-era question at the earliest.*

-   **SUSE / openSUSE** — no commercial RISC-V product; community riscv64 only\[4\]\[13\].
    -   **Why no RVA23 today:** SUSE is the most silent of the group. Its enterprise platform, SLES 16.0 (Linux 6.12), reached general availability supporting only four architectures — x86-64, IBM Z (s390x), POWER (ppc64le), and Arm (AArch64); RISC-V appears nowhere in the supported-architecture list, and the release notes carry no RISC-V-specific section at all\[4\]. RISC-V exists for SUSE only as a community effort: openSUSE ships an in-development riscv64 port through Tumbleweed, but its Open Build Service still has no native RISC-V build workers — packages are produced as riscv64 userspace under QEMU binfmt emulation on x86-64 hosts\[13\].
    -   **Next release:** SLES follows a service-pack cadence and openSUSE Tumbleweed is rolling; neither publishes a RISC-V roadmap.
    -   **Next-release RVA23 stance:** With no commercial RISC-V SKU, and no native RISC-V build fleet even on the community side, an RVA23 baseline is not a near-term question for SUSE — the preconditions are a RISC-V product and the build infrastructure to support it, neither of which exists today.

*Author’s read: SUSE is unlikely to engage RVA23 at the baseline level until it decides to ship a commercial RISC-V product at all, a step it has shown no public sign of taking.*

In summary, the reasons differ from one distribution to the next — a build fleet still mid-upgrade, an emulation-only build service, a preview pinned to a single board, a deliberate choice not to escalate the question — but the direction is the same: none of the global heavyweights is moving its baseline yet. Asked when a mainstream distribution beyond Ubuntu might realistically move to RVA23, industry participants put it at two to three years out — and viewed even that as optimistic, with longer just as likely. Not everyone accepts that pace: RISC-V’s chief architect, Krste Asanović, argues that the pre-RVA23 installed base is in fact small and concentrated in early, niche development boards, and that holding RVA23 distributions back to accommodate it is the wrong trade-off.

### Ubuntu 26.04 LTS: The Aggressive Cutover

In sharp contrast to its peers, Canonical chose the most aggressive route. Starting with Ubuntu 25.10, the baseline for 64-bit RISC-V was strictly bumped to RVA23, triggering a full archive rebuild with GCC 15.2. Concurrently, a hardware gating mechanism was introduced—machines lacking RVA23U64 support are blocked from upgrading to 25.10, safely leaving legacy hardware to rely on the 24.04 LTS lifecycle\[5\]. Ultimately, Ubuntu 26.04 LTS, released in April 2026, became the **first mainstream RVA23 LTS distribution**.

Reflecting on the engineering effort, Heinrich Schuchardt summed it up at the Ubuntu Summit 25.10: *“My experience was it just works.”* \[6\]

Rebuilding the massive package archive yielded merely 3 GCC bugs and a single issue with an s390x big-endian machine simulating RISC-V instructions—all of which were swiftly fixed upstream.

**A Toolchain Detail Worth Probing:** Despite this aggressive push, there is a nuanced caveat. The upstream GCC commit implementing the -march=rva23u64 profile alias was authored on 10 May 2025 and landed only on GCC’s master branch (the GCC 16 development line)\[16\]; it was never part of the GCC 15 release series, so the GCC 15.2 stable release of 8 August 2025\[17\] does not recognize the alias. Canonical neatly circumvented this by configuring GCC with –with-arch=…, essentially baking the entire string of RVA23 sub-extensions directly into the compiler binary during packaging. Because of this, when regular users run gcc foo.c, the compiler effortlessly defaults to RVA23. The lack of the concise -march=rva23u64 alias only surfaces as a friction point for developers who want to explicitly lock the profile using -march= in portable Makefiles or CI scripts. The same gap appears in LLVM, but there is no build-time equivalent to –with-arch (its default extension set isn’t configurable through build flags), so Canonical carried a source patch to make `clang` default to RVA23 as well.

*Author’s read: Having the alias land in GCC 15.2 would have spared developers that friction, a small but real convenience the release timing denied them, though only until 26.10’s GCC 16.1 makes the alias native.*

**Across the 25.10 and 26.04 cycles:** Beyond the baseline cutover, Canonical pursued RVA23 enablement for Go, Java, and Rust. By the 26.04 release, rustc detected RVA23 hosts as the new riscv64a23-unknown-linux-gnu target triple, and the Java JIT had begun using some RVA23 extensions (for example the cmovex vectorization work\[18\]). Forward-looking research on the Matrix Extension also continued.

**About Control-Flow Integrity (CFI):** CFI is where RISC-V’s security story still trails x86 and arm64. Ubuntu 26.04 LTS ships without CFI on RISC-V, but the reason isn’t Canonical, it’s upstream.

As Heinrich Schuchardt puts it, the ecosystem is heading toward tagged landing pads, which means actually filling in the labels the extension already defines. The upstream toolchain wasn’t ready at the 26.04 release, and still isn’t \[19\]\[20\]. That gap sits in the kernel, in GCC and Clang, and in the userspace runtime, so it gates every RISC-V distribution, not just Ubuntu. Debian, Fedora, and openSUSE would face the same blocker.

Some background, on RISC-V, CFI rests on two extensions:

1.  Zicfilp, which guards the forward edge by forcing indirect calls and jumps onto a tagged landing pad
2.  Zicfiss, which guards the return edge with a shadow stack.

However, it is worth noting that both extensions are optional in RVA23.

### China’s First Movers: Hardware-Driven Acceleration

The Chinese ecosystem faces a vastly different reality: physical RVA23 silicon (like the SpacemiT K3) is already rolling off local fabrication lines (global shipping started April 30, 2026, with Xiangshan, Alibaba DAMO, Sophgo, and Lanxin following). This immediate hardware availability has created intense market needs to deliver a viable software stack *now*, leading to a strategy characterized by heavy backporting and rapid iteration.

To understand China’s software response, consider the pivotal coordinating role played by the Institute of Software, Chinese Academy of Sciences (ISCAS). ISCAS serves as the central engine driving the openEuler RISC-V SIG (Special Interest Group). It is this SIG who is responsible for supporting and continually evolving RISC-V as a Tier-1 architecture within openEuler. Simultaneously, ISCAS maintains an independent distribution named openRuyi.

The two efforts play complementary roles: the openEuler RISC-V SIG ensures the architecture integrates into a robust, enterprise-grade foundation, while openRuyi acts as the bleeding-edge validation vanguard.

#### openEuler 24.03 SP3 (RISC-V SIG): Robust Backports and Enterprise Stability

While Canonical chose a clean system-wide cutover for its new release, the openEuler RISC-V SIG opted for a pragmatic, backward-compatible backporting route for their architecture port.

The vehicle for that backporting is openEuler’s 2024 LTS line — openEuler 24.03 — which carries both RVA20 and RVA23 profiles in parallel. SP3 (February 2026) is the latest iteration. And with the next openEuler LTS not due until 2028, the SIG is effectively committed to backporting every necessary patch into 24.03 until that next LTS lands.

The motive behind this strategy is strategic, not merely defensive. The large body of work poured into openEuler 24.03 LTS is aimed at accelerating RISC-V’s entry into China’s industrial software supply chain and shortening its path to commercial deployment. The heavy lifting for these backports was voluntarily crowd-sourced among the openEuler RISC-V SIG and five industry partners (Alibaba DAMO Academy, ZTE, UltraRISC, Sophgo, SpacemiT) based on their respective business needs. True to its open-source nature, the SIG adheres to a strict upstream-first mandate: all backport patches must first land in the upstream project.

**Toolchain support for RVA23:** In this dedicated release line crafted specifically for RISC-V RVA23, the SIG team **directly upgraded and pinned the system’s default GCC to 14.3.1** (package version 14.3.1-9), establishing it as the baseline to carry the massive (120+ in number) RVA23 backport patches contributed by ISCAS and others—crucially including support for the -march=rva23u64 profile alias. Alongside this, the accompanying Binutils was simultaneously upgraded to 2.42-4 (with porting work maintained by vendors including ZTE and Xuantie).

On the server platform front, SP3 RVA23 baked core features like AIA drivers, IOMMU, SSE, RAS, and QoS into the kernel even before the official release of the RISC-V Server Platform Specification (2026-05-06). This pipeline ultimately delivered a product-level milestone: SpacemiT’s V100 flawlessly booting the SP3 official ISO. The trade-off, of course, is the staggering maintenance overhead: in 2026 alone, the SIG is juggling up to 7 parallel versions (including SP4’s RVA20/RVA23, plus several openRuyi iterations).

#### openRuyi: The Bleeding-edge Upstream Validation Platform

To complement the SIG’s focus on enterprise stability, openRuyi closely tracks the absolute latest upstream releases. The SIG sums up its positioning simply: if you want the absolute latest software, use openRuyi.

A highly practical use case for openRuyi lies in the RISC-V ecosystem’s strict “upstream first” mandate. With openRuyi tracking bleeding-edge packages, silicon vendors and software companies use it as a massive validation platform to verify their upstreamed work in a real distribution environment *before* those patches trickle down to stable enterprise releases.

openRuyi is a rolling distribution; its RVA23 line currently hosts close to 3,000 RPM packages and is still growing. These packages track the latest versions from their respective upstream communities. While not every package has been manually fine-tuned with RVA23-specific instruction-level optimizations, they all compile and run cohesively against its current rolling toolchain with -march=rva23u64. This represents a heavyweight, system-level stress test of the RVA23 baseline toolchain’s viability.

**Toolchain Contrast:** The difference here is one of timing, not philosophy. openRuyi rolls with upstream, so it is already on GCC 16.x, where the rva23u64 profile alias is recognized natively and accepted directly on the -march= command line, with no backport required (the alias was added upstream in commit 66d17ba3cb47\[16\]). Ubuntu 26.04’s default compiler is still GCC 15.2, which predates that alias, so Canonical built the archive with –with-arch=…, baking the full RVA23 extension string into the compiler instead. That workaround is transitional rather than a fixed stance: GCC 16 already ships in 26.04 as a pre-release, 26.10 will default to GCC 16.1, and at that point Canonical expects to retire the explicit –with-arch list in favour of the native rva23u64 alias. So both distributions are converging on the same alias-driven endpoint; openRuyi got there first by rolling, while Ubuntu arrives a release later on its LTS cadence.

*Author’s read: between openEuler’s backports and openRuyi’s move to upstream GCC 16.x, both ship a complete set of six profile aliases—rva20u64, rva22u64, rva23u64, rvb23u64, rva23s64, and rvb23s64—providing maximum flexibility for developers.)*

### Appendix: Toolchain and Package Matrix Across the Early Adopters

#### Strategy and Milestones

| Aspect | Ubuntu 26.04 LTS (Canonical) | openEuler 24.03 SP3 (ISCAS-led) | openRuyi (ISCAS maintained) |
| --- | --- | --- | --- |
| Migration Strategy | Hard Cutover | Backport-heavy + Dual-track | Bleeding-edge Testbed |
| Linux Kernel Version | Linux 7.0 | Linux 6.6 | Dual-track: Linux 7.0.6 (ruyi/7.0.y) + Linux-LTS 6.18.29 (ruyi/6.18.y), both with vendor patches |
| Default GCC Version | 15.2.0 | 14.3.1 + 126 RISC-V patches | GCC 16.x (rolling) |
| RVA23 Key Milestones | Full archive rebuild from 25.10; 26.04 LTS GA in 2026-04 | SP3 released in 2026-02; RVA20 + RVA23 dual release lines | RVA23 rolling line released; ~3,000 src.rpm and growing |
| Verification Hardware Partners | “SpacemiT K3 we have the first compatible hardware at hand. More RVA23 hardware can be expected.” | SpacemiT K3 + V100 + vendor FPGA environment | SpacemiT K3 + V100 + vendor FPGA environment |

#### Toolchain

| Package | Ubuntu 26.04 LTS | openEuler 24.03 SP3 (RVA23 Line) | openRuyi RVA23 (rolling) |
| --- | --- | --- | --- |
| GCC | 15.2.0 *(Baked via –with-arch, lacks rva23u64 alias)* | 14.3.1 *(14.3.1-9, RVA23 backport)* | 16.x rolling *(rva23u64 native)* |
| Binutils | 2.46 *(2.46-3ubuntu2)* | 2.42 *(2.42-4, RVA23 backport)* | 2.45 |
| LLVM | 20.1.8 | 17.0.6 / 18.1.8 / 19.1.7 / 20.1.8 | 21.1.7 |
| glibc | 2.43 | 2.38 *(2.38-77)* | 2.43 |
| Rust | 1.93 | 1.90.0 | 1.94.1 |
| GDB | 17.1 | 14.1 *(14.1-11)* | 17.1 |
| Linux kernel | 7.0.0 | 6.6.0 *(openEuler OLK 6.6)* | linux 7.0.6 + linux-lts 6.18.29 |

#### Key User-space Packages

| Package | Ubuntu 26.04 LTS | openEuler 24.03 SP3 (RVA23 Line) | openRuyi RVA23 (rolling) |
| --- | --- | --- | --- |
| Golang | 1.26 | 1.21.4 | 1.25.8 |
| OpenJDK | 21.0.11 / 25.0.3 | 21.0.8 | 17 + 21 + 25 |
| OpenSSL | 3.5.5 | 3.0.12 / 3.1.0 | 3.5.2 |
| ISA-L (\*) | Not in repo | In repo: +4 patches | 2.32.0 + crypto 2.26 |

(\*) ISA-L (Intel’s Storage Acceleration Library) is an acceleration library for storage and networking, originally developed by Intel. Its Arm SVE optimizations can be found in \[15\]; on RISC-V (with RVA23 Profile’s RVV, Zbc, Zvbb, and Zvbc), the corresponding optimizations are contributed by ZTE \[14\].

**Data Source Reference Links:**

-   Ubuntu 26.04 LTS Package Search: [packages.ubuntu.com/resolute/](https://packages.ubuntu.com/resolute/)
-   openEuler 24.03 SP3 RVA23 RISC-V Packages: [repo.tarsier-infra.isrc.ac.cn/openEuler-RISC-V/obs/24.03SP3-RVA23/mainline/riscv64/](https://repo.tarsier-infra.isrc.ac.cn/openEuler-RISC-V/obs/24.03SP3-RVA23/mainline/riscv64/)
-   openRuyi RVA23 stable Package List: [boat.openruyi.cn/stable/rva23/src/](https://boat.openruyi.cn/stable/rva23/src/)

## Conclusion and Outlook

The introduction posed two questions. Twenty months on, both can be answered.

What was the industry doing while the world waited for hardware? Building it, on both fronts at once. The silicon vendors carried RVA23 from emulation models to tape-out, and forward to mass-produced chips. SpacemiT K3 is first among them, with more compliant chips arriving throughout 2026. In parallel, the OS distributions worked out how to absorb the new baseline, producing the sharply divergent strategies this article has outlined.

Is the software ready for the chips that have arrived? In places. RVA23 gave application-class RISC-V the one thing it had lacked: a single mandatory baseline solid enough to be compared head to head with Intel and Arm A-class processors. It did not end RISC-V’s wild west, and was never meant to; RISC-V was designed to stay open-ended. What changed is that the anchor that had held the software ecosystem back, the absence of a high-performance baseline, has finally been lifted. Some distributions have already built on it; others are waiting for the hardware to spread.

### References

<p>[1] Debian 13 “trixie” released (August 2025): <a href="https://www.debian.org/News/2025/20250809">debian.org/News/2025/20250809</a><br>[2] Fedora Project RISC-V SIG Minutes (February 3, 2026): <a href="https://meetbot.fedoraproject.org/meeting_matrix_fedoraproject-org/2026-02-03/riscv-sig.2026-02-03-16.00.html">meetbot.fedoraproject.org</a><br>[3] Red Hat partners with SiFive for a RISC-V developer preview for RHEL 10 (May 2025): <a href="https://www.redhat.com/en/blog/red-hat-partners-with-sifive-for-risc-v-developer-preview-for-red-hat-enterprise-linux-10">redhat.com</a><br>[4] SLES 16.0 Release Notes: <a href="https://documentation.suse.com/releasenotes/sles/16.0/">documentation.suse.com/releasenotes/sles/16.0/</a><br>[5] Ubuntu Launchpad Bug #2111715: <a href="https://bugs.launchpad.net/ubuntu/+source/ubuntu-release-upgrader/+bug/2111715">bugs.launchpad.net</a><br>[6] Ubuntu Summit 25.10 talk: <a href="https://www.youtube.com/watch?v=n2FpAVfU3hc">youtube.com/watch?v=n2FpAVfU3hc</a><br>[7] SiFive P550 and P570 IP press release: <a href="https://www.sifive.com/press/sifive-sets-new-bar-for-high-performance-risc-v-with-third-generation-performance-p550-and-p570-ip">sifive.com/press</a><br>[8] XiangShan “Kunminghu” (KMH) repository: <a href="https://github.com/OpenXiangShan/XiangShan/tree/kunminghu-v3">github.com/OpenXiangShan/XiangShan</a><br>[9] Andes AX66 announcement: <a href="https://www.andestech.com/en/2023/10/andes-technology-announces-the-new-generation-outoforder-risc-v-vector-processor-andescore-ax65-and-gives-a-glimpse-of-ax66-at-the-risc-v-summit-north-america/">andestech.com</a><br>[10] Tenstorrent Ascalon roadmap: <a href="https://tenstorrent.com/risc-v/">tenstorrent.com/risc-v/</a><br>[11] RVA23U64 hwprobe series (v4), June 2026: <a href="https://lore.kernel.org/linux-riscv/20260611-rva23u64-hwprobe-v2-v4-0-3f01a2449488@gmail.com/">lore.kernel.org/linux-riscv</a><br>[12] “Red Hat has updated the RISC-V Developer Preview,” June 12, 2026: <a href="https://www.redhat.com/en/blog/red-hat-has-updated-risc-v-developer-preview">redhat.com</a><br>[13] openSUSE Wiki, “openSUSE:RISC-V”: <a href="https://en.opensuse.org/openSUSE:RISC-V">en.opensuse.org/openSUSE:RISC-V</a><br>[14] openEuler RISC-V 24.03 LTS SP3 release note, OERV, 2026-02-14: <a href="https://mp.weixin.qq.com/s/NiSuWP5KwT5BQqTENEbaLg">mp.weixin.qq.com</a><br>[15] Guodong Xu, “Enable SVE in ISA-L erasure code for aarch64,” Dec 2021: <a href="https://github.com/intel/isa-l/commit/3b3d7cc">github.com/intel/isa-l</a><br>[16] “RISC-V: Support RISC-V Profiles 23,” GCC commit 66d17ba3cb47: <a href="https://github.com/gcc-mirror/gcc/commit/66d17ba3cb47980455ee9d6b4123dce61aef2fa2">github.com/gcc-mirror/gcc</a><br>[17] GCC 15 Release Series: <a href="https://gcc.gnu.org/gcc-15/">gcc.gnu.org/gcc-15/</a><br>[18] RISE: “cmovex vectorization”, 2025-07-23: <a href="https://riseproject.dev/2025/07/23/cmovex-vectorization/">riseproject.dev</a><br>[19] “RISC-V: Add Zicfilp ISA extension,” GCC commit r15-6986: <a href="https://gcc.gnu.org/pipermail/gcc-cvs/2025-January/416094.html">gcc.gnu.org/pipermail</a><br>[20] RISC-V user-space CFI patch series (v22), 2025-10-23: <a href="https://patchew.org/linux/20251023-v5._5Fuser._5Fcfi._5Fseries-v22-0-1935270f7636@rivosinc.com">patchew.org/linux</a></p>
