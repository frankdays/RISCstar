---
title: "The Essentials of Board Bring-Up: Hardware and Software Integration"
date: "2025-05-19T14:00:54+00:00"
modified: "2025-05-21T14:26:36+00:00"
author: "Alex Elder"
authorSlug: "alex"
categories: ["arm", "linux-kernel", "performance", "risc-v", "security"]
image: "/wp-content/uploads/2025/03/11-1.png"
imageWidth: 360
imageHeight: 300
seoTitle: "The Essentials of Board Bring-Up: Hardware and Software Integration - RISCstar"
description: "New hardware designs must go through an initial “bring-up” process to ensure it functions as intended"
excerpt: "New hardware designs must go through an initial “bring-up” process to ensure it functions as intended"
legacyStyles: ["/wp-content/uploads/elementor/css/post-4233.css"]
---

Any new hardware design must go through an initial “bring-up” process, which involves ensuring that a physical, implemented design functions as intended. For a simple circuit board, this involves spot-checking voltage levels, logic levels, and signals. For more complex designs (such as a computer system or mobile phone), a single implementation is not sufficient to ensure the hardware works correctly. Prototypes are built so that portions of a complete design can be tested in isolation, and the first *full* implementation facilitates testing by exposing test points that provide access to signals that will not be accessible in the final product. Subsequent versions move the implementation closer to the final product, with the final version implementing the product’s “form factor”.

Complex designs also incorporate firmware and software in their functionality. And while hardware designers must always perform their testing (checking the circuitry), “software” bring-up is a process that builds upon that. The goal of software bring-up is to get an operating system running on the new hardware, and this requires ensuring that the software and hardware interact with each other correctly. If they do not, the cause can be found in either the hardware, the software, or both. This stage of bring-up therefore involves both hardware and software engineers, and each needs to have skills that span both disciplines.

Bring-up is an important milestone in the lifetime of a product. If done well, it provides a good foundation for further development. This article provides a high-level overview about the bring-up process for a “complex” development board that includes software, ultimately running the Linux kernel. My background is in software, so the following is presented from that perspective.

**What is Board Bring-Up?**

Board bring-up is often an event, scheduled to occur when a development board has passed basic hardware validation tests. It is held in a lab environment, where both hardware engineers and test equipment are available. The number of devices available for testing will be relatively small.

While hardware engineers focus on the electronic-level functionality of the development board, software engineers view the system as being broken down into logical subsystems, and bring-up involves testing that each of the subsystems works properly both in isolation and together. Some software functionality is built upon lower-level subsystems and can be checked later (after the bring-up event) without the need for any special equipment.

As each subsystem is tested, any improper behavior is noted, diagnosed, and resolved. In some cases “rework” of the hardware is required on the development board to make it work correctly (this might include changing or removing components, adding wires, and so on). Any such rework will eventually be applied to all available boards, and the design for the next iteration will incorporate such changes. Such hardware modifications could impact schedule or overall cost, but identifying issues early (during bring-up) minimizes such effects. In other cases, testing software (or firmware) on “real” hardware shows that software changes must be made for correct operation. Such changes are implemented, and once tested they are incorporated into the official source code. Problems identified during bring-up can require software and/or hardware fixes. Close collaboration and communication between hardware and software engineers is vital to finding, diagnosing, and correctly fixing issues discovered during bring-up. 

**Understanding the Role of Firmware and Software**

One of the first challenges is getting program code into memory, where it must reside to be executed. When a processor is first powered on, it executes code located in read-only memory (ROM), whose first job is to perform primitive initialization of the processor. Beyond that, the boot ROM provides the ability to load other software from an available medium into random access memory (RAM). The medium used can vary; a very simple medium is a serial port, which can function correctly with a small amount of code. Flash memory can also be used, and it can be removable (allowing its content to be initialized separately from the system being brought up). Many systems also provide a debug (JTAG) interface that allows arbitrary data to be written into memory. 

**Software Bring-Up: Loading the Bootloader**

The first code to be loaded is often a bootloader, such as [Das U-Boot](https://source.denx.de/u-boot/u-boot) or the [TrustedFirmware-A BL components](https://trustedfirmware-a.readthedocs.io/en/latest/design/firmware-design.html#cold-boot). A bootloader provides a low-level framework for basic software initialization and is designed to work with hardware very early after power-on. The bootloader incorporates code that can be used for testing and validating the hardware and is used to load and launch the Linux kernel. These can both be modified and reloaded as necessary to help fix problems if the software and hardware aren’t working as expected.

Once a bootloader and Linux can be loaded and executed, the focus turns to testing individual subsystems that the system implements. Modern SoCs typically require fundamental configuration of certain options (such as pin functions) and depend on clock and power controller hardware. These might be partially initialized by the boot ROM, but they might require additional configuration by the bootloader and Linux to allow certain subsystems to be tested. Subsystems, including simple buses (like I2C and SPI) and more complex ones (like USB and PCIe) will be tested to be operating correctly as well.

In the end, *all* of these basic subsystems need to be brought up individually, and tested to confirm they work as expected. “As expected” is partially defined by standards (i.e., an I2C bus has well-defined behavior), but much is design-specific. For hardware, it is essential to have documentation of the design, including schematic diagrams, board layout, and technical reference manuals. Similar documentation is required for software, defining memory maps, storage organization, boot sequence, and ways in which software is meant to interact with the hardware. Bring-up requires a broad understanding of hardware and software, and the exact testing required depends on the subsystem.

**Successful Board Bring-Up: Collaboration And Planning**

The bring-up of a board involves the collaboration of a focused group of hardware and software engineers whose joint goals are to identify and resolve any hardware issues and to allow further software development to be done on the board without the need for special equipment.

A successful bring-up activity depends very heavily on planning and preparedness. The set of components and subsystems that will be tested, and the order in which they are examined, is a fundamental part of the plan. For each of these, the software and hardware tools needed to perform testing should be identified and understood in advance. Being familiar with the test tools and processes will ensure engineers can quickly recognize incorrect behavior. The test plan should indicate what is sufficient to demonstrate correct behavior.

It can be difficult to predict the time required to bring up a board. Some issues can be especially tricky to understand, and these might take a long time to resolve. Occasionally an issue cannot be resolved during bring-up–for example, a hardware problem might require some redesign (not just rework). Experience can help with deciding how much time to allot. But this time should be used wisely, to ensure the result of the bring-up activity is a well-tested, functioning device, along with a good understanding of what needs to be fixed before the next iteration of the board. Again, collaboration and planning are both very important for a successful bring-up.

**Conclusion: How to Ensure a Successful Bring-Up Process**

Bringing a new board to market involves multiple iterations of validation hardware. The bring-up for each hardware iteration begins with hardware engineers verifying the board behaves in the way intended by its electronic design. Software engineers build on this by testing code on the hardware, and modifying it if needed to ensure it interacts correctly with it. As issues are found, they are investigated, and eventually, each is resolved using a mix of software changes and hardware rework. Detailed plans (made prior to bring-up) will identify all of the components and subsystems to be tested, and what tests are sufficient to confirm correct operation. Software and hardware engineers involved must have skills that span hardware and software and should know how to use available tools effectively. When bring-up is complete, a board will be functional enough to be used for further development and testing without requiring any special equipment.

**Ready for a Successful Board Bring-Up?**

Don’t let technical challenges delay your product timeline. RISCstar’s expert engineers specialize in seamless hardware bring-up for Arm and RISC-V platforms.

[**Talk with a RISCstar Expert Today**](/talk-with-our-experts/)

Our open source rock stars can help you navigate the complexities of board bring-up while maximizing performance, optimizing power, and strengthening security.
