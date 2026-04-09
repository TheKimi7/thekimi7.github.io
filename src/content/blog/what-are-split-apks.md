---
title: "What Are Split APKs and How to Work with Them"
date: 2025-08-12
tags: [Android, Split APKs, Tutorial]
excerpt: What split APKs are, why they exist, and how to extract, install, merge, and analyze them during Android pentesting.
---

A practical guide to understanding and working with split APKs during Android security assessments. Covers extraction from devices, installation with ADB and bundletool, merging for static analysis, and common pitfalls.

---

## What Is a Split APK?

A split APK is an Android app distributed as multiple APK files instead of a single monolithic `base.apk`. The app won't function correctly unless all the required splits are present and installed together as a single package.

Google Play uses **Android App Bundles (AAB)** as the upload format. When a user downloads an app, the Play Store generates a set of split APKs tailored to their device and delivers only the relevant ones. This is handled by a system called **bundletool** under the hood.

A typical split APK set looks like this:

```
base.apk                        # Core app code and resources
split_config.arm64_v8a.apk      # Native libraries for arm64
split_config.xxhdpi.apk         # Resources for xxhdpi screen density
split_config.en.apk             # English language strings
split_feature_chat.apk          # Dynamic feature module (e.g., chat)
```

**Why apps use split APKs:**

- **Smaller downloads** - users only get the native libraries, screen density assets, and language packs that match their device instead of everything bundled together.
- **Dynamic features** - functionality like a chat module or camera scanner can be downloaded on demand rather than shipping with the initial install.
- **Google Play requirement** - new apps on the Play Store must use AAB format, which means split delivery is the default for most modern apps.

---

## Why It Matters for Pentesting

Split APKs create several problems during security assessments:

- **Installing just `base.apk` will crash.** The app expects its config splits to be present. Missing the architecture split means no native libraries. Missing the density split can cause resource loading failures.
- **Static analysis tools need the full set.** Running `jadx` or `apktool` on only `base.apk` will miss code and resources that live in the split APKs. A login flow, encryption logic, or API endpoint could be in a dynamic feature module that you never decompiled.
- **Sideloading is not straightforward.** You can't just `adb install base.apk` like a regular APK. The splits need to be installed together as a session.

---

## Extracting Split APKs from a Device

If the app is already installed on a device, pull all the splits using ADB.

**Find the package name:**

```bash
adb shell pm list packages | grep target
```

**List all APK paths for the package:**

```bash
adb shell pm path com.example.app
```

Output:

```
package:/data/app/~~random/com.example.app-hash/base.apk
package:/data/app/~~random/com.example.app-hash/split_config.arm64_v8a.apk
package:/data/app/~~random/com.example.app-hash/split_config.en.apk
package:/data/app/~~random/com.example.app-hash/split_config.xxhdpi.apk
```

**Pull all APKs at once:**

**Linux / macOS**

```bash
mkdir com.example.app_splits

adb shell pm path com.example.app | sed 's/package://' | while read -r apk; do
  adb pull "$apk" com.example.app_splits/
done
```

**Windows (PowerShell)**

```powershell
mkdir com.example.app_splits

adb shell pm path com.example.app | ForEach-Object {
  $apk = $_ -replace 'package:', ''
  adb pull $apk com.example.app_splits/
}
```

---

## Installing Split APKs

### Using `adb install-multiple`

The simplest way to install a set of split APKs onto a device. No additional tools needed.

```bash
adb install-multiple base.apk split_config.arm64_v8a.apk split_config.en.apk split_config.xxhdpi.apk
```

ADB creates an install session internally, pushes all the APKs, and commits them as a single package. If any split is incompatible or missing a required dependency, the entire install fails with an error.

**Installing all splits from a directory:**

**Linux / macOS**

```bash
adb install-multiple com.example.app_splits/*.apk
```

**Windows (PowerShell)**

```powershell
adb install-multiple @(Get-ChildItem com.example.app_splits\*.apk | ForEach-Object { $_.FullName })
```

**Replacing an existing installation:**

```bash
adb install-multiple -r base.apk split_config.arm64_v8a.apk split_config.en.apk
```

The `-r` flag replaces the existing app while keeping its data, same as `adb install -r` for regular APKs.

> `adb install-multiple` requires all APKs to be signed with the same certificate. If you've modified and re-signed any of the splits, all of them must be signed with the same key.

### Using `bundletool`

