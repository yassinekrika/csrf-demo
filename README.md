## CSRF Protection Overview

This project uses Hono's native, lightweight `csrf()` middleware to defend against Cross-Site Request Forgery attacks. 

Unlike traditional setups that require generating, storing, and embedding a manual token string inside a hidden HTML input field, Hono utilizes **automated Origin and Referer validation**.

### How It Works Under the Hood

1. **Request Verification:** For any state-changing HTTP requests (`POST`, `PUT`, `DELETE`), the middleware automatically intercepts the request before it reaches your route handler.
2. **Header Comparison:** It extracts the incoming `Origin` and `Referer` headers sent by the user's browser.
3. **Domain Validation:** It compares these headers against your server's actual host domain (`http://localhost:3000`).
4. **Action:** 
   - If the domains match exactly, the request is trusted and allowed through.
   - If a malicious third-party site tries to trick the user into submitting the form, the browser attaches the attacker's domain as the `Origin`. Hono detects this mismatch and instantly blocks the request with a `403 Forbidden` response.

### Benefits of This Approach

- **Zero Client Overhead:** No need to fetch tokens via JavaScript or inject hidden inputs into your HTML forms.
- **Stateless:** The server does not need to store token strings in memory or in a database session store.
- **Secure by Default:** Works natively with standard HTML `<form action="/login" method="POST">` submissions.

### Production Considerations

When you deploy this application to a live server (e.g., `https://myapp.com`), Hono automatically detects the production domain. However, if your app runs behind a reverse proxy (like Nginx or Cloudflare), ensure your proxy correctly forwards the original host headers (`X-Forwarded-Host`) so the validation does not fail.
