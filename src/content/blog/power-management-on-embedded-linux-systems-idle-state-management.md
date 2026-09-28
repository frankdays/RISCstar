---
title: "Power Management on Embedded Linux Systems: Idle State Management"
date: "2025-07-22T06:11:00+00:00"
modified: "2025-07-22T13:29:32+00:00"
author: "Daniel Thompson"
authorSlug: "daniel"
categories: ["arm", "linux-kernel", "open-source", "power-management"]
image: "/wp-content/uploads/2025/03/Blog.png"
imageWidth: 1200
imageHeight: 1200
seoTitle: "Power Management on Embedded Linux Systems: Idle State Management - RISCstar"
excerpt: "Idle states allow parts of the CPU to be de-clocked and/or powered off to minimize the power they consume. These features, selectively disabling clock or power to parts of the circuit, are sometimes referred to as clock- or power-gating."
legacyStyles: ["/wp-content/uploads/elementor/css/post-4222.css"]
---

*This is part three of our “Power Management on Embedded Linux Systems” blog series. The first two posts explore [Power States](/blog/power-management-on-embedded-linux-systems/) and [Dynamic Voltage and Frequency Scaling (DVFS](/blog/power-management-embedded-linux-dynamic-voltage-and-frequency-scaling/)).*

## Idle State Management: Core and Cluster idling

Idle states allow parts of the CPU to be de-clocked and/or powered off to minimize the power they consume. These features, selectively disabling clock or power to parts of the circuit, are sometimes referred to as clock- or power-gating.

The most shallow idle state on both Arm and RISC-V architecture can be entered by executing a wait-for-interrupt (WFI) instruction. This causes the CPU to enter a low-power state until the next interrupt. This idle state is usually “free” to enter. It does not conserve as much power as deeper idle states but is nearly instantaneous to enter and exit, meaning there are essentially no circumstances (except hardware bugs) where it should not be one of the idle states. WFI only affects the current core, so if the core shares resources (such as an L2 cache) with other cores then the shared resources may remain active even when all cores are in WFI loops.

A deeper idle state that exists on systems where the cores are combined into clusters is the cluster sleep. Cluster sleeps allow shared resources within the cluster to also enter low power states. There is usually a greater cost to enter the cluster sleep state; often it involves sending a request to a dedicated micro-controller, which has to orchestrate the sleep/wake-up sequence and requires time to perform this task. Cluster sleep is an example of a “voted” sleep, in that it requires all cores within the cluster to vote to enter the cluster sleep, otherwise the cores must remain in a shallower idle-state until they all vote the same way.

Some SoCs implement additional idle states beyond the two offered by my laptop. This was particularly common in older CPU designs where clock-gating could happen independently of power-gating. For example, if a CPU is implemented such that the WFI instruction only causes clock-gating, then some system designers introduced an additional idle state between WFI and cluster-idle. The intermediate state allowed a specific core to be power-gated without voting for a cluster sleep. This approach is less common today because most advanced CPU designs implement power-gating internally as part of the WFI implementation.

The largest number of idle states I ever recall seeing was four although that was long enough ago I can’t remember what the hardware was. Based on this logic, the laptop I diagrammed above must be very advanced because it only implements two idle states!

## That’s it for now

So far we have toured the hardware features most involved in CPU power saving on embedded Linux systems. Next time we’ll introduce the cpufreq and cpuidle subsystems found in the Linux kernel. These handle CPU DVFS and idle state management respectively and we will talk about how these systems make decisions that seek to conserve power whenever possible.

## Looking to learn more about Power management on embedded Linux systems?

[Speak with a RISCstar Power Management Expert](/talk-with-our-experts/)

Our engineers specialize in optimizing power utilization for embedded Linux systems, helping you maximize battery life without sacrificing performance. Let us help you implement the perfect balance of power management features for your specific use case.
