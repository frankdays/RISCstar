---
title: "Advancing OpenSBI Interrupt Handling"
date: "2026-07-20T16:35:09+00:00"
modified: "2026-07-20T16:35:51+00:00"
author: "Raymond Mao"
authorSlug: "raymondmao"
authorBio: "Raymond Mao is a Senior Software Engineer at RISCstar Solutions. He has contributed to TF-A, OP-TEE, U-Boot, OpenSBI, with a focus on secure firmware, boot architecture, trusted execution environments, and system-level security. His most recent work at RISCstar focuses on foundational RISC-V system software through the RISE projects. Ray and his colleagues at RISCstar collaborated with RISE to drive the RISC-V OpenSBI development and upstreaming project."
categories: ["news", "risc-v"]
image: "/wp-content/uploads/2026/07/OpenSBI_Interrupt_Handling.png"
imageWidth: 994
imageHeight: 343
seoTitle: "Advancing OpenSBI Interrupt Handling - RISCstar"
description: "Learn how Linux kernel technical debt impacts embedded systems. Discover causes, costs, warning signs, and proven strategies to manage kernel debt effectively."
excerpt: "Supervisor Binary Interface, commonly known as SBI, defines how supervisor-level software – such as an operating system or a hypervisor – requests services from a more privileged execution environment. In the open-source RISC-V ecosystem, a widely used implementation of this interface is OpenSBI."
legacyStyles: ["/wp-content/uploads/elementor/css/post-7475.css"]
---

<p>&nbsp;</p>

