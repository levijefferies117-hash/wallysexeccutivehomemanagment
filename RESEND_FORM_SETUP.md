# Executive Home Resend Form Setup

The quote form is backend-ready for Vercel + Resend.

## Vercel Environment Variables

Add these to the Executive Home Vercel project:

```txt
RESEND_API_KEY=your Resend API key
QUOTE_TO_EMAIL=wally@executivehome.com.au
QUOTE_FROM_EMAIL=Executive Home Website <wally@executivehome.com.au>
```

`QUOTE_FROM_EMAIL` must use a sender/domain verified in Resend. The local `.env.local` file has been added for local testing, but Vercel still needs the same variables added in the project settings for the live quote form.

## Files

- `contact.html`
- `script.js`
- `api/quote-request.js`
- `thanks.html`

## Behavior

The contact form posts to:

```txt
/api/quote-request
```

The API sends a clean new email through Resend with:
- name
- phone
- email
- suburb
- service
- message

The customer's email is used as `reply_to`.

## Before Launch

- Add the environment variables in Vercel.
- Submit a test enquiry.
- Confirm Wally receives a clean new email.
- Confirm replying goes to the customer email.
