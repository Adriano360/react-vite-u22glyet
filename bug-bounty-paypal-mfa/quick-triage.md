# Quick Triage: Campaign vs General Program

Use this before writing a report.

## Submit to the MFA Bypass Campaign if all are true

- The affected asset is in scope.
- MFA, SCA or Step-Up was expected or actually presented.
- The protected action completed without completing the required challenge.
- The report does not rely on stolen cookies, stolen tokens, compromised e-mail, SIM swap, social engineering, physical access or DoS.

## Submit to the general PayPal program instead if

- The bug is XSS, CSRF, IDOR, data exposure, RCE, injection or open redirect without direct MFA/SCA/Step-Up bypass.
- The issue is missing MFA where no policy or Step-Up requirement is shown.
- The issue is only UI confusion, hidden prompts or cosmetic bypass without security impact.
- The issue is OTP rate limiting without a demonstrated bypass.

## Do not submit / stop testing if

- The test requires third-party accounts or data.
- The only path requires compromising the second-factor channel.
- The test would stress availability or behave like DoS.
- The flow is outside PayPal-controlled scope or outside the campaign assets.

## Severity hints

- Critical: Account access or major protected action possible without MFA, with broad or systemic impact.
- High: Sensitive account or financial action possible without required Step-Up/SCA.
- Medium: Limited unauthorized action or limited scope bypass with clear security impact.
- Low: Minor inconsistency with limited impact; usually better for the general program unless it directly bypasses MFA.