This post was originally published on the [RISE blog](https://riseproject.dev/2026/07/16/advancing-opensbi-interrupt-handling/).

<p>&nbsp;</p>

RISC-V is much more than just an instruction set architecture, it’s a complete open hardware architecture. That means virtualization, trusted execution environments, and domain-based isolation increasingly matters to Linux-capable RISC-V systems.

*Supervisor Binary Interface*, commonly known as SBI, defines how supervisor-level software – such as an operating system or a hypervisor – requests services from a more privileged execution environment. In the open-source RISC-V ecosystem, a widely used implementation of this interface is [OpenSBI](https://github.com/riscv-software-src/opensbi).

At RISCstar Solutions, we have been contributing to OpenSBI to improve its interrupt-handling infrastructure, with a particular focus on secure and domain-aware RISC-V systems. This work  

helps to answer several questions:

-   who owns the physical interrupt
-   where it should be delivered
-   how that delivery can be controlled properly

# What Is SBI?

Multiple privilege levels coexist in a RISC-V system:

-   user mode (U-mode) for application software
-   supervisor mode (S-mode) for operating system
-   hypervisor mode (HS-mode) for hypervisors, and
-   machine mode (M-mode, the highest privilege level in the RISC-V architecture) for machine-level firmware

The RISC-V Supervisor Binary Interface (SBI) is a standard interface between supervisor-mode software and Supervisor Execution Environment (SEE). A typical example of SEE is an M-mode firmware.

The SEE is the execution environment that provides SBI services to supervisor-mode software. 

It is beneficial to make supervisor-mode software portable across different RISC-V platforms on top of the low-level hardware implementations. This makes the separation important: Timers, interrupt controllers, hart (hardware thread, a physical or logical CPU core) management, reset paths, and other platform services can be implemented differently per SoC.

SBI defines the standard boundary that allows those platform-specific details to remain in the SEE, instead of being duplicated in every operating system or hypervisor. This makes supervisor-mode software simpler, more portable, and less dependent on a particular hardware implementation.

An operating system, running in S-mode, can use SBI calls to request services such as:

-   timer programming
-   inter-processor interrupts
-   remote TLB and cache management operations
-   hart state management
-   system reset
-   performance-monitoring support
-   debug console services
-   firmware feature discovery
-   message-proxy (MPXY) style services

The SBI calling convention is as simple:

1.  Supervisor software issues an *Environment Call* (ECALL) instruction.
2.  Registers identify the SBI extension, the function within that extension, and the arguments.
3.  The higher-privilege execution environment handles the request and returns a standard result.

A simplified flow is as below:

<p><img class="aligncenter size-full wp-image-7486" src="/wp-content/uploads/2026/07/SBI-Flow.png" alt="" width="815" height="506"></p>

<p>&nbsp;</p>

This interface gives RISC-V systems a portable protocol between supervisor software and platform firmware running in machine mode. An operating system or hypervisor can rely on a standard SBI interface while the underlying firmware running in machine mode hides differences between platforms.

# What Is OpenSBI?

OpenSBI, known as an open-source SBI implementation, runs at RISC-V machine mode and provides services to S-mode or HS-mode software (for example: Linux, U-Boot, a hypervisor, or other supervisor-level software payloads). It offers a standard interface for supervisor software while hiding platform-specific details. It is best understood as a standard M-mode runtime firmware layer that sits below supervisor software and above the low-level hardware platform, providing standardized services defined by the Supervisory Binary Interface specification..

A simplified RISC-V reference software stack is as follows:

<p><img class="aligncenter size-full wp-image-7485" src="/wp-content/uploads/2026/07/sbi-stack.png" alt="" width="801" height="508"></p>

# Building OpenSBI Interrupt Infrastructure

RISCstar Solutions’ recent OpenSBI work was carried out as part of RISE Project RP016 and consists of two connected pieces. The first piece adds a reusable path for APLIC M-mode wired interrupt handling. The second builds on that foundation and introduces a Virtual IRQ framework for mapping, routing, queueing, and delivering interrupts to the correct S-mode domain while keeping physical interrupt ownership under M-mode control.

Together, these changes move OpenSBI’s interrupt infrastructure from a model focused mainly on initialization and delegation toward a more flexible model that can also support mapping, routing and domain-aware delivery.

## APLIC M-mode Wired Interrupt Handling Support

The *Advanced Platform-Level Interrupt Controller* (APLIC), known as part of the RISC-V *Advanced Interrupt Architecture* (AIA), supports wired interrupts and is being used in different delivery modes depending on the platform configuration.

Before this work, OpenSBI had APLIC-related support, but a complete and reusable path for handling real wired interrupts directly in M-mode was missing. Such a path is needed when M-mode firmware must retain control of certain physical interrupts, either for platform management, isolation, security, or domain management.

To solve this, we introduced a generic interrupt-controller abstraction for M-mode wired interrupts. The abstraction allows OpenSBI’s interrupt dispatch logic to claim an interrupt, dispatch it to a registered handler, and complete it through a common interface, without hard-coding the dispatch path to APLIC-specific logic. This design also makes the same dispatch model reusable for other interrupt controllers in the future.

For the APLIC, the implementation uses the *interrupt delivery controller* (IDC) claim mechanism to identify the pending hardware interrupt.  The interrupt is then dispatched through OpenSBI’s interrupt handling path. For level-triggered interrupts, such as UART RX, the device-side source must also be cleared properly to avoid interrupt storms due to immediate re-entry.

The complete flow is:

<p><img class="aligncenter size-full wp-image-7484" src="/wp-content/uploads/2026/07/sbi-aplic.png" alt="" width="846" height="504"></p>

<p>&nbsp;</p>

Our work was validated on a QEMU virtual machine with AIA/APLIC enabled, using UART RX as a real wired interrupt source. We also provided tests for demonstrating a clean claim – handle – complete lifecycle, with one interrupt per keypress and no repeated storm once the UART source was properly drained. Just as importantly, the work was validated alongside normal Linux interrupt behavior. The M-mode APLIC wired-interrupt path did not break the delegation of Linux’s APLIC-direct interrupt handling or IRQ affinity behavior. That compatibility is important because OpenSBI infrastructure must coexist cleanly with existing operating-system flows.

The work was delivered to the RISE Project and is now available for review and testing in the [RISE Project GitLab](https://gitlab.com/riseproject/riscv-optee). For more design details and test instructions, please visit the article [APLIC M-mode Wired Interrupt Support in OpenSBI](https://riscv-optee-docs-c9fea0.gitlab.io/rp016/milestone2). The patch series is also under review in the OpenSBI mailing list.

## Virtual IRQ Mapping, Routing, and Couriering

The second part of our work addressed a more difficult problem.

*“If physical interrupts remain under M-mode control, how can selected interrupts still be delivered safely and predictably to the right S-mode software domain?”*

This question matters for domain-aware systems. OpenSBI already has a domain model that can partition harts and memory regions. However, interrupt delivery also needs a controlled model. A physical interrupt may be owned by M-mode, but the actual software that should respond to it may run in an S-mode payload associated with a particular domain.

To address this, RISCstar designed and developed a lightweight Virtual IRQ (VIRQ) framework that provides:

-   stable mapping from physical hardware IRQs to virtual IRQ numbers via growable bitmap.
-   Devicetree based routing rules that identify the target OpenSBI domain
-   per-domain and per-hart pending interrupt queue management
-   controlled notification to S-mode software via *Supervisor External Interrupt Pending* (SEIP)
-   an SBI ECALL extension for S-mode software to pop and complete pending virtual interrupts
-   optional domain switching when an interrupt needs to be delivered to a different target domain

The design keeps physical interrupt ownership in M-mode. When a routed hardware interrupt arrives, OpenSBI handles the delivery in a controlled sequence:

OpenSBI claims the physical hardware interrupt in M-mode.

1.  It maps the hardware interrupt to a virtual IRQ.
2.  It applies the routing policy to identify the target OpenSBI domain.
3.  It queues the virtual IRQ for the target domain and hart.
4.  It notifies the target S-mode payload.

From an S-mode payload’s point of view, it is a simple virtual interrupt model without the need to know the physical interrupt topology.

A simplified flow looks like this:

<p><img class="aligncenter size-full wp-image-7483" src="/wp-content/uploads/2026/07/sbi-routing.png" alt="" width="828" height="489"></p>

The routing model is also intentionally aligned with how RISC-V systems describe hardware. SBI itself is not intended to be a hardware-discovery mechanism and Devicetree is used to describe a static hardware topology. For that reason, the VIRQ routing rules are described via Devicetree rather than being embedded directly into the SBI ABI.

For an S-mode payload, the VIRQ model hides the complexity of physical interrupt ownership, controller-specific behavior, route lookup, queue management, and completion semantics behind a compact virtual interrupt interface.

In our validation setup, a QEMU virt system was configured with multiple harts and multiple domains. Linux continued to run in the root domain, while selected hardware interrupts were routed to a bare-metal S-mode payload in another domain. UART RX HWIRQ 10 was mapped to a virtual IRQ, routed to the target domain, delivered through the VIRQ queue, handled by the S-mode payload, completed through SBI, and then returned to the previous domain context.

This demonstrates the core value of the framework: physical IRQs can remain under M-mode control, while selected events are delivered to the right S-mode domain through a controlled and auditable path.

This work was delivered to the RISE Project and is now available for reviewing and testing in the [RISE Project GitLab](https://gitlab.com/riseproject/riscv-optee). For more design details and test instructions, please visit the article [Virtual IRQ mapping / routing / couriering subsystem in OpenSBI](https://riscv-optee-docs-c9fea0.gitlab.io/rp016/milestone3). This patch series is also under review in the OpenSBI mailing list.

# What Does This Bring to the Ecosystem?

Interrupt handling is a foundational part of system software. For simple systems, direct delegation may be enough. But for systems that care about isolation, trusted execution, virtualization, or firmware-mediated resource control, interrupt handling needs more structure.

Our work improves OpenSBI in several ways: 

-   **Reusable M-mode wired interrupt handling.**  The generic provider abstraction avoids tying the OpenSBI trap path to a specific interrupt controller. This creates a cleaner foundation for supporting APLIC and other interrupt controllers through a common claim, dispatch, and complete model.

-   **APLIC-based wired interrupts retained control in M-mode.**  The APLIC implementation makes it possible for OpenSBI to handle selected wired interrupts directly in M-mode. This is useful for platforms where M-mode firmware must retain ownership of specific physical interrupt sources for platform management, isolation, security, or domain-level control.

-   **Domain-aware virtual interrupt delivery.**  The VIRQ framework allows OpenSBI to keep control of the physical interrupt while delivering a virtual IRQ to the appropriate S-mode payload. Instead of exposing the physical interrupt topology directly to S-mode software, OpenSBI claims the interrupt in M-mode, maps it to a virtual IRQ, applies the routing policy, queues it for the target domain and hart, and notifies the target payload.

-   **Compatibility with existing interrupt behavior.**  Interrupts that are not explicitly routed can fall back to the root domain, and existing interrupt delegation behavior can continue unaffected. This allows the new infrastructure to be introduced incrementally without disrupting existing OpenSBI and Linux interrupt flows.

-   **Alignment with OpenSBI’s broader domain-aware direction.**  OpenSBI has been growing support for domains, per-domain data, message proxying, and richer platform services. The interrupt work described here fits naturally into that direction by adding controlled interrupt routing and delivery as part of the infrastructure needed for secure and composable RISC-V systems.

# Summary

OpenSBI plays a central role in RISC-V boot and runtime firmware. It gives operating systems and hypervisors a standard SBI interface and hides platform-specific M-mode details behind reusable firmware infrastructure.  Our recent contribution extends that role in the interrupt subsystem.

The APLIC M-mode wired interrupt work provides the low-level foundation: claim, handle, clear, complete, mask, and unmask real hardware interrupts through a generic provider model.

The VIRQ framework builds on that foundation: map physical interrupts to virtual interrupts, route them to domains, queue them per hart, notify S-mode software, and complete them under M-mode control.

Together, these pieces move OpenSBI toward a more capable interrupt architecture for modern RISC-V systems. They help make interrupt handling not only functional, but also reusable, policy-aware, and suitable for secure multi-domain environments.

As RISC-V systems continue to scale, this kind of firmware infrastructure will become increasingly important. RISCstar is proud to work with RISE and contribute to the RISC-V ecosystem to help strengthen its open-source foundation.
