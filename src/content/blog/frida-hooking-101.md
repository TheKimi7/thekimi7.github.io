---
title: "Frida Hooking 101: Bypassing SSL Pinning"
date: 2024-08-20
tags: [Frida, Mobile Security, SSL Pinning]
excerpt: A quick overview of how to use Frida for SSL pinning bypass on Android and iOS apps.
---

## What is SSL Pinning?

SSL pinning is a security mechanism where mobile apps hardcode or bundle the expected server certificate. This prevents man-in-the-middle attacks but also makes security testing harder since proxies like Burp Suite can't intercept HTTPS traffic.

## Setting Up Frida

Install Frida on your host machine and push the server to your rooted device:

```bash
pip install frida-tools
adb push frida-server /data/local/tmp/
adb shell chmod 755 /data/local/tmp/frida-server
adb shell /data/local/tmp/frida-server &
```

## The Bypass Script

Use Frida to hook into the SSL verification methods at runtime:

```javascript
Java.perform(function() {
  var TrustManager = Java.use('com.android.org.conscrypt.TrustManagerImpl');
  TrustManager.verifyChain.implementation = function() {
    console.log('[+] SSL pinning bypassed');
    return arguments[0];
  };
});
```

## Conclusion

SSL pinning bypass is one of the first steps in mobile app pentesting. From here, you can intercept and analyze all API traffic to find deeper vulnerabilities.