[bundletool](https://github.com/nickallendev/bundletool) is Google's official tool for working with Android App Bundles and split APKs.

**Install bundletool:**

Download the latest JAR from the [GitHub releases page](https://github.com/google/bundletool/releases). Requires Java 8+.

**Linux / macOS**

```bash
alias bundletool='java -jar /path/to/bundletool.jar'
# Add to ~/.bashrc or ~/.zshrc to persist
```

**Windows (PowerShell)**

```powershell
function bundletool { java -jar C:\tools\bundletool.jar @args }
# Add to your PowerShell profile to persist: notepad $PROFILE
```

**Building an `.apks` archive from an AAB:**

If you have the app bundle (AAB) file, typically provided by the client:

```bash
bundletool build-apks \
  --bundle=app.aab \
  --output=app.apks \
  --ks=keystore.jks \
  --ks-key-alias=alias \
  --ks-pass=pass:password
```

**Building a universal APK:**

For analysis purposes, you often want a single APK that contains everything instead of dealing with splits:

```bash
bundletool build-apks \
  --bundle=app.aab \
  --output=app.apks \
  --mode=universal
```

This produces an `.apks` file containing a single universal APK with all configurations merged. Extract it with `unzip app.apks` and you'll find `universal.apk` inside.

**Installing an `.apks` archive:**

```bash
bundletool install-apks --apks=app.apks
```

This installs the appropriate splits for the connected device automatically.

---

## Downloading Split APKs Without a Device

If the app isn't installed on a device you control, you can download the split APK set from third-party sources:

- **[APKCombo](https://apkcombo.com/)** - download XAPK/APKS bundles directly. Provides the full split set as a single archive.
- **[Aurora Store](https://auroraoss.com/)** - open-source Play Store client that downloads apps in their split format. Requires a Google account or anonymous token.
- **[APKMirror](https://www.apkmirror.com/)** - hosts APK bundles as APKM files. Their installer app handles split installation on-device.

XAPK and APKM files are just ZIP archives containing the split APKs. Rename to `.zip` and extract to get the individual APK files.

**Linux / macOS**

```bash
mv app.xapk app.zip
unzip app.zip -d app_splits/
```

**Windows (PowerShell)**

```powershell
Rename-Item app.xapk app.zip
Expand-Archive app.zip -DestinationPath app_splits\
```

---

## Merging Split APKs for Static Analysis

Static analysis tools work best with a single APK or a complete decompiled source tree. There are a few approaches:

### Using APKEditor

[APKEditor](https://github.com/nickallendev/APKEditor) can merge split APKs into a single APK. Same command on all platforms since it's a Java JAR:

```bash
java -jar APKEditor.jar m -i com.example.app_splits/ -o merged.apk
```

The merged APK can then be fed directly into `jadx`, `apktool`, or MobSF.

### Using apktool on Individual Splits

If merging isn't working cleanly, decompile each split separately:

```bash
apktool d base.apk -o base_decoded
apktool d split_config.arm64_v8a.apk -o arm64_decoded
apktool d split_feature_chat.apk -o chat_decoded
```

Then review each decoded directory. The `base_decoded` directory will have the main smali code and resources. Feature splits will have their own smali directories and resources. Native libraries from architecture splits will be in their respective `lib/` folders.

---

## Common Issues

**"INSTALL_FAILED_MISSING_SPLIT" during installation**

The device expects a split that isn't in your set. Usually the architecture split. Check which ABI the device uses (`adb shell getprop ro.product.cpu.abi`) and make sure the matching split is included.

**App crashes after installing only `base.apk`**

This is expected. Use `adb install-multiple` with all splits, or build a universal APK via bundletool if you have the AAB.

**Splits have different signatures after modification**

If you patched `base.apk` (e.g., to disable certificate pinning) but didn't re-sign the config splits with the same key, installation will fail. Re-sign all APKs with the same keystore:

```bash
apksigner sign --ks keystore.jks --ks-key-alias alias base.apk
apksigner sign --ks keystore.jks --ks-key-alias alias split_config.arm64_v8a.apk
apksigner sign --ks keystore.jks --ks-key-alias alias split_config.en.apk
```

> `apksigner` is part of the Android SDK Build Tools. On Windows, find it at `%LOCALAPPDATA%\Android\Sdk\build-tools\<version>\apksigner.bat`. On Linux/macOS, it's at `~/Android/Sdk/build-tools/<version>/apksigner` or via `$ANDROID_HOME/build-tools/<version>/apksigner`. Add the build-tools directory to your PATH to use it directly.

**"App not installed" with no specific error**

Check `adb logcat` for the actual failure reason:

**Linux / macOS**

```bash
adb logcat | grep -i "install"
```

**Windows (PowerShell)**

```powershell
adb logcat | Select-String "install" -CaseSensitive:$false
```

Common causes: signature mismatch, missing split, or version conflict with an existing installation. Try uninstalling the app first with `adb uninstall com.example.app` and retrying.

---

*Written based on real-world Android VAPT experience. Package names and paths used in examples are for demonstration purposes.*
