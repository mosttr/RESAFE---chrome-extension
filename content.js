

const imageUrl = chrome.runtime.getURL("Warning_googledoc.png");

// Log to confirm that the content script is loaded
console.log(`
██████╗░███████╗░██████╗░█████╗░███████╗███████╗
██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝
██████╔╝█████╗░░╚█████╗░███████║█████╗░░█████╗░░
██╔══██╗██╔══╝░░░╚═══██╗██╔══██║██╔══╝░░██╔══╝░░
██║░░██║███████╗██████╔╝██║░░██║██║░░░░░███████╗
╚═╝░░╚═╝╚══════╝╚═════╝░╚═╝░░╚═╝╚═╝░░░░░╚══════╝`)

console.log(` Why did you open the inspect element? If someone asked you paste into console for free stuff, then thats fake and your pasting script that could hack you or steal your cookies!!!`)

 
console.log(``)


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content.js:', message);

  if (message.action === "showWarningPopup") {
    showWarningPopup();
  }
});

function showWarningPopup() {

  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '10px';
  popup.style.right = '10px';
  popup.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
  popup.style.color = 'white';
  popup.style.padding = '15px';
  popup.style.borderRadius = '10px';
  popup.style.zIndex = '9999';
  popup.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
  popup.style.maxWidth = '300px';
  popup.style.fontFamily = 'Arial, sans-serif';

  popup.innerHTML = `
    <div style="display: flex; align-items: center;">
      <img src="${imageUrl}" alt="Warning" style="width: 24px; height: 24px; margin-right: 10px;">
      <span style="font-weight: bold; font-size: 16px;">Warning: Document is public</span>
    </div>
    <p style="margin-top: 10px; margin-bottom: 10px; font-size: 14px;">
      Anyone with a link to this document has access. Make sure you're not sharing any personal or sensitive information.
    </p>
    <button id="closeWarningPopup" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; position: absolute; top: 5px; right: 10px;">&times;</button>
  `;


  popup.querySelector('#closeWarningPopup').addEventListener('click', () => {
    popup.remove();
  });


  setTimeout(() => {
    popup.remove();
  }, 10);

  document.body.appendChild(popup);
}


// premium?
class SecurityHeuristics {
    constructor() {
        this.riskScore = 0;
        this.maxScore = 5;
        this.failedChecks = [];
    }

    analyzeDomain(domain) {
        // Check 1: Domain age (simplified - you'd use WHOIS API in real implementation)
        if (this.isNewDomain(domain)) {
            this.riskScore += 1;
            this.failedChecks.push('NEW_DOMAIN');
        }

        // Check 2: Suspicious domain length/patterns
        if (this.hasSuspiciousPattern(domain)) {
            this.riskScore += 1;
            this.failedChecks.push('SUSPICIOUS_DOMAIN_PATTERN');
        }

        // Check 3: Character mixing (e.g., amaz0n-payment.com)
        if (this.hasCharacterSubstitution(domain)) {
            this.riskScore += 1;
            this.failedChecks.push('CHARACTER_SUBSTITUTION');
        }
    }

    analyzeContent() {
        const pageText = document.body.innerText.toLowerCase();
        
        // Check 4: Urgency language
        const urgencyPhrases = [
            'immediate action required', 'account suspended', 'verify now',
            'security alert', 'login to confirm', 'urgent'
        ];
        
        urgencyPhrases.forEach(phrase => {
            if (pageText.includes(phrase)) {
                this.riskScore += 1;
                this.failedChecks.push('URGENCY_LANGUAGE');
            }
        });

        // Check 5: Login forms on non-login pages
        if (this.hasSuspiciousLoginForms()) {
            this.riskScore += 2;
            this.failedChecks.push('SUSPICIOUS_LOGIN_FORM');
        }

        // Check 6: Brand impersonation
        if (this.detectsBrandImpersonation(pageText)) {
            this.riskScore += 1;
            this.failedChecks.push('BRAND_IMPERSONATION');
        }
    }

    // === DOMAIN CHECKS ===
    isNewDomain(domain) {
        // In real implementation, you'd call a WHOIS API
        // For now, check for patterns common in new malicious domains
        return domain.length > 15 || /[0-9]{4,}/.test(domain);
    }

    hasSuspiciousPattern(domain) {
        // Very long domains are often suspicious
        if (domain.length > 23) return true;
        
        // Multiple hyphens
        if ((domain.match(/-/g) || []).length > 2) return true;
        
        return false;
    }

    hasCharacterSubstitution(domain) {
        const brands = ['amazon', 'paypal', 'google', 'microsoft', 'apple', 'netflix'];
        const substituted = domain.replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e');
        
        return brands.some(brand => substituted.includes(brand));
    }

    // === CONTENT CHECKS ===
    hasSuspiciousLoginForms() {
        const forms = document.querySelectorAll('form');
        for (let form of forms) {
            const inputs = form.querySelectorAll('input[type="password"], input[type="email"]');
            const isLoginPage = window.location.pathname.includes('login') || 
                               window.location.pathname.includes('signin');
            
            // Password field on a non-login page is suspicious
            if (inputs.length > 0 && !isLoginPage) {
                return true;
            }
        }
        return false;
    }

    detectsBrandImpersonation(text) {
        const brandKeywords = {
            'paypal': ['payment', 'money', 'transfer'],
            'amazon': ['prime', 'shopping', 'package'],
            'google': ['gmail', 'drive', 'account security'],
            'microsoft': ['outlook', 'office', 'onedrive']
        };

        for (let [brand, keywords] of Object.entries(brandKeywords)) {
            if (text.includes(brand)) {
                const matchingKeywords = keywords.filter(keyword => text.includes(keyword));
                if (matchingKeywords.length >= 2) {
                    return true;
                }
            }
        }
        return false;
    }

    // === MAIN EXECUTION ===
    performSecurityScan() {
        const domain = window.location.hostname;
        
        this.analyzeDomain(domain);
        this.analyzeContent();
        
        // Final decision
        if (this.riskScore >= 6) { // Adjust threshold as needed
            return {
                block: true,
                score: this.riskScore,
                maxScore: this.maxScore,
                failedChecks: this.failedChecks,
                message: `🚫 Blocked: High risk site (${this.riskScore}/${this.maxScore})`
            };
        } else if (this.riskScore >= 4) {
            return {
                block: false,
                warn: true,
                score: this.riskScore,
                failedChecks: this.failedChecks,
                message: `⚠️ Warning: Medium risk site (${this.riskScore}/${this.maxScore})`
            };
        }

        return {
            block: false,
            score: this.riskScore,
            message: `✅ Site appears safe (${this.riskScore}/${this.maxScore})`
        };
    }
}

// Usage in your content script
const scanner = new SecurityHeuristics();
const result = scanner.performSecurityScan();

if (result.block) {
    // Block the page - redirect or show warning
    document.body.innerHTML = `<div style="padding: 20px; text-align: center;">
        <h1>🚫 Security Warning</h1>
        <p>Resafe blocked this page for your protection.</p>
        <p>Reasons: ${result.failedChecks.join(', ')}</p>
    </div>`;
} else if (result.warn) {
    // Show warning but allow proceeding
    console.warn('Security Warning:', result.message);
}
