---
title: "Idle CPU power management: cpuidle (from CNX Software)"
date: "2026-04-20T13:30:57+00:00"
modified: "2026-04-21T11:41:25+00:00"
author: "Daniel Thompson"
authorSlug: "daniel"
categories: ["power-management"]
image: "/wp-content/uploads/2026/04/Idle_CPU_power_management_-cpuidle-.png"
imageAlt: "Idle CPU power management: cpuidle"
imageWidth: 933
imageHeight: 626
seoTitle: "Idle CPU power management: cpuidle (from CNX Software) - RISCstar"
excerpt: "We are looking at how cpufreq and its most sophisticated governor, schedutil, allow the kernel to take advantage of Dynamic Voltage/Frequency Scaling (DVFS).\ncpufreq generally adopts the mantra “work when there is work to be done”. In other words, when there is a “demand” on the system, then the kernel will do its best to give these tasks the CPU time they require to perform the task. However, whenever the demand is less than 100% of the maximum CPU capacity, cpufreq will attempt to opportunistically save energy by slowing down some or all of the cores."
legacyStyles: ["/wp-content/uploads/elementor/css/post-7121.css"]
---

<p>&nbsp;</p>

Twenty years ago, it was easy for an operating system kernel to go idle: when there were no tasks to run, “the idle loop” would be scheduled. Early idle loops were basically empty infinite loops that did nothing while waiting for the next interrupt to happen. This saved power simply by avoiding running instructions that needed power hungry components such as the cache or FPU!

Over time, changing technology has allowed multiple additional hardware mechanisms to reduce power to be introduced. With these new options available, today the idle loop is responsible for choosing and deploying the “best” way to go idle.

As a brief reminder, entering and returning from an idle state has a cost and that cost can be measured both in time and in energy. Typically the shallowest idle state is “nearly free” to enter/exit whilst deeper idle states have increasingly higher costs to enter and exit. If the system enters a deep idle state and wakes up soon after sleeping then energy will have been wasted because the energy cost to enter the deep idle state is greater than the energy saved whilst residing in that state. 

cpuidle is the kernel sub-system that governs idle state transitions. Like cpufreq, *mechanism* is separated from *policy*, through the use of drivers and governors.

<ul><li aria-level="1">cpuidle drivers provide the <i>mechanism</i> needed to enter and exit idle states. They enumerate the available idle states to the governor. As part of that they describe to the governor the energy saving properties of each state. Finally drivers are able to enter idle states at the request of the governor.<br><br>Drivers can be fully customized for the unique properties of each System-on-Chip (SoC). However CPU idle states are often well supported by low-level platform firmware and made available to the kernel using standard interfaces such as PSCI (Power State Coordination Interface) on Arm and SBI (Supervisor Binary Interface) on RISC-V. Thus whilst there is scope for per-SoC drivers, in reality these are becoming unusual. Most modern architectures, including both Arm and RISC-V, define standardized interfaces allowing a single Arm and single RISC-V driver to be shared by a wide range of SoC families.<br>&nbsp;</li><li aria-level="1">cpuidle governors provide <i>policy</i> and are responsible for choosing the “best” idle state from among those available.<br><br>The governors use the information from the drivers, together with gathered data about historic or known-future events (such as timer wakeups) to make an “educated guess” about when the CPU will need to leave the idle state due to an interrupt. Based on the estimated wake up time it can select the idle state likely to save the greatest amount of energy.<br><br><img class="aligncenter size-full wp-image-7128" src="/wp-content/uploads/2026/04/Linux-Kernel-cpuidle-subsystem-architecture-720x428-1.jpg" alt="" width="720" height="428"></li></ul>

## How do cpuidle governors make decisions?

cpuidle governors receive data about the physical characteristics of the system from the cpuidle driver. This takes the form of a list of idle states, where each state is annotated with a *target residency*. Target residency is the minimum time a CPU must spend in an idle state to save energy compared to shallower states. In other words, although the target residency is measured in time, it actually provides data that allows the governor to compare the energy cost of entering and exiting the different idle states. There are three possibilities when a system leaves an idle state:

