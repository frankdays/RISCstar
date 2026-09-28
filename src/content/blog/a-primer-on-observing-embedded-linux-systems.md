---
title: "A Primer on Observing Embedded Linux Systems"
date: "2025-06-16T12:00:00+00:00"
modified: "2025-06-16T13:51:49+00:00"
author: "Erik Wierich"
authorSlug: "erik-schilling"
authorBio: "Embedded Linux Security Engineer at RISCstar Solutions.  \nErik specialises in embedded Linux security, systemd tooling, and open source software development for Arm and RISC-V platforms."
categories: ["performance"]
image: "/wp-content/uploads/2025/04/14.png"
imageWidth: 360
imageHeight: 300
seoTitle: "A Primer on Observing Embedded Linux Systems - RISCstar"
excerpt: "Every embedded Linux system eventually needs data showing the system behavior in order to make informed decisions. This might include detailed tracing of a particular problem, reasoning about system performance, or long-term data collection of metrics to identify regressions in software"
classic: true
legacyStyles: ["/wp-includes/css/dist/block-library/style.min.css"]
---

**Tracing Linux: An Overview**

Every embedded Linux system eventually needs data showing the system behavior in order to make informed decisions. This might include detailed tracing of a particular problem, reasoning about system performance, or long-term data collection of metrics to identify regressions in software. All of this requires observing what the software on the system is doing.

When working on such projects, I frequently find myself struggling to find good high-level articles on observability concepts. There is a lot of material out there that covers individual aspects in great detail. But if you are new to tracing and debugging this results in the topic seeming more complex than it really is.

<p><img class="alignnone size-large wp-image-5009" src="/wp-content/uploads/2025/06/mindmap-1024x521.png" alt="A mind map that breaks down Embedded Linux Observability into sub-branches. Under the root note we have: counters, events, boundaries and sampling. Those then break down into another level of detail." width="640" height="326"></p>

Every embedded Linux system eventually needs data showing the system behavior in order to make informed decisions. This might include detailed tracing of a particular problem, reasoning about system performance, or long-term data collection of metrics to identify regressions in software. All of this requires observing what the software on the system is doing.

When working on such projects, I frequently find myself struggling to find good high-level articles on observability concepts. There is a lot of material out there that covers individual aspects in great detail. But if you are new to tracing and debugging this results in the topic seeming more complex than it really is.

In contrast, this article attempts to be a deliberately high-level introduction that focuses more on the concepts than the individual tools. Embedded Linux projects often need specialized analysis tooling to reason about the domain that they are deployed in. After knowing the concepts, one will find that learning the tools is a lot easier, and the activity seems less like magic. In fact, one will be able to more easily decide which tool is suitable for which task—or realize that multiple tools might be the right choice. For deeper diving I am providing references to more detailed resources.

Using the wrong approach on a problem leads to poor decisions and a frustrating experience. Creating observability can certainly be hard at times… But let’s walk before we run and cover the concepts.

### **printf-based debugging**

Just logging out some value is of course a pretty effective mechanism to reason about system behavior.

I won’t cover it in detail here.

It is obvious that having logs around for failures is important! But one won’t be able to log high frequency events over interfaces potentially being as slow as a serial port. Other mechanisms are more useful for that.

### **Counters**

Simply incrementing a counter can be one of the most efficient ways to provide valuable diagnostic data on high frequency events. The kernel uses this mechanism all over the place:

-   /proc/stat
-   /proc/interrupts
-   /proc/net/dev
-   /proc/swaps

Any telemetry solution will also support them in one way or another for user-space applications.

Since the counter itself carries only a single value, an outside process will have to sample and log the value along with the current timestamp. These sampled snapshots can then show the increment rate—usually in the form of a plot against time.

