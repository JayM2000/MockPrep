# AI Project Platform: Share Button & Invitation Approach

## 1. Core idea

Keep three things separate:

| Concept | What it is |
|---|---|
| **Project** | The task template (codebase, description, stack, complexity) |
| **Invite** | Permission to access a project |
| **Session** | The live VS Code environment a candidate works in |

**Rule:** visibility (Public / Private) decides *who can get an invite*. An invite only *leads to* a session; it never starts one directly. The candidate must review and click **Accept & Start**.

---

## 2. Private projects: email-bound, single-use invites

### Flow

1. Assessor opens **Share** on a private project and enters the candidate's email.
2. System creates a random, single-use token link tied to that email and project, then sends it.
3. Candidate clicks the link:
   - **Registered:** log in. The account email must match the invite email.
   - **Not registered:** go to sign-up with the email prefilled and locked, then continue to the invite automatically.
4. Candidate lands on a **review page** (project title, assessor name, time limit, rules).
5. Candidate clicks **Accept & Start**, and a session is created.

### Why

- A forwarded link can't be used by someone else.
- Clear audit trail of who was invited, who opened it and who finished.

---

## 3. Public projects: shareable link with limits

### Flow

1. Assessor copies one generic link from the Share modal.
2. Anyone with the link must **log in or register** (no anonymous sessions, to protect compute).
3. After login, they see the same review page and click **Accept & Start**.
4. Each candidate gets their **own isolated session**. Never a shared environment.

### Assessor controls

- Max number of candidates
- Link expiry date
- Optional approval step (assessor approves before the session starts)
- Optional short pre-screen form

### Tracking

Every candidate who joins through the public link creates their own invite record, so you still have per-candidate status.

---

## 4. Share button UI

Clicking **Share** on a project card opens a modal.

### Public project

Two tabs:

- **Invite by email**: input for one or more emails, optional message, **Send invite**
- **Public link**: link with **Copy** button, max candidates, expiry, **Disable link**

### Private project

Only the **Invite by email** tab is shown. No public link is possible.

### Invite list (below the tabs)

| Candidate | Status | Sent | Actions |
|---|---|---|---|
| a@x.com | Sent | Nov 19 | Resend, Revoke |
| b@x.com | In progress | Nov 18 | View session |
| c@x.com | Completed | Nov 17 | View result |

**Statuses:** Sent → Opened → Accepted → In progress → Completed (or Expired / Revoked)

---

## 5. Three separate timers

Your cards currently show "Expires in 15d". Split it into three concepts:

| Timer | Meaning |
|---|---|
| **Invite expiry** | How long the candidate has to click and accept |
| **Project expiry** | When the project stops accepting new candidates |
| **Session duration** | How long the candidate gets once they start (e.g. 2 hours) |

---

## 6. Live vs. async mode

Add a mode choice when creating a project:

- **Live:** candidate waits in a lobby until the assessor joins. Assessor watches in real time.
- **Async (take-home):** candidate starts any time within the window. Assessor reviews later via code diff or session replay.

---

## 7. Suggested data model

```
invites
- id
- project_id
- created_by            (assessor user id)
- token_hash            (store a hash, never the raw token)
- type                  (email | public_link)
- email                 (nullable for public links)
- max_uses
- use_count
- expires_at
- revoked_at
- status                (sent | opened | accepted | in_progress | completed | expired | revoked)
- created_at

sessions
- id
- invite_id
- candidate_id
- project_id
- environment_id
- started_at
- ends_at
- status
```

---

## 8. Suggested API routes (Node.js)

```
POST   /projects/:id/invites            create email invite(s)
POST   /projects/:id/public-link        create or rotate public link
DELETE /projects/:id/public-link        disable public link
GET    /projects/:id/invites            list invites + statuses
POST   /invites/:id/resend              resend email
POST   /invites/:id/revoke              revoke invite

GET    /invite/:token                   validate token, return review-page data
POST   /invite/:token/accept            create session (re-validates everything)
```

---

## 9. Security checklist

- [ ] Tokens are 32+ random bytes; only the **hash** is stored
- [ ] Private invites are single-use, revocable and rate-limited
- [ ] Email on the logged-in account must match the invite email (private)
- [ ] Invite is re-validated at **session start**, not just at link click
- [ ] Public link requires login and respects `max_uses` and `expires_at`
- [ ] Each candidate gets an isolated, time-limited environment
- [ ] Assessor can resend or revoke any invite from the UI
- [ ] Revoking an invite ends any active session started from it (or at least blocks new ones)

---

## 10. Things to check in the current UI

- In the screenshot, the project named **"private"** shows a **Public** badge and the project named **"public"** shows a **Private** badge. This is likely test data, but verify visibility is saved and displayed correctly.
- The **Share** button currently looks identical on all cards. After implementing the above, its modal should change based on project visibility.

---

## 11. Suggested build order

1. Data model (`invites`, `sessions`)
2. Private email invite + acceptance flow (covers the most important case)
3. Review page + Accept & Start
4. Share modal UI with invite list and statuses
5. Public link with limits
6. Live lobby / async mode
7. Resend, revoke and expiry jobs