1.  If a system is awakened before reaching the target residency time then the system wasted energy by selecting an idle state that was too deep
2.  If a system remains in an idle state for longer than the target residency time of a deeper idle state (if there is one) then the system wasted energy because the deeper idle state would have saved more energy
3.  If a system was woken after reaching the target residency time for our selected state but before reaching the target residency of a deeper idle state then the choice was optimal

All cpuidle governors keep track of historic idle entry/exit timings, in fact they make them visible for each CPU at /sys/devices/system/cpu/cpu<N>/cpuidle so you can check them yourself!

The governors assume that the length of recent idle periods can be used to predict the future. In fact the ladder governor (used in systems with a regular scheduler tick) and haltpoll governors (specialized governor for virtual machines) work exclusively using historic data.

Other governors, such as menu and teo (timer-event oriented), receive a glimpse into the future, although that view is rather limited. In general, drivers don’t report when they expect their interrupts will fire but there is one interrupt that can be predicted “perfectly”: we always know when the next timer interrupt is due. Thus the upper bound for any idle period is the time to the next timer interrupt. For many use-cases, timer interrupts are significantly more frequent than any other. That means that, providing historic entry/exit tracking suggests we are running shows that we are running a use-case dominated by the timer interrupt then it is an excellent predictor of idle time.

The final factor at play in governance decisions is the energy cost of the decision making itself! All computation has an energy cost. It doesn’t matter if the governor makes the best decision if it burns too much energy making the decision! This is especially true when the system is experiencing short idle periods. In that case making a **fast** decision to enter the shallowest idle state is extremely desirable!

The menu and teo governors both use the timer to inform decisions but adopt different strategies:

<ul><li aria-level="1">The menu governor seeks to generate a predicted sleep time by taking the next wake up time and applying a correction factor derived from recent history to adjust it. Once it has made a prediction it can look up the best idle state.<br><br></li><li aria-level="1">The teo governor quantizes the historic information into bins based on the target residency times for each idle state. The quantized data does not allow prediction the idle time but, because each bin corresponds to a specific idle state, it is still able to predict which idle state will be best! It then uses the next wake up time to improve the choice by selecting a shallower mode if the timer will fire shortly.</li></ul>

<p><img class="aligncenter size-full wp-image-7129" src="/wp-content/uploads/2026/04/CPUidle-governor-decision-logic-menu-vs-TEO-720x434-1.webp" alt="" width="720" height="434"></p>

