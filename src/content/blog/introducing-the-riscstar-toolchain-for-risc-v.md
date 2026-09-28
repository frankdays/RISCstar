---
title: "Introducing the RISCstar toolchain for RISC-V"
date: "2025-10-22T16:33:55+00:00"
modified: "2025-12-05T11:22:12+00:00"
author: "Daniel Thompson"
authorSlug: "daniel"
categories: ["news", "open-source", "risc-v"]
image: "/wp-content/uploads/2025/10/Copy-of-Introducing-the-RISCstar-toolchain-for-RISC-V-2.png"
imageWidth: 998
imageHeight: 676
seoTitle: "Introducing the RISCstar toolchain for RISC-V - RISCstar"
description: "Learn how Linux kernel technical debt impacts embedded systems. Discover causes, costs, warning signs, and proven strategies to manage kernel debt effectively."
excerpt: "Daniel Thompson, tech lead for the RISCstar toolchain, shares a few of the technical details behind this new toolchain for RISC-V."
legacyStyles: ["/wp-content/uploads/elementor/css/post-5253.css"]
---

<p>&nbsp;</p>

<p><span style="font-weight: 400;">The newly released </span><a href="/toolchain"><span style="font-weight: 400;">RISCstar toolchain</span></a><span style="font-weight: 400;"> is a pre-compiled family of GNU toolchains for RISC-V developers. It supports the entire RISC-V ecosystem, from the latest 64-bit application processors, right down to tiny RV32E microcontrollers. It is carefully engineered to support a wide variety of host architectures and Linux distributions, including common enterprise distributions.</span></p>

<p><span style="font-weight: 400;">The RISCstar toolchain for RISC-V is free to </span><a href="/toolchain/#downloads"><span style="font-weight: 400;">download</span></a><span style="font-weight: 400;"> and use.</span></p>

<p><span style="font-weight: 400;">In this blog post, the lead engineer on this project, Daniel Thompson, shares a few of the technical details behind the new toolchain.</span></p>

<h6>&nbsp;</h6>

* * *

<h6>&nbsp;</h6>

<p><span style="font-weight: 400;">When I pitched releasing a pre-built binary toolchain for RISC-V to my colleagues they asked me many questions but, when I look back, there were three that struck me as the most important. They were good questions, with just the right mix of critical-thinking and support. I’d like to walk you through my answers.</span></p>

## **Is a RISC-V toolchain needed?**

<p><span style="font-weight: 400;">When I started to look seriously at RISC-V for the first time I naively went looking for a one-stop RISC-V toolchain and didn’t find one. Instead I found some build-it-yourself approaches together with some binary releases intended largely for compiler testing. I also found several vendor-specific toolchain binaries, many of which were x86 only and didn’t run on my Arm laptop. Annoying, perhaps, but I could find ways around that!</span></p>

<p><span style="font-weight: 400;">However, the thing that really convinced me to push forward with the RISCstar toolchain idea was reading some of the official Raspberry Pi documentation, where it advised people wanting to work on the RP2350’s RISC-V cores to compile a toolchain themselves. Given the available toolchains at that point in time, I should be clear that I didn’t disagree with the advice. In the circumstances at the time, the guidance was absolutely correct. However I couldn’t help thinking that we could make the ecosystem more developer friendly. There had to be a better way!</span></p>

## **Will it be a good product?**

<p><span style="font-weight: 400;">In my early career I worked as part of a toolchain team and, whilst I left that role nearly twenty years ago, I still care deeply about the toolchains that I rely on for my day-to-day work. So I know what a great toolchain looks like: wide distro support, good host architecture support, building the latest compilers and optimizing them for runtime performance. I spent a couple of weeks hooking together a proof-of-concept based on these ideas and then spent more time than I’d like to admit polishing things.</span></p>

<p><span style="font-weight: 400;">This approach to making a product intrinsically relies on the upstream projects that comprise the toolchain. All the projects we have integrated code from have a great track record across many releases. It is important to acknowledge the terrific work these projects do.&nbsp; It’s not just the programs you can see in the PATH (</span><a href="https://gcc.gnu.org/"><span style="font-weight: 400;">gcc</span></a><span style="font-weight: 400;">, </span><a href="https://www.gnu.org/software/binutils/"><span style="font-weight: 400;">binutils</span></a><span style="font-weight: 400;">, </span><a href="https://sourceware.org/gdb/"><span style="font-weight: 400;">gdb</span></a><span style="font-weight: 400;">), we also must acknowledge the libraries the tools depend upon together with the </span><a href="https://crosstool-ng.github.io/"><span style="font-weight: 400;">crosstool-ng</span></a><span style="font-weight: 400;"> build scripts we use to bring everything together. The RISCstar toolchain could not exist without these projects.</span></p>

## **Is it maintainable?**

<p><span style="font-weight: 400;">We built the first edition of the RISCstar toolchain more than nine months ago but we kept it strictly for in-house use. This wasn’t just “dog fooding”, we were also waiting for the next release of gcc so we could find out if it was difficult to upgrade toolchain components. That you are reading this blog post should tell you that we’ve learned enough about maintenance to be confident releasing our toolchain to the world! We have sufficient resources to keep the toolchain up-to-date.</span></p>

<p><span style="font-weight: 400;">Right now we have no plans to extend the feature set beyond what we have currently. If you have an upcoming RISC-V product and need something extra we’d be very happy to </span><a href="/talk-with-our-experts/"><span style="font-weight: 400;">discuss that with you</span></a><span style="font-weight: 400;">.</span></p>

* * *

<h6>&nbsp;</h6>

## **Built the Canadian way!**

<p><span style="font-weight: 400;">With the questions from my colleagues addressed. There are a couple of technical elements of the toolchain I’d like to mention. I don’t want to write a huge sprawling blog post about every tiny detail of the toolchain so I shall focus on just two.</span></p>

<p><span style="font-weight: 400;">Firstly, I wanted to mention how we use “canadian-cross” to ensure the toolchain works on a wide variety of host GNU/Linux distributions (including Arch, Debian, Fedora, openSUSE, Red Hat Enterprise Linux, Ubuntu and more). Canadian-cross describes the process of cross-compiling a cross-compiler and typically involves three architecture-and-OS combinations:</span></p>

<ul><li style="font-weight: 400;" aria-level="1"><b>Build</b><span style="font-weight: 400;"> – the architecture and OS of the machine that we will build the cross-compiler on</span></li><li style="font-weight: 400;" aria-level="1"><b>Host</b><span style="font-weight: 400;"> – the architecture and OS the cross-compiler will run on</span></li><li style="font-weight: 400;" aria-level="1"><b>Target</b><span style="font-weight: 400;"> – the architecture and OS the compiler will generate code for</span></li></ul>

<p><span style="font-weight: 400;">As an aside, the origin of the term canadian-cross is surprisingly mundane. It is simply that, when the term was coined, Canada had three large political parties shaping its politics. This reflects in the three differing architectures involved in a traditional canadian-cross build.</span></p>

<p><span style="font-weight: 400;">Taking the RISCstar toolchain running on AArch64 as an example: build on x86-64, host on AArch64, and target compiled code at RISC-V. To start off building this toolchain, we must first build an AArch64 cross-compiler. In our case, this compiler is carefully constructed to produce binaries with minimal dependencies and that work on both the latest cutting edge distributions as well as older enterprise distributions (going all the way back to Red Hat Enterprise Linux 7). The result is a highly portable toolchain that runs almost everywhere that glibc does!</span></p>

<p><span style="font-weight: 400;">Our builds for x86-64 follow a similar pattern: build on x86-64, host on x86-64, and target compiled code at RISC-V. In this case, both the build and host are the same architecture. The trick is that they target a different OS. Our build machine could be any x86-64 box we happen to have lying around, regardless of OS. However the host has the same carefully constrained minimal OS that we target in the AArch64 canadian-cross builds.</span></p>

<p><span style="font-weight: 400;">Or, putting it a different way and with less jargon, we always build the RISCstar toolchain releases using a special build of the RISCstar toolchain! That doesn’t just give us cross-distribution portability. It also means we always build the binaries using the latest compilers, regardless of the compiler version on the build machine. That means our releases contain the latest compiler improvements! The difference is modest but is enough to reduce your compile times by a few percent compared to other experimental compilers we built using an enterprise distributions’s native compiler.</span></p>

* * *

<h6>&nbsp;</h6>

## **Microcontroller coverage**

<p><span style="font-weight: 400;">The second technical topic is about ensuring the embedded toolchain variant supports as many microcontrollers as possible. Maybe it’s even something you can help us with!</span></p>

<p><span style="font-weight: 400;">The </span><span style="font-weight: 400;">riscv32-none-elf</span><span style="font-weight: 400;"> variant of the toolchain is used for bare-metal programming and is bundled with pre-compiled C libraries and other compiler support libraries. In order to address the full diverse range of RISC-V microcontrollers we enable “multilib” support. multilib allows us to provide multiple versions of the bundled libraries, each one tuned for a different set of RISC-V extensions.</span></p>

<p><span style="font-weight: 400;">To make multilib work we provide the build system a list of gcc </span><span style="font-weight: 400;">-march</span><span style="font-weight: 400;">&nbsp;tuning options for each microcontroller we support. We did our research and came up with a list of tuning options which gives us a broad coverage of microcontrollers. We currently provide thirteen different tuned builds. We’ve actually lost count of the number of supported microcontroller families because multiple microcontroller families can use the same tuning options. Rest assured, however, that the list does include the Raspberry Pi RP2350 that originally attracted my attention.</span></p>

<p><span style="font-weight: 400;">Despite our efforts, it remains possible we overlooked a microcontroller family that you really care about. So if you use the </span><span style="font-weight: 400;">riscv32-none-elf</span><span style="font-weight: 400;"> edition of the RISCstar toolchain and find that support for your favorite </span><span style="font-weight: 400;">-march=rv32i_zba_zbb_z</span><b>fancyoption</b><span style="font-weight: 400;"> is missing then please do </span><a href="https://forums.riscstar.com/c/toolchain"><span style="font-weight: 400;">get in touch</span></a><span style="font-weight: 400;">. We’d love to hear your feedback and to make sure the next version supports as many microcontrollers as we can.</span></p>

<h6>&nbsp;</h6>

* * *

<h6>&nbsp;</h6>

<p><span style="font-weight: 400;">The RISC-V toolchain is comprised of free and open-source software and is free to </span><a href="/toolchain"><span style="font-weight: 400;">download</span></a><span style="font-weight: 400;"> and use.</span></p>

<p><span style="font-weight: 400;">We’ll be carefully monitoring the download counts over the next few months to see how the RISC-V community reacts. I’m excited to find out if the community agrees that it’s a useful contribution to the RISC-V ecosystem! I’m also very interested to see which toolchain variant is the most popular.</span></p>

<p><span style="font-weight: 400;">Vote with your downloads!</span></p>
