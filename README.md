# ReSAFE - Local-First Browser Security & Privacy Suite

A powerful, all-in-one Chrome extension focused on **privacy hardening** and **proactive security** without sacrificing performance. All processing is done locally.

## 🛡️ Core Features 

### **Security**
- **Malicious Extension Disabler:** Automatically disables extensions known to be malicious or phishing based on a maintained blocklist.
- **Download Protection:** Forces Chrome's native security scan on *all* downloads, overriding user-disabled settings for mandatory protection.
- **Typosquatting Protection:** Blocks sites designed to exploit common misspellings of popular domains.
- **Heuristic Site Blocker:** A novel pattern-based checker that analyzes site age, domain name characteristics, and other signals to flag and block potentially malicious sites before they load.

### **Privacy**
- **Advanced Tracker Blocker:** Blocks over 300,000 tracking scripts and fingerprints.
- **WebRTC Leak Prevention:** Actively prevents your real IP address from leaking, even when using a VPN. (Tested and verified).
- **Permission Control Manager:** Instantly enable or disable camera and microphone access for all websites directly from the popup.
- **Cookie Controller:** Granularly clear cookies for any specific domain on-demand.

### **Performance**
- **Efficient AdBlock:** A highly optimized blocker that removes ads without slowing down your browsing experience.


## 🔬 Technical Deep Dive: Heuristic Engine

ReSAFE's pattern-based blocker uses a multi-factor risk assessment engine that analyzes both domains and page content in real-time.

**Domain Analysis:**
- **Domain Age Patterns:** Flags recently registered domains with long, numeric names
- **Suspicious Structures:** Detects excessive hyphens and character substitution (e.g., `amaz0n-payment`)
- **Typo squatting Protection:** Identifies common brand misspellings

**Content Analysis:**
- **Urgency Language Detection:** Scans for phishing phrases like "immediate action required"
- **Suspicious Form Detection:** Identifies password fields on non-login pages
- **Brand Impersonation:** Detects unauthorized use of major brand names with related keywords

**Scoring System:**
- Each failed check adds to a risk score
- Sites exceeding threshold scores are blocked with detailed reasoning
- Medium-risk sites trigger warnings while allowing user override