[Perfetto](https://perfetto.dev/) allows capturing a range of interesting counters, [collectd](https://www.collectd.org/) is also heavily based on counters.

### **System Boundaries**

As software engineers we tend to try to lock components into imaginary boxes. Then we stack these and assert that only a fairly limited interface is allowed for crossing the boundary of one box into another. Naturally these interactions between boxes usually are a valuable source of information when reasoning about system behavior.

The most prominent system boundary that is common across all Linux systems is the user-space to kernel boundary. Here, the kernel explicitly provides interfaces to observe this boundary. A user will likely do this through tools like [strace](https://strace.io/). Similar tools exist for other boundaries: [ltrace](https://www.ltrace.org/) helps with tracing library calls, [wireshark](https://www.wireshark.org/) or [tcpdump](https://www.tcpdump.org/) for observing network traffic. In an embedded project lower-level protocols such as CAN, I2C, or SPI also are a system boundaries. Whenever there is a well-defined boundary, it probably makes sense to research whether there is a tracing tool for it.

### **Stop-The-World Debugging**

Standard debuggers like [gdb](https://sourceware.org/gdb/), [lldb](https://lldb.llvm.org/), [pdb](https://docs.python.org/3/library/pdb.html), [jdb](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jdb.html), … are probably the most frequently used tools to debug application behavior. Everyone uses them so I do not feel the need to discuss them in more detail here. You place a breakpoint or break on a deadly signal and extract information on demand while the world is frozen.

### **Defined Events**

Instead of breakpoints, one can also embed well-defined events into the software. In the kernel you would find them under the name “trace points”. In user-space one flavor of them is Userland Statically Defined Tracing (USDT). Other tracing frameworks have their own implementations and names. The implementations may vary from NOP instructions getting patched to jumps at runtime or bitfield guards that allow toggling the individual events.

As the metadata is embedded into the compilation unit, events can be discovered dynamically and are stable across different builds of the same software. They basically serve as a more efficient and more machine-friendly variant of logging.

[FTRACE](https://www.kernel.org/doc/html/latest/trace/ftrace.html) (for kernel events), [lttng-ust](https://lttng.org/man/3/lttng-ust/) (for user-space events), perfetto (both) and [bpftrace](https://bpftrace.org/) (both)

### **Dynamic Probes**

If you lack a statically defined event, you can dynamically define one. Think of it as a breakpoint that does not stop the world. Uprobes and Kprobes, for example, allow you to trace execution of a particular code line without much noticeable delay of the execution.

Still, probes usually require consulting debug information of a binary in order to figure out a particular location to attach to. But as they also do not need any preparation within the program code, they can be a powerful tool to retro-fit some observability to an already compiled application. Attaching in the middle of a function can be especially powerful. Just be aware that even minor tweaks or recompilation of the software might need a re-evaluation of the probe location.

Tools that can use such probes without needing to stop the world are [perf](https://perfwiki.github.io/main/) or bpftrace. FTRACE also works, though its uprobe support requires some care to use correctly.

### **Sampling System Events**

If we are not exactly sure what kind of problem we are dealing with, often we lack an idea on which detailed action we can point our observability tools at.

In that case taking broad, system-wide samples of what is actually happening on a CPU can be helpful. The most typical approach is to sample stacktraces of tasks that happen to be running on the CPU at regular intervals. For this we briefly halt each CPU at regular intervals, the current stacktrace is saved and the CPU is released again.

The collected samples then give us a relative measure on how frequently we find a CPU to be busy in a particular code section. Some care has to be taken with interpreting the results as CPU frequency changes may skew the results a bit. Sampling by cpu cycles can help in those situations.

Sampling can also be a very efficient way of observing a system. As we can tweak the sampling period we can control the trade-off between overhead and granularity of the data. This is absolutely necessary for high-frequency events such as cpu cycles or cache misses. Here, the cpu hardware can help with doing efficient sampling by allowing us to set timers or events on performance counters.

Typical tools in this domain are: perf (abstracting over performance-monitoring-unit events), bpftrace, [CoreSight](https://docs.kernel.org/trace/coresight/index.html) (Arm-specific)

### **Off-Cpu Tracing**

All mechanisms described above are probing into behavior where active work is happening. But sometimes the problem is that nothing happens. A process may appear hanging or responding more slowly than expected.

Diagnosing that with just the tools above can often be surprisingly hard. A neat little tool to inform about this are off-cpu traces.

It may be slightly confusing at first, but the idea is to trace the period of time where a task cannot make progress. More concretely, we capture the stacktrace of a task when it is scheduled off a CPU due to becoming non-runnable. Then, we measure the time until it is schedulable again. Common ways to analyze the date is simply to capture all occurrences that exceed a certain threshold, or tallying up the results per code location.

This will allow us to get details on why a particular task is not making progress. If we see it moving off the CPU for longer periods of time as part of an I/O code path, we can assume that we are likely waiting for that I/O request to finish. Similarly, mutex related code paths can reveal lock contention. We will also see if we are waiting for external events – likely by observing long time spent off the cpu after polling file descriptors.

Due to the need to hook into fairly high-frequency scheduler events, one typically wants to perform off-cpu tracing with BPF-based tooling and in-kernel aggregation. Though perf can also export the info (albeit at higher overhead).

## Conclusion

<p><img class="alignnone size-large wp-image-5007" src="/wp-content/uploads/2025/06/Pasted-image-2-1024x1024.png" alt="A 4-quadrant visualization of the observability concepts that are presented in this article. It breaks down the concepts by performance overhead (low on the left, to high on the right) and signal stability (one-off analysis on the left, long term tracking on the right). The concepts are distributed from stop-the-world in the far high-overhead, extreme one-off analysis corner to counters in the low-overhead, long term tracking corner. The dots do not represent particularly exact positions but mostly serve illustrative purposes." width="640" height="640"></p>

This turned out to be a fairly fast-paced blog post. Still, I consider covering the concepts more important than the detailed usage of an individual tool. Tracing embedded system behavior already has many pitfalls. Trying to apply the various tools without knowing what they are good for seldom yields a rewarding experience. Observing a real-world problem will likely require a combination of tools—usually cobbled together with a bunch of scripting.
