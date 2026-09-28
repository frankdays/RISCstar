---
title: "Power management on embedded Linux systems: Power States"
date: "2025-04-29T15:29:17+00:00"
modified: "2025-06-09T21:37:50+00:00"
author: "Daniel Thompson"
authorSlug: "daniel"
categories: ["power-management"]
image: "/wp-content/uploads/2025/03/1.png"
imageWidth: 360
imageHeight: 300
seoTitle: "Power management on embedded Linux systems: Power States - RISCstar"
description: "Power management is a fast changing topic that has become increasingly relevant to embedded Linux systems."
excerpt: "Power management is a fast changing topic that has become increasingly relevant to embedded Linux systems."
legacyStyles: ["/wp-content/uploads/elementor/css/post-2415.css"]
---

*This post is part 1 of a series of posts about modern power management for embedded Linux systems. Keep an eye out for more updates.*

Power management is a fast-changing topic that has become increasingly relevant to embedded Linux systems. Modern battery technology means more and more systems can be freed from the power plug. That brings new requirements for managing power since reducing the power consumed by the system allows devices to last longer between charges (or allows you to build it with smaller, lighter, and less expensive batteries). Even when your embedded system is hooked to the grid, environmental certification programs often make energy efficiency a key part of purchasing decisions. In this blog series, we will look at the most recent changes in cpufreq and cpuidle, and how to get the very best out of the hardware and software that drives your Arm or RISC-V-based embedded system.

In this installment, we’ll cover the two most significant hardware features that help embedded Linux systems manage the power consumed by the CPU. We will look at how Linux manages the hardware later in the series.

## The CPU Power State Spectrum

Modern devices provide many different power levels to support different modes of operation. These range from the highest performance state, which, sadly, also has the greatest power consumption, right down to the lowest power state (off), which does nothing and consumes no power.

We can present these different power levels (power states) as a spectrum from highest to lowest power consumption. Here is a summary of the power states that are implemented on my laptop:

<p><img class="aligncenter wp-image-4209" src="/wp-content/uploads/2025/03/Power-States.png" alt="" width="600" height="536"></p>

In truth, the above diagram is simplified in a couple of ways. Firstly, my laptop has 21 active states, and drawing all of these would make the diagram rather cumbersome. To solve this, I preserved the fastest and slowest operating frequencies, but, for our mutual convenience, I have filtered out many of the states in the middle. Secondly, although my laptop is based around a pair of Arm big.LITTLE CPU clusters, I have included only one cluster in the above. This reflects the fact that heterogeneous CPU architectures, such as big.LITTLE, are less common in embedded systems than they are in laptops and mobile phones.

Take note that the diagram is ordered by power consumption but does not include a scale; the position doesn’t tell us much about the actual power consumed in each state. We will come back to that later when we talk about DVFS.

The diagram separates the power states into three distinct categories: active, idle, and sleep. Each of these categories is tagged on the right with the Linux kernel subsystem that applies in each state. Before diving deeper let’s take a quick look at what each power state means.

**Active States:** These represent periods where there is work for the CPU to do. Put in slightly more technical jargon an active state means there are runnable tasks queued on the kernel scheduler. Some programs spend a lot of time waiting for input from the user or from slow peripherals such as a disk drive. Tasks that are waiting for input are blocked and are not runnable. For example, if a browser is showing a web page (and not playing music and adverts in the background), then there’s not much to do and none of its tasks are runnable. However, as soon as the user scrolls the page, the browser will become active again (some of its tasks will be made runnable) so that it can update what’s displayed.

When running in an active state, we can influence the power efficiency by changing the clock frequency of the CPU. The impact this can have on battery life is profound, hence, my laptop provides 21 operating frequencies to allow for finely tuned decisions. While higher clock speeds deliver increased performance, they are less efficient and will drain the battery much faster than doing the same calculations at a slower operating frequency. We must therefore trade off how quickly we can deliver results to the user against how much of their battery we have to use to meet their expectations.

**Idle States:** When the kernel scheduler has no runnable tasks for the CPU it will transition into a low-power idle state. Idle states conserve energy but allow a rapid return to an active state as soon as an interrupt or wake-up event gives the CPU work to do. Most systems implement multiple idle states, and although there can be any number of them, two is common and there are seldom more than four.

Multiple idle states allow for different depths-of-idle: “shallow” idle states consume more energy than “deep” idle states. Multiple idle states exist because there is a time- and energy-cost to entering and exiting idle states. Shallow idle states are quicker to enter and need less energy to enter/exit the idle state. If we enter a deep idle state and the CPU is immediately woken up we will probably spend more energy entering and exiting the idle state than we would have saved during the idle time. Having multiple idle states allows the kernel to estimate how long it will sleep for and to select an appropriate depth-of-idle to avoid wasting energy this way.

**Sleep States:** Sleep states differ from idle states because they force the kernel to stop scheduling work, even if there are runnable tasks ready to do. Whilst in the sleep state the system will ignore all input except for a very narrowly chosen set of wake-up events, such as pressing a button or opening the device’s lid.

Sleep states are very intuitive for laptops: even if your laptop is busy compiling the latest and greatest version of the kernel, when you shut the lid, you expect it to stop what it is doing so that it doesn’t get too hot when you shove it in your backpack.

Sleep states do not exist in all systems or, in some cases, they do exist but are not very useful. Mobile phones and many embedded systems are designed to reside in a very deep idle state even when the user perceives them to be “off”. For example, although mobile phones can be turned fully off, they are not useful in this state and many users don’t know how to turn the device fully off (especially so now that long-pressing the power button is becoming a shortcut to summon your digital assistant instead of the power menu). Devices like this are designed with very deep idle states together with extensive driver power management and careful sandboxing of applications. That allows them to spend a relatively long time in the deepest idle state eliminating the need for sleep-states.

We will not talk much more about the sleep states in this series since we’re going to focus on the states related to the cpufreq and cpuidle subsystems in the Linux kernel.

**Optimize Your Embedded System’s Power Management**

Is your Arm or RISC-V platform reaching its full power efficiency potential? The complex interplay of active states, idle states, and DVFS can make a profound impact on your device’s battery life and performance.

Are you looking to learn more about Power management on embedded Linux systems? Part two of this blog series explores [Dynamic Voltage and Frequency Scaling (DVFS)](/blog/power-management-embedded-linux-dynamic-voltage-and-frequency-scaling/).

[Speak with a RISCstar Power Management Expert](/talk-with-our-experts/)

Our engineers specialize in optimizing power utilization for embedded Linux systems, helping you maximize battery life without sacrificing performance. Let us help you implement the perfect balance of power management features for your specific use case.
