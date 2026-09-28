---
title: "Announcing 16.1-r1 RISCstar Toolchain for RISC-V"
date: "2026-07-13T23:10:59+00:00"
modified: "2026-07-14T14:29:51+00:00"
author: "Daniel Thompson"
authorSlug: "daniel"
categories: ["news", "risc-v"]
image: "/wp-content/uploads/2026/07/RISCstar_Toolchain.png"
imageWidth: 1920
imageHeight: 1080
seoTitle: "Announcing 16.1-r1 RISCstar Toolchain for RISC-V - RISCstar"
description: "Learn how Linux kernel technical debt impacts embedded systems. Discover causes, costs, warning signs, and proven strategies to manage kernel debt effectively."
excerpt: "RISCstar is proud to announce their GCC 16.1-r1 release of the RISCstar Toolchain for RISC-V."
legacyStyles: ["/wp-content/uploads/elementor/css/post-7347.css"]
---

<p>&nbsp;</p>

RISCstar is proud to announce their GCC 16.1-r1 release of the [RISCstar Toolchain for RISC-V](/toolchain).

The toolchain is based on gcc 16.1, binutils 2.46 and gdb 17.1 and is carefully engineered to work with almost any glibc-based distribution. Depending on the toolchain edition you will also find linux 6.12 kernel headers, glibc 2.41, musl 1.2.6 and/or newlib 4.6.

In addition to adopting the new upstream releases the embedded toolchain for 32- and 64-bit RISC-V microcontrollers gets additional changes in this release. The libraries are now pre-compiled for an even wider range of RV32 instruction set extensions (please [contact us](/contact-us/) if your microcontroller is not supported yet). The libraries also come with newlib-nano to help you save code size when targeting tiny devices. Use –specs=nano.specs to enable newlib-nano.

Also note that RISCstar continues to make available and provide support for their 15.2 release of the toolchain and is currently preparing an updated release based on gcc 15.3 which it expects to announce and make available in the near future.

The RISCstar Toolchain is carefully engineered to work with multiple glibc-based distributions. For the 16.x release series we have raised the minimum supported glibc version to support any glibc-based distribution released on or after:

-   Red Hat Enterprise Linux 8 (2019) or Ubuntu 18.04 LTS for toolchains running on x86-64 and AArch64 hosts
-   Red Hat Enterprise Linux 10 (2025) or Ubuntu 24.04 LTS for toolchains running in RISC-V (RVA23U64 or later) hosts

The distributions above are selected to cover a wide range of actively maintained enterprise distributions. If you need to use the RISCstar Toolchain on distributions in an extended support phase (such as Red Hat Enterprise Linux 7) we recommend remaining on the RISCstar Toolchain for RISC-V 15.x release series.

For toolchain support please visit our forums at [https://forums.riscstar.com/c/toolchain](https://forums.riscstar.com/c/toolchain). 

[Contact us](/contact-us/) to discuss toolchain support contracts, custom toolchain engineering or custom releases for extended support phase distributions.
