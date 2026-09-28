---
title: "Power management on embedded Linux systems: Dynamic Voltage and Frequency Scaling"
date: "2025-06-09T20:23:43+00:00"
modified: "2025-06-09T21:28:53+00:00"
author: "Daniel Thompson"
authorSlug: "daniel"
categories: ["power-management"]
image: "/wp-content/uploads/2025/04/17.png"
imageWidth: 360
imageHeight: 300
seoTitle: "Power management on embedded Linux systems: Dynamic Voltage and Frequency Scaling - RISCstar"
description: "Learn how Dynamic Voltage and Frequency Scaling (DVFS) can extend battery life by 3x in embedded Linux systems. Expert implementation strategies from RISCstar"
excerpt: "Learn how Dynamic Voltage and Frequency Scaling (DVFS) can extend battery life by 3x in embedded Linux systems. Expert implementation strategies from RISCstar."
legacyStyles: ["/wp-content/uploads/elementor/css/post-2414.css"]
---

This is part two of our [Power management on embedded Linux systems](/blog/power-management-on-embedded-linux-systems/) blog series. It explores Dynamic Voltage and Frequency Scaling (DVFS).

## **What is Dynamic Voltage and Frequency Scaling?**

DVFS is the tool we have to manage power consumption when we are operating in the active states.

DVFS is a form of performance scaling that allows us to select between high-performance/high-power and lower-performance with more efficient power states. As the name suggests, it is not enough to simply select the frequency of a CPU; when we change frequency, we are also forced to dynamically scale the voltage to ensure the CPU can run correctly at the selected frequency. At their highest frequencies, CPUs need to run at high voltages to make sure all those electrons get to where they are needed before the next clock edge. At lower frequencies, however, we can use a lower voltage, thereby reducing power consumption.

## **Operating Performance Points (OPPs) Explained**

DVFS systems typically offer a variety of “operating points” (sometimes called Operating Performance Points or OPPs), meaning the combination of supply voltage and clock frequency that work together safely and efficiently.

There are [equations you could look up](https://en.wikipedia.org/wiki/Processor_power_dissipation#Sources) that approximately model how power is affected by changing the voltage and frequency. However, we can also simply look at a graph of real-world data. Once again, I have gathered information from my laptop, which shows the power draw from the battery (vertical axis, in watts) versus the clock frequency (horizontal axis, in MHz).

<p><img class="aligncenter size-full wp-image-4926" src="/wp-content/uploads/2025/04/Dynamic-Voltage-and-Frequency-Scaling.png" alt="DVFS power consumption graph showing non-linear relationship between CPU frequency and power usage" width="718" height="398"></p>

The power consumption includes all load on the battery. In addition to the CPU load, there are plenty of fixed loads such as the LCD backlight and DRAM refresh. This gives us an unusually high base load of around four or five watts, plus whatever the CPUs are consuming.

Based on the above figures, we can estimate that the battery will last three times longer under light loads, such as media playback, compared to heavy compute-intensive loads. The effect of compute-intensive activities can be even more pronounced on embedded devices since they typically have much lower base loads.

## DVFS and embedded system power efficiency

For battery-powered systems, power-efficient use of the CPU means getting it to do the most calculations possible before the battery runs out (and for equipment plugged it means lower electricity usage). The chosen OPP has a profound effect on power efficiency. As you can see on the graph, power consumption has a non-linear relationship with frequency, mostly due to the effects of voltage scaling. Doubling the frequency will more than double the power usage of the CPU. In contrast, performance will scale more or less linearly with frequency. Knowing this can help you read the graph above and reason about embedded system power efficiency.

One especially interesting comparison is the difference between running the CPU at 80% of its capacity (2.4GHz) versus 100% of its capacity (~3GHz). The power consumed rockets from 10 watts to 17 watts. That means my 50-Watt-Hour battery will survive five hours at 80% but less than three hours at 100%. If you play with the maths, that translates to being able to do 33% more calculations (or compile 33% more code) before the battery dies when operating at 80% capacity. Of course, we have to accept it will take longer to give us the answer in exchange for that.

Thus, DVFS allows us to make a choice: should we minimize the time until we complete our calculations, or should we minimize the energy cost of doing the calculations to allow the battery to last longer? Sadly, DVFS doesn’t help us make the choice, but it does give us the flexibility to choose the best operating point for the circumstances.

We’ll talk about how the kernel selects the operating point in our next article.

## Master DVFS for Maximum Battery Life

Understanding Dynamic Voltage and Frequency Scaling is crucial for optimizing your embedded system’s power efficiency. The right implementation can extend battery life by 3x or more while maintaining performance where it matters.

[Talk with a RISCstar Power Management Expert](/talk-with-our-experts/)

Our engineers can help you implement optimal DVFS strategies tailored to your Arm or RISC-V platform’s specific needs and use cases.

<p>&nbsp;</p>