Additional detail about the menu and teo governors in the [Linux kernel documentation](https://www.kernel.org/doc/html/latest/admin-guide/pm/cpuidle.html#the-menu-governor).

<p>&nbsp;</p>

## **Tuning Idle Behaviour for Lower Power Consumption**

All cpuidle governors share something in common with the schedutil governor: the governors themselves do not offer any tuneable values to tweak their heuristics. As we saw before that doesn’t mean there is nothing for us to tune, just that to conserve power (or improve performance) we have to look outside of the governor itself. Today we’ll be discussing some of those options.

## Going tickless

For many years Linux managed the flow of time by establishing a timer that fired 100 times per second and using this “scheduler tick” to swap processes and handle timer expiry in drivers. This tick is configurable and the scheduler tick can be set to 100, 250 or 1000Hz. Changing CONFIG\_HZ can have profound effects on system behaviour and it is an interesting kernel tuneable when seeking to balance power consumption and interactivity (although which value results in the lowest power consumption varies with workload).

<p>When CONFIG_HZ is set to the minimum value and the system is waking up 100 times a second, the system can never go idle for more than 10ms. Waking up this frequently can reduce the effectiveness of deep-idle states and should be avoided on systems that seek to conserve energy this way.<br><br>Tickless kernels either disable the scheduler tick when the system goes idle (CONFIG_NO_HZ_IDLE=y) or when there is only a single task running on the CPU (CONFIG_NO_HZ_FULL=y). Setting either option allows longer residency in idle states. The exact difference between these options is subtle and not in scope for this post. See <a href="https://www.kernel.org/doc/html/latest/timers/no_hz.html">NO_HZ: Reducing Scheduling-Clock Ticks</a> if you are interested in more!</p>

<p><img class="aligncenter size-full wp-image-7130" src="/wp-content/uploads/2026/04/CPUidle-residency-standard-tick-vs-tickless-1-720x393-1.webp" alt="" width="720" height="393"><br><br>Finally we should note that there is little point in going tickless if there is a driver that wakes up 100 times a second to poll, for example, an SPI peripheral! If you have gone tickless you should also make sure that the code running on your system doesn’t introduce unnecessary periodic ticks by polling for status. Note also that if&nbsp; polling cannot be avoided then it’s still important to ensure the driver shuts the polling down when there are no clients.<b><br><br></b></p>

## Try a different cpuidle governor

If you have a tickless system there is a choice of two governors: menu and teo (timer-event oriented).

The menu governor is the default and works by predicting how long the system will be idle for. It monitors the historic wake up intervals and the due time of the next timer interrupt, filtering them to identify the “typical” wake up interval.  It then uses that prediction to choose from the menu of choices offered by the cpuidle driver.

The teo governor uses the same sources of data but tracks the statistical data to directly predict the best idle state, without predicting exactly how long it expects the system to remain idle for. When the system wakes up frequently this allows it to avoid the (relatively expensive) peek at the timer queue reducing energy costs of its decision making.

<p>The governor can be inspected and changed via sysfs: /sys/devices/system/cpu/cpuidle/current_governor.<b><br><br></b></p>

## Power Management Quality of Service (PM QoS) Requests

Author Daniel Thompson, RISCstar Solutions

As mentioned in the introductory sections, entering/leaving idle state has a cost that can be measured in both time and in energy. The cpuidle governor usually makes decisions based on energy cost but there are situations where we have to consider the time cost as well. For example if we are in a deep idle state it can take a long time to get the CPU running again. What if an important interrupt arrives during a deep idle state and we don’t respond fast enough? We don’t want the idle system to cause us to miss real-time deadlines, such as refilling an audio buffer.

<p>One way to solve this is to disable the deep idle state, but doing that globally will cause energy to be burned unnecessarily when not running time-sensitive applications.<br><br>A better way to address this is ensure all drivers and userspace register their <a href="https://docs.kernel.org/power/pm_qos_interface.html#pm-qos-framework">latency tolerance with the PM QoS framework</a>. The latency tolerance is a value in microseconds that expresses how much additional latency due to CPU idling a driver or userspace process can tolerate before their performance is degraded. cpuidle chooses the lowest values among all drivers and processes and prevents the governor from adopting deep idle states if the entry/exit time is too long.<br><br>This is great for modal systems where entering deep idle states is useful for conserving power but it is not appropriate to enter deep idle states in all modes.</p>

## Wrapping up

In this blog we have covered how cpuidle works and also looked at the ways we can tune systems using modern features based on schedutil and the timer-event oriented CPU idle governor.

This has been limited to cpuidle and the hardware that it is built on. There are many other avenues we could explore. For example we haven’t looked at how runtime PM allows us to manage the energy used by peripheral devices. Even having focused on the CPU there’s still plenty we could say on topics like thermal management or SMP load balancing. Load balancing is especially interesting on heterogeneous CPU such as Arm’s pioneering big.LITTLE technology since it provides the chance to conserve power by migrating tasks to more efficient processors.

For now, let’s close by noting that power management tuning is a practical skill that requires embedded Linux developers to understand the requirements and limitations of the workload. We’ve focused on features here rather than hardware. In fact the Arm laptop used for examples wasn’t selected because it’s a great example of an embedded Linux system, it was selected because we knew it was free of any NDAs! Reviewing your own hardware is a great way to augment what you learned here. Combining knowledge about the kernel tools, your workload and your platform puts you in the best position to build systems with state-of-the-art battery life **and** performance.
