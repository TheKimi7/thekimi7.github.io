---
title: Getting Started with Mobile VAPT: Android Setup Guide
date: 2025-07-21
tags: [Android, Mobile Security, Tutorial]
excerpt: A walkthrough of the essential tools and methodology for Android vulnerability assessment and penetration testing.
---

A practical, no-fluff guide to setting up your Android pentesting environment. Covers rooting a device/emulator, pushing Frida server, installing Burp CA, and setting up traffic interception. Works on Windows, Linux, and macOS.

---

## Table of Contents

**Page 1**
- [Prerequisites](#prerequisites)

**Page 2**
- [Rooted Physical Device (Magisk)](/blog/getting-started-with-android-vapt/2#rooted-physical-device-magisk)
- [Certificate Injection (Android 7+)](/blog/getting-started-with-android-vapt/2#certificate-injection-android-7)
- [Certificate Injection using TrustMeDarling](/blog/getting-started-with-android-vapt/2#certificate-injection-using-trustmedarling)

**Page 3**
- [Rooted Emulator (No Play Store)](/blog/getting-started-with-android-vapt/3#rooted-emulator-no-play-store)
- [Installing Frida Server on the Rooted Device/Emulator](/blog/getting-started-with-android-vapt/3#installing-frida-server-on-the-rooted-deviceemulator)

**Page 4**
- [Traffic Interception and Burp Suite Config](/blog/getting-started-with-android-vapt/4#traffic-interception-and-burp-suite-config)
- [Checklist Before Your First Assessment](/blog/getting-started-with-android-vapt/4#checklist-before-your-first-assessment)
- [What's Next](/blog/getting-started-with-android-vapt/4#whats-next)

---

## Prerequisites

These are the tools you'll be installing on your host machine:

| Tool | Purpose |
|:----------------------------------|:--------------------------------------------------------------|
| [Burp Suite (Community/Professional)](https://portswigger.net/burp) | HTTP/S proxy and traffic interception |
| [ADB (Android Debug Bridge)](https://developer.android.com/studio/command-line/adb) | Device communication and shell access |
| [Frida](https://frida.re/) | Dynamic instrumentation framework |
| [Android Studio](https://developer.android.com/studio) | AVD Manager for emulator setup |
| [OpenSSL](https://www.openssl.org/) | SSL/TLS toolkit for certificate conversion |

### Installing ADB

**Windows**

Download the [SDK Platform Tools ZIP](https://developer.android.com/studio/releases/platform-tools), extract it to somewhere like `C:\platform-tools`, and add it to your PATH:

```powershell
# Run as Administrator
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\platform-tools", "Machine")
```

Or just use winget:

```powershell
winget install Google.PlatformTools
```

**Linux**

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install adb

# Arch
sudo pacman -S android-tools

# Or download directly
wget https://dl.google.com/android/repository/platform-tools-latest-linux.zip
unzip platform-tools-latest-linux.zip
echo 'export PATH=$PATH:~/platform-tools' >> ~/.bashrc && source ~/.bashrc
```

**macOS**

```bash
brew install android-platform-tools
```

### Installing OpenSSL

OpenSSL is already on Linux and macOS. Windows doesn't include it by default, so you need to install it separately.

**Windows**

Download from [slproweb.com](https://slproweb.com/products/Win32OpenSSL.html) and use the full installer, not the Light version. Then add it to your PATH:

```powershell
# Run as Administrator, adjust the path if you changed the install location
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\OpenSSL-Win64\bin", "Machine")
```

Or via winget:

```powershell
winget install ShiningLight.OpenSSL
```

Verify:

```powershell
openssl version
```

**Linux / macOS**

```bash
openssl version
```

If it's missing on macOS:

```bash
brew install openssl
echo 'export PATH="/opt/homebrew/opt/openssl/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

### Installing Frida and objection

Python 3.8+ required on all platforms.

**Windows**

```powershell
pip install frida-tools objection

# If pip isn't recognized
python -m pip install frida-tools objection
```

**Linux**

```bash
pip3 install frida-tools objection

# If you hit permission errors, use a venv
python3 -m venv ~/vapt-env
source ~/vapt-env/bin/activate
pip install frida-tools objection
```

**macOS**

```bash
pip3 install frida-tools objection

# Apple Silicon, if you hit architecture errors
arch -x86_64 pip3 install frida-tools
```

<!-- page-break -->

## Rooted Physical Device (Magisk)

Magisk roots the device without touching the system partition. It uses a systemless overlay, so modules like Shamiko and TrustMeDarling stack on top without conflicting with each other. This is what you want for VAPT since you need root, pinning bypass, and Play Integrity bypass all running at the same time. 
> You can find a lot of tutorials available online to root your device using Magisk. This is not included here for the purpose of keeping this guide concise.

**Minimum setup:**
- Android 10+ device (14+ recommended)
- Magisk v26+
- USB debugging on: `Settings > Developer Options > USB Debugging`
- Unlocked Bootloader: Generally `Settings > Developer Options > OEM Unlocking` but depends on the manufacturer.
- ADB authorized on your host machine
> Certain manufacturers like Xiaomi require an external tool to unlock the bootloader. Please refer to the manufacturer's website for more information.

**Essential Magisk Modules:**

- **LSPosed** (Zygisk) - Xposed framework for hook-based modifications
- **Shamiko** - root hiding for apps that check Play Integrity / SafetyNet
- **TrustMeDarling** - system-level CA certificate injection (covered below)

### USB Driver Setup (Windows only)

Linux and macOS detect Android devices over USB automatically. On Windows you need the right USB driver for your device. Install it from Android Studio's SDK Manager under `SDK Tools > Google USB Driver`, or grab the OEM driver from your device manufacturer's support page directly.

If the device still doesn't show up, open Device Manager, look for an unrecognized device under USB, right-click it, and manually point the driver update to the downloaded OEM package.

### Verify the Setup

```bash
adb devices
# Expected: <serial>   device

adb shell whoami
# Expected: shell

adb shell su -c whoami
# Expected: root
```

If the last command hangs or gets denied, Magisk hasn't granted ADB shell superuser access yet. Open the Magisk app and approve the request from the ADB shell entry in the superuser tab.

---

## Certificate Injection (Android 7+)

Android 7+ only trusts system store certificates by default. User-installed CAs are ignored for app traffic. So, from Android 7+ up until Android 13, you could write directly to `/system/etc/security/cacerts/`. On Android 14+, this got harder since writing directly to `/system/etc/security/cacerts/` no longer works cleanly due to tighter mount restrictions. Refer to [Certificate Injection using TrustMeDarling](/blog/getting-started-with-android-vapt/2#certificate-injection-using-trustmedarling) for a more detailed explanation.

### Export the Burp CA Certificate

In Burp Suite: `Proxy > Options > Import / export CA certificate`, export as **DER format**, save as `cacert.der`.

Convert to PEM (same command on all platforms, just make sure OpenSSL is in your PATH):

```bash
openssl x509 -inform DER -in cacert.der -out burp_cacert.pem
```

### Get the Certificate Hash

Android names system store certs using an OpenSSL subject hash. Generate it:

**Linux / macOS**
```bash
openssl x509 -inform PEM -subject_hash_old -in burp_cacert.pem | head -1
# Example: 9a5ba575
```

**Windows (PowerShell)**
```powershell
openssl x509 -inform PEM -subject_hash_old -in burp_cacert.pem
# The hash is the first line, ignore the cert text below it
```

Rename the file using that hash. The `.0` suffix is mandatory:

**Linux / macOS**
```bash
mv burp_cacert.pem <hash-value/>.0
```

**Windows (PowerShell)**
```powershell
Rename-Item burp_cacert.pem <hash-value/>.0
```

> [!NOTE]
> If you're on Windows and find yourself constantly running into `grep`, `head`, and `mv` not being available in PowerShell, install [Git for Windows](https://git-scm.com/download/win) and use Git Bash instead. It bundles all the Unix utilities you'll need throughout a typical Android VAPT.

### Push the CA Certificate to the Device

```bash
adb push <hash-value/>.0 /sdcard
adb shell su -c "cp /sdcard/<hash-value/>.0 /system/etc/security/cacerts/"
adb shell su -c "chmod 644 /system/etc/security/cacerts/<hash-value/>.0"
adb shell su -c "chown root:root /system/etc/security/cacerts/<hash-value/>.0"

```

These ADB commands are the same on all platforms since they run on the device side.

**Reboot the device.**

### Verify Injection

```bash
adb shell su -c "ls -l /system/etc/security/cacerts/ | grep <hash-value/>"
# Expected permissions: -rw-r--r-- 1 root root <size> <date> <hash-value/>.0
```
This ADB command are the same on all platforms since they run on the device side.

You can also verify on-device at `Settings > Security > Encryption & credentials > Trusted credentials > System`. Your Burp CA should show up there.

## Certificate Injection using TrustMeDarling

On Android 14+, pushing a certificate directly to `/system/etc/security/cacerts/` no longer works due to the android system now storing the certificates in `/apex/com.android.conscrypt/cacerts/` and it is a read-only partition which refreshes everytime a reboot occurs. TrustMeDarling handles this by injecting your proxy CA into the system trust store via Magisk's overlay. No system partition writes, no bootloop risk. It also survives OTA updates as long as you re-flash Magisk afterward.

> [!NOTE]
> TrustMeDarling is an open-source Magisk module built specifically for this problem. Find it on [GitHub](https://github.com/TheKimi7/TrustMeDarling).


This is a pretty straight forward approach as it automates the process of injecting the CA certificate into the system trust store. You just need to download the zip file and install it as a Magisk module. Follow the steps below:

1. Download the latest `TrustMeDarling.zip` from the [releases](https://github.com/TheKimi7/TrustMeDarling/releases) page.
2. Open the Magisk app and go to `Modules > Install from storage`, select the zip.
3. Push your .der file via ADB to `/sdcard` after installation.

```bash
adb push cacert.der /sdcard
```
4. Go to `Settings > Security > Encryption & credentials > Install a certificate > CA certificate` and select the .der file.
5. Reboot the device.
6. Verify the injection by going to `Settings > Security > Encryption & credentials > Trusted credentials > System`. Your Burp CA should show up there as `PortSwigger CA`.

<!-- page-break -->

## Rooted Emulator (No Play Store)

Emulators are faster to reset and snapshot than physical devices. The only rule: use a **Google APIs** or **AOSP** image, never a **Google Play** image. Play Store images are production-signed and block `adb root`.

### Setting up AVD via Android Studio

Android Studio is available on all three platforms and AVD setup is the same everywhere:

1. Open **Android Virtual Device Manager**.
2. Click **Create Device**, choose a hardware profile. Choose a device with no playstore icon. Pixel 6 works well for API 33+.
3. On the **System Image** screen, pick one of:
   - `API 33 - Google APIs (x86_64)` - includes Google services, rootable
   - `API 34 - AOSP (x86_64)` - no Google services, fully open
   - **Avoid anything labeled `Google Play`** - these reject `adb root`
4. Finish and launch the AVD.

**Linux - KVM**

Without KVM the emulator is painfully slow. Set it up before creating your AVD:

```bash
sudo apt install qemu-kvm
sudo adduser $USER kvm
# Log out and back in for the group change to apply

kvm-ok
```

**macOS - Apple Silicon (M1/M2/M3)**

Android Studio on Apple Silicon defaults to `arm64-v8a` images. These work fine, but make sure you grab the right image and not the x86_64 one. Hypervisor acceleration is handled automatically.

**Windows - HAXM / Hyper-V**

Android Studio will prompt you to install either HAXM or Windows Hypervisor Platform during AVD setup depending on your hardware. If the emulator crashes on start, make sure Hyper-V is enabled:

```powershell
# Run as Administrator
bcdedit /set hypervisorlaunchtype auto
# Reboot after this
```

### Rooting the Emulator

Same on all platforms:

```bash
adb root
# Expected: restarting adbd as root

adb shell whoami
# Expected: root
```

If you get `adbd cannot run as root in production builds`, you picked a Play Store image. Delete the AVD and recreate it with a Google APIs image.

> [!TIP]
> rootAVD is a script that allows Magisk to be installed in emulators. This can be used to root an emulator with Play Store as well. You can find it here [https://github.com/rootAVD/rootAVD](https://github.com/rootAVD/rootAVD). This lets you install and run Magisk modules like Shamiko and TrustMeDarling on emulators. You can then install Magisk modules like TrustMeDarling to inject the CA certificate into the system trust store.

### Pushing Burp Certificate to System Store

Emulator system partitions are writable so you can push directly, no Magisk needed:

```bash
#When using a freshly installed emulator, you need to remount and reboot the system partition
adb root
adb remount
adb reboot

#Use remount to mount the overlayfs partition as read-write
adb push <hash-value/>.0 /system/etc/security/cacerts/
adb shell chmod 644 /system/etc/security/cacerts/<hash-value/>.0
```

Verify (Linux / macOS):
```bash
adb shell ls /system/etc/security/cacerts/ | grep <hash-value/>
```

Verify (Windows PowerShell):
```powershell
adb shell ls /system/etc/security/cacerts/ | Select-String "<hash-value/>"
```

Then reboot:

```bash
adb reboot
```
> [!NOTE]
> Android 14+ stores certificates in `/apex/com.android.conscrypt/cacerts/` instead of `/system/etc/security/cacerts/`. You can use [TrustMeDarling](https://github.com/TheKimi7/TrustMeDarling) to inject the certificate into the system trust store.

---

## Installing Frida Server on the Rooted Device/Emulator

```bash
# Check the architecture first
adb shell getprop ro.product.cpu.abi
# x86_64 on Windows/Linux Intel
# arm64-v8a on Apple Silicon
```
Find the major version of frida installed on your host machine using `frida --version`.

Download the matching binary from [here](https://github.com/frida/frida/releases), then:

```bash
adb push frida-server-x.x.x-android-<arch/> /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server

adb shell "/data/local/tmp/frida-server &"

frida-ls-devices
# Should list the emulator
```
> [!WARNING]
> Major version of frida installed on your host machine must match the major version of frida server installed on the device/emulator. Otherwise, it will not work.

<!-- page-break -->

## Traffic Interception and Burp Suite Config

### Proxy Configuration

Configure proxy as the host machine's IP address and Burp Suite's proxy port (default is 8080). 

| OS | Command |
|:-----------|:-------------------------------|
| Windows | `ipconfig` (look for IPv4 Address under your active adapter) |
| Linux | `ip a` or `hostname -I` |
| macOS | `ipconfig getifaddr en0` (Wi-Fi) or `en1` (Ethernet) |

```bash
adb shell settings put global http_proxy <host-ip>:8080

# Clear it after the session
adb shell settings put global http_proxy :0
```

You can also set it through the emulator UI at `Settings > Wi-Fi > long-press the network > Modify Network > Advanced > Proxy > Manual`.

### Burp Listener Setup

Go to `Proxy > Options > Proxy Listeners`, set binding to `All interfaces` on port `8080`. This covers USB-connected physical devices and emulators on the same machine.

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

## Checklist Before Your First Assessment

- [ ] `adb devices` shows device as `device` and not `unauthorized`
- [ ] USB drivers installed and working (Windows only)
- [ ] Root verified: `adb shell su -c whoami` (physical) or `adb root` (emulator)
- [ ] Burp CA visible under `Trusted Credentials > System.`
- [ ] Frida server running and showing in `frida-ls-devices`
- [ ] Proxy set on device pointing to Burp on port 8080
- [ ] Host firewall allows inbound on 8080 (Windows / Linux with ufw)
- [ ] Traffic from a non-pinned app is visible in Burp
- [ ] Clean snapshot of test device or emulator taken

---

## What's Next

Core Android VAPT areas to cover once the environment is ready:

- **Insecure data storage** - SharedPreferences, SQLite, external storage, logcat
- **Improper authentication** - token storage, biometric bypass, session fixation
- **Network communication** - cert validation gaps, cleartext traffic, sensitive data in headers
- **WebView attacks** - JS interface exposure, file access misconfig, intent-based XSS
- **IPC abuse** - exported Activities, Services, Content Providers, Broadcast Receivers
- **Deep link abuse** - insufficient validation of incoming intent data
- **Binary protections** - root detection, anti-tampering, obfuscation quality

[OWASP MASTG](https://mas.owasp.org/MASTG/) and [OWASP MASVS](https://mas.owasp.org/MASVS/) are the go-to references for structuring test cases. Running through MASVS-L1 and L2 checklists on every engagement keeps things consistent.

---

*Written based on real-world Android VAPT experience. IP Addresses and Port Numbers (e.g., 8080) used in these examples are for demonstration. Ensure you update them to match your specific project configuration and environment.*