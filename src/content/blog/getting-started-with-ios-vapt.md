---
title: Getting Started with Mobile VAPT: iOS Setup Guide
date: 2025-09-18
tags: [iOS, Mobile Security, Tutorial]
excerpt: A walkthrough of the essential tools and methodology for iOS vulnerability assessment and penetration testing.
---

A practical, no-fluff guide to setting up your iOS pentesting environment. Covers jailbreaking with Dopamine, certificate installation, Frida setup, and traffic interception. Also covers what's realistically possible without a jailbreak. Works on Windows, Linux, and macOS.

---

## Table of Contents

**Page 1**
- [Prerequisites](#prerequisites)
- [3uTools](#3utools)
- [Sideloadly](#sideloadly)
- [Enabling Developer Options](#enabling-developer-options)

**Page 2**
- [Jailbreaking with Dopamine](/blog/getting-started-with-ios-vapt/2#jailbreaking-with-dopamine)
- [Refreshing Dopamine](/blog/getting-started-with-ios-vapt/2#refreshing-dopamine)
- [Sileo and Cydia](/blog/getting-started-with-ios-vapt/2#sileo-and-cydia)
- [Jailbreak Limitations on Newer iOS Versions](/blog/getting-started-with-ios-vapt/2#jailbreak-limitations-on-newer-ios-versions)

**Page 3**
- [Essential Packages](/blog/getting-started-with-ios-vapt/3#essential-packages)
- [Installing Frida on the Device](/blog/getting-started-with-ios-vapt/3#installing-frida-on-the-device)
- [Burp CA Certificate Installation](/blog/getting-started-with-ios-vapt/3#burp-ca-certificate-installation)

**Page 4**
- [Traffic Interception and Burp Suite Config](/blog/getting-started-with-ios-vapt/4#traffic-interception-and-burp-suite-config)
- [SSH Access](/blog/getting-started-with-ios-vapt/4#ssh-access)
- [Checklist Before Your First Assessment](/blog/getting-started-with-ios-vapt/4#checklist-before-your-first-assessment)
- [What's Next](/blog/getting-started-with-ios-vapt/4#whats-next)

---

## Prerequisites

These are the tools you'll be installing on your host machine:

| Tool | Purpose |
|:----------------------------------|:--------------------------------------------------------------|
| [Burp Suite (Community/Professional)](https://portswigger.net/burp) | HTTP/S proxy and traffic interception |
| [Frida](https://frida.re/) | Dynamic instrumentation framework |
| [3uTools](http://www.3u.com/) | iOS device management, file transfer, and firmware flashing (Windows) |
| [Sideloadly](https://sideloadly.io/) | Sideload IPAs onto iOS devices without a jailbreak |
| [ipatool](https://github.com/majd/ipatool) | Download IPAs from the App Store |

---

### Installing Frida

Python 3.8+ required on all platforms.

**Windows**

```powershell
pip install frida-tools

# If pip isn't recognized
python -m pip install frida-tools
```

**Linux**

```bash
pip3 install frida-tools

# If you hit permission errors, use a venv
python3 -m venv ~/vapt-env
source ~/vapt-env/bin/activate
pip install frida-tools
```

**macOS**

```bash
pip3 install frida-tools

# Apple Silicon, if you hit architecture errors
arch -x86_64 pip3 install frida-tools
```

---

## 3uTools

[3uTools](http://www.3u.com/) is a Windows-only tool for managing iOS devices. It's useful during VAPT for tasks that would otherwise require iTunes or Finder on macOS.

**What it's used for in VAPT:**

- **Viewing device info** - iOS version, chip model, ECID, UDID, and jailbreak status at a glance. This is the fastest way to confirm whether a device is compatible with a specific jailbreak.
- **Installing IPAs** - drag and drop IPA files onto the device without needing Xcode or a signing identity.
- **File management** - browse the device filesystem, pull files from app sandboxes, and push files to the device.
- **Firmware management** - download and flash specific iOS firmware versions. Useful when you need to downgrade a test device to a jailbreak-compatible version (where SEP compatibility allows).
- **Backup and restore** - take a full backup before jailbreaking so you can restore cleanly if something breaks.

**Installation:**

Download the installer from [3u.com](http://www.3u.com/) and run it. Connect your iOS device via USB. 3uTools will detect the device automatically and display hardware and firmware details on the main screen.

> [!NOTE]
> 3uTools is Windows-only. On macOS, most of these tasks are handled through Finder, Xcode, or command-line tools like `ideviceinfo`. On Linux, use `libimobiledevice` utilities (`sudo apt install libimobiledevice-utils`).

---

## Sideloadly

[Sideloadly](https://sideloadly.io/) lets you sideload IPA files onto a non-jailbroken iOS device using a free or paid Apple Developer account. This is critical for VAPT because it's how you get Dopamine (the jailbreak app) onto the device in the first place, and it's also used for installing modified or decrypted IPAs during testing.

**Installation:**

Download from [sideloadly.io](https://sideloadly.io/) for Windows or macOS. Install and launch. Connect your iOS device via USB.

**Sideloading an IPA:**

1. Connect the device and make sure it's detected in Sideloadly (device name appears in the dropdown).
2. Drag the IPA file into Sideloadly, or click the IPA icon to browse.
3. Enter your Apple ID. If you're using a free account, you're limited to 3 apps sideloaded at a time, and they expire after 7 days.
4. Click **Start**. Sideloadly will sign the IPA with your Apple ID and install it on the device.
5. On the device, go to `Settings > General > VPN & Device Management`, find the profile associated with your Apple ID, and tap **Trust**.

The app will now launch normally. For Dopamine specifically, this is how you get the jailbreak app onto the device before running the exploit.

> [!WARNING]
> Free Apple Developer accounts have a 7-day signing window. After 7 days, sideloaded apps (including Dopamine) will no longer open. You'll need to re-sideload the IPA via Sideloadly. If the device is already jailbroken, you can avoid this by using AppSync Unified or by refreshing Dopamine from the device itself.

---

## Enabling Developer Options

Developer Mode must be enabled on iOS 16+ before you can run sideloaded apps or attach a debugger.

**Steps:**

1. Connect the device to a Mac or Windows machine with Xcode or 3uTools installed. On some iOS versions, the Developer Mode toggle only appears after the device has been connected to a development tool at least once.
2. On the device, go to `Settings > Privacy & Security > Developer Mode`.
3. Toggle **Developer Mode** on.
4. The device will prompt you to restart. Tap **Restart**.
5. After reboot, a confirmation dialog appears. Tap **Turn On** and enter your passcode.

Without Developer Mode enabled, sideloaded apps including Dopamine will refuse to launch with a generic error. If you don't see the Developer Mode option under Privacy & Security, connect the device to Xcode or 3uTools first, then check again.

<!-- page-break -->

## Jailbreaking with Dopamine

[Dopamine](https://github.com/opa334/Dopamine) is a semi-untethered jailbreak for iOS 15.0 through 16.6.1 on A12+ devices (iPhone XS and later). It's rootless by default, meaning system files aren't modified and tweaks are injected through a separate bootstrap. This makes it more stable and harder for apps to detect compared to older rootful jailbreaks.

**Before you start:**

- Confirm your device's iOS version and chip. Dopamine only supports A12+ on iOS 15.0 - 16.6.1. Check in `Settings > General > About`.
- Take a backup via 3uTools or Finder/iTunes.
- Make sure Developer Mode is enabled (iOS 16+).
- Disable your passcode and Find My iPhone temporarily. Re-enable both after jailbreaking. Some exploits fail if these are active during the process.

**Installation steps:**

1. Download the latest Dopamine IPA from the [official GitHub releases page](https://github.com/opa334/Dopamine/releases).
2. Open Sideloadly on your computer. Connect the device via USB.
3. Drag the Dopamine IPA into Sideloadly. Enter your Apple ID and click **Start**.
4. Once installed, go to `Settings > General > VPN & Device Management` on the device. Trust the profile associated with your Apple ID.
5. Open the **Dopamine** app on the device.
6. Tap **Jailbreak**. The device will respring (the screen goes black briefly, then the lock screen returns).
7. After respring, unlock the device. If the jailbreak succeeded, you'll see **Sileo** (the package manager) on your home screen.

If the exploit fails (you get a reboot instead of a respring), open Dopamine and try again. The kernel exploit doesn't succeed every time, it can take 2-5 attempts depending on the device and iOS version. Make sure low power mode is off and close all other apps before retrying.

> [!NOTE]
> Other jailbreaks for reference: [palera1n](https://palera.in/) covers iOS 15.0 - 17.x on A9 - A11 devices (semi-tethered), and [Checkra1n](https://checkra.in/) covers iOS 12.0 - 14.8.1 on A5 - A11 (semi-tethered). Dopamine is the standard choice for modern A12+ devices in the supported iOS range.

---

## Refreshing Dopamine

Dopamine is a semi-untethered jailbreak. This means the jailbreak does not survive a reboot. Every time the device restarts (intentionally or due to a crash/battery death), you lose the jailbreak state: Sileo won't open, tweaks won't load, and Frida won't run.

**To re-jailbreak after a reboot:**

1. Open the **Dopamine** app.
2. Tap **Jailbreak** again.
3. Wait for the respring. Unlock the device.

If Dopamine itself has expired (free Apple ID, 7-day window passed), the app won't open. In that case:

1. Connect the device to your computer.
2. Re-sideload the Dopamine IPA using Sideloadly.
3. Trust the profile again in `Settings > General > VPN & Device Management`.
4. Open Dopamine and tap **Jailbreak**.

To avoid the 7-day expiry cycle, install **AppSync Unified** via Sileo immediately after jailbreaking. With AppSync, you can install IPAs directly without a signing identity, and they won't expire. Some users also use [TrollStore](https://github.com/opa334/TrollStore) where supported, which provides permanent app installation without signing.

> [!WARNING]
> Do not use the "Reset All Settings" or "Erase All Content and Settings" options while jailbroken. These can leave the device in a broken state that requires a full DFU restore. If you need to unjailbreak, use Dopamine's built-in **Remove Jailbreak** option first, then reset if needed.

---

## Sileo and Cydia

After jailbreaking with Dopamine, **Sileo** is installed automatically as the default package manager. Sileo is the modern replacement for Cydia and is the standard on rootless jailbreaks.

**Sileo** is where you install all your VAPT tools on-device: Frida, OpenSSH, SSL Kill Switch, and other tweaks. It works like an app store for jailbreak packages.

**Adding repositories in Sileo:**

1. Open Sileo.
2. Go to the **Sources** tab.
3. Tap **Edit** (top right), then the **+** icon.
4. Enter the repository URL and tap **Add Source**.

Key repos to add:

| Repository | URL | What's in it |
|:---------------------|:----------------------------------------------|:----------------------------------------------|
| Frida | `https://build.frida.re` | Frida server package |
| Havoc | `https://havoc.app` | SSL Kill Switch 3, Liberty Lite, misc tweaks |
| Ellekit (if needed) | `https://ellekit.space` | Tweak injection support |

**Cydia** is the older package manager from the rootful jailbreak era. On Dopamine/rootless setups, Cydia is generally not available and not recommended. Many older Cydia-only packages don't support rootless out of the box. If you encounter a tweak that only lists a Cydia repo, check whether a rootless-compatible fork exists on Havoc or the developer's GitHub before assuming it doesn't work.

If you're working with an older jailbreak (Checkra1n, unc0ver) that uses Cydia, the workflow is similar: go to **Sources**, tap **Edit > Add**, and enter the repo URL. Package installation and removal work the same way.

---

## Jailbreak Limitations on Newer iOS Versions

iOS jailbreaking has become significantly harder on recent versions. Here's the current landscape:

**iOS 17+:** As of writing, there is no public jailbreak for A12+ devices on iOS 17 or later. palera1n supports iOS 17 but only on A9-A11 devices (iPhone X and earlier), which limits you to older hardware. If your test device is an iPhone XS or newer running iOS 17+, jailbreaking is not currently an option.

**iOS 18+:** No public jailbreak exists for any device.

**Why jailbreaks are harder now:**

- **PPL (Page Protection Layer)** and **PAC (Pointer Authentication Codes)** on A12+ make kernel exploitation significantly harder. Even when a vulnerability is found, building a reliable exploit chain requires bypassing multiple mitigations.
- **SSV (Signed System Volume)** prevents modifications to the root filesystem, which is why modern jailbreaks went rootless.
- **Apple's rapid patching cycle** closes exploit windows faster. A vulnerability disclosed today is often patched within weeks, giving jailbreak developers very little time.
- **Lockdown Mode** (iOS 16+) further reduces attack surface and can interfere with some exploitation techniques.

**What this means for VAPT:**

- Keep a dedicated test device on a jailbreak-compatible iOS version (15.x - 16.6.1 for A12+). Do not update it.
- For devices you can't jailbreak, you're limited to network-level interception (for apps without certificate pinning), static IPA analysis, and whatever the client can provide via debug builds.
- Check [theiphonewiki.com](https://theiphonewiki.com/) and the [/r/jailbreak](https://www.reddit.com/r/jailbreak/) community for the latest status on jailbreak development. The landscape changes, but slowly.

<!-- page-break -->

## Essential Packages

Install these via **Sileo** after jailbreaking.

**Core tools:**

- **OpenSSH** - SSH server for remote shell access from your host machine
- **NewTerm** / **a-Shell** - on-device terminal
- **AppSync Unified** - lets you install and sideload unsigned IPAs without signing, and prevents Dopamine from expiring
- **Filza File Manager** - navigate the filesystem visually, inspect app sandbox containers

**Security testing:**

- **Frida** - add the repo `https://build.frida.re` in Sileo and install the Frida package. Make sure the version matches your host frida-tools version.
- **SSL Kill Switch 3** (or SSL Kill Switch 2) - device-wide SSL pinning bypass toggle. Useful for quick checks before writing Frida scripts.

**Optional:**

- **Liberty Lite** / **A-Bypass** - bypass jailbreak detection in apps that refuse to run on jailbroken devices
- **Choicy** - per-app tweak injection control, useful when a tweak causes a specific app to crash

---

## Installing Frida on the Device

With the Frida repo (`https://build.frida.re`) added in Sileo, search for **Frida** and install it. The Frida server runs automatically on the device after installation.

Connect via USB and verify on your host machine:

```bash
frida-ls-devices
# Should list your iOS device by name

frida-ps -U
# Lists all running processes on the connected device
```

Attach to a running app by process name:

```bash
frida -U -n "AppName"
```

Or spawn and attach by bundle ID:

```bash
frida -U -f com.target.bundleid --no-pause
```

> [!WARNING]
> The major version of Frida installed on your host machine must match the version installed on the device via Sileo. If they don't match, Frida will fail to attach. Check with `frida --version` on host and verify the package version in Sileo.

**Common Frida commands for VAPT:**

```bash
# Disable SSL pinning with a Frida script
frida -U -f com.target.bundleid -l ios-ssl-pinning-bypass.js --no-pause

# List running apps with bundle IDs
frida-ps -Ua
```

SSL Kill Switch 3 is also a good fallback for quickly confirming whether traffic is blocked by pinning vs a proxy config issue. Toggle it in Settings and retest.

---

## Burp CA Certificate Installation

iOS requires a two-step process: install the profile, then explicitly enable full trust. Missing the second step is the most common reason traffic still shows certificate errors even after installation.

### Export the Burp CA Certificate

In Burp Suite: `Proxy > Options > Import / export CA certificate`, export as **DER format**, save as `cacert.der`.

### Host the Certificate for Download

Serve it from your host machine:

```bash
# Linux / macOS
python3 -m http.server 8888

# Windows (PowerShell)
python -m http.server 8888
```

Make sure your device and host machine are on the same network.

### Install the Profile on Device

On the iOS device, open **Safari** (Chrome won't work here, Safari is required for profile installation) and navigate to:

```
http://<your-host-ip>:8888/cacert.der
```

iOS will show a prompt: *"This website is trying to download a configuration profile."* Tap **Allow**, then tap **Close**.

Go to `Settings > General > VPN & Device Management`. The downloaded profile will be listed under "Downloaded Profile". Tap it, tap **Install**, enter your passcode, and tap **Install** again on the warning screen.

### Enable Full Trust

This step is mandatory and often missed. The certificate is installed but iOS does not trust it for SSL/TLS until you explicitly enable it.

Go to `Settings > General > About > Certificate Trust Settings`. You'll see the **PortSwigger CA** listed under "Enable Full Trust For Root Certificates". Toggle it **on**. Confirm when prompted.

Without this step, HTTPS traffic will still fail with certificate errors in Burp even though the profile is installed. This is the single most common setup issue.

After enabling full trust, traffic from apps that don't implement additional certificate pinning should now route through Burp cleanly.

<!-- page-break -->

## Traffic Interception and Burp Suite Config

### Proxy Configuration

Connect your iOS device and host machine to the same WiFi network. Configure the proxy on the device to point to your host machine's IP and Burp's port.

Finding your host IP:

| OS | Command |
|:-----------|:-------------------------------|
| Windows | `ipconfig` (look for IPv4 Address under your active adapter) |
| Linux | `ip a` or `hostname -I` |
| macOS | `ipconfig getifaddr en0` (Wi-Fi) or `en1` (Ethernet) |

On the iOS device: `Settings > Wi-Fi > tap the connected network > Configure Proxy > Manual`. Enter your host IP and port `8080`.

### Burp Listener Setup

Go to `Proxy > Options > Proxy Listeners`, set binding to `All interfaces` on port `8080`.

**Firewall rules**

On **Windows**, Firewall will prompt you to allow access the first time Burp binds to `0.0.0.0:8080`. Allow it for private networks. If you missed that prompt, add the rule manually:

```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Burp Suite 8080" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

On **Linux**, if ufw is running:

```bash
sudo ufw allow 8080/tcp
```

On **macOS**, the firewall generally won't block this. If you have the application firewall on under `System Settings > Network > Firewall`, make sure Burp Suite is listed as allowed.

---

## SSH Access

OpenSSH installed via Sileo starts an SSH server on the device. Connect from your host:

```bash
ssh root@<device-ip>
# Default password after jailbreak: alpine
```

**Change the default password immediately:**

```bash
passwd
```

Leaving `alpine` as the password is a real risk on shared or lab networks.

Useful SSH tasks during testing:

```bash
# Pull the app's Documents sandbox to your machine
scp -r root@<device-ip>:/var/mobile/Containers/Data/Application/<UUID>/Documents/ ./app_data/

# Stream device logs
idevicesyslog
```

To find the app container UUID:

```bash
# On-device via SSH
find /var/containers/Bundle/Application -name "*.app" | grep AppName
```

Or browse it visually using Filza on the device.

---

## Checklist Before Your First Assessment

- [ ] Device jailbroken and stable (Sileo visible on home screen, tweaks loading)
- [ ] Dopamine refreshed after any reboots
- [ ] Developer Mode enabled (iOS 16+)
- [ ] Frida installed via Sileo and version matches host (`frida --version`)
- [ ] `frida-ls-devices` lists the iOS device
- [ ] Burp CA profile installed AND full trust enabled in Certificate Trust Settings
- [ ] SSH access working and default password changed from `alpine`
- [ ] SSL Kill Switch 3 installed and toggling correctly
- [ ] Proxy configured on device pointing to Burp on port 8080
- [ ] Host firewall allows inbound on 8080 (Windows / Linux with ufw)
- [ ] Traffic from a non-pinned app is visible in Burp
- [ ] AppSync Unified installed to prevent sideloaded app expiry
- [ ] Written authorization obtained and scope reviewed
- [ ] Clean backup of device state taken

---

## What's Next

Core iOS VAPT areas to cover once the environment is ready:

- **Insecure data storage** - NSUserDefaults, CoreData, Keychain misuse, unencrypted SQLite, plist files
- **Improper authentication** - token handling, biometric bypass, session management gaps
- **Network communication** - certificate validation gaps, cleartext traffic, sensitive headers
- **URL scheme abuse** - improperly validated deep links allowing parameter injection or unauthorized state changes
- **WebView attacks** - JS injection, file access misconfig, sensitive data in webview caches
- **Keychain analysis** - items stored with overly permissive `kSecAttrAccessible` values
- **Pasteboard leaks** - sensitive data copied to `UIPasteboard.general`, accessible system-wide
- **Binary protections** - jailbreak detection quality, anti-debug, obfuscation, PIE and stack canary presence

[OWASP MASTG](https://mas.owasp.org/MASTG/) and [OWASP MASVS](https://mas.owasp.org/MASVS/) are the go-to references for structuring test cases. Running through MASVS-L1 and L2 checklists on every engagement keeps things consistent.

---

*Written based on real-world iOS VAPT experience. IP Addresses and Port Numbers (e.g., 8080) used in these examples are for demonstration. Ensure you update them to match your specific project configuration and environment.*
