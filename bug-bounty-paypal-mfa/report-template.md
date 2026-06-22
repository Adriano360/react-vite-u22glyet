# Title

(Desvio de Campanha-MFA) [protected action] possible without completing [MFA/SCA/Step-Up] on [asset]

## Summary

Describe the bypass in 2-4 sentences. State why MFA, SCA or Step-Up was expected and what protected action completed without it.

## Affected Asset

- URL / asset:
- Brand / product:
- Campaign: PayPal MFA Bypass Campaign

## Test Accounts

- Account A:
- Account B:
- Source IP:
- Timezone:
- Custom header: `X-PP-BB: HackerOne-<username>`
- MFA methods configured:

## Steps to Reproduce

1. Configure MFA on Account A using [method].
2. Start [protected flow] on [asset].
3. Confirm the application presents or requires [MFA/SCA/Step-Up].
4. Without completing the challenge, perform the observed bypass condition: [brief description].
5. Confirm [protected action] succeeds without completing MFA/SCA/Step-Up.

## Evidence

- Screenshots/video:
- Relevant requests/responses:
- PayPal-Debug-Id values:
- Timestamps with timezone:

## Impact

An attacker with valid primary credentials, but without access to the second factor, can [authenticate / execute protected action / change sensitive setting / complete regulated action]. Explain account, data, financial, or trust impact.

## Scope Compliance

- Tested only owned accounts.
- No third-party data accessed intentionally.
- No social engineering.
- No stolen sessions or tokens.
- No compromised second-factor channel.
- No brute force, load testing, fuzzing aggression or DoS.

## Suggested Remediation

Bind MFA challenge validation server-side to the authenticated user, session, action, risk context, expiration and one-time use. Do not mark a session or flow as verified until the second factor has been validated for the exact protected action.
