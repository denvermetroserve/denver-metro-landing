# ServeManager custom fields for Denver Metro Serve

## Purpose

ServeManager job custom fields are configured per account. Denver Metro Serve
uses them to preserve intake data that has no native documented job field, such
as multiple contacts, social profiles, service add-ons, and the service-level
selection.

The app never guesses the custom-field keys. Configure the fields in
ServeManager first, then map their exact API keys with an environment variable.

## Create these job custom fields in ServeManager

Create the fields appropriate for your operations:

- Recipient phones
- Recipient emails
- Facebook profile
- Instagram profile
- LinkedIn profile
- Servee type
- Registered agent
- Case name and case number
- Court name and court state
- Case type and sub-type
- Service level
- Difficult-serve context
- Witness fee
- Skip trace authorization
- E-filing requested
- Mailed affidavit requested
- Stakeout hours
- Mailing type, timing, and outcomes

## Configure Vercel

Add `SERVEMANAGER_CUSTOM_FIELD_MAP` as JSON in Vercel environment variables.
Each key on the left is a canonical Denver Metro Serve field; each value is the
matching custom-field key configured in ServeManager.

```json
{
  "phone_numbers": "Recipient phones",
  "email_addresses": "Recipient emails",
  "facebook": "Facebook profile",
  "instagram": "Instagram profile",
  "linkedin": "LinkedIn profile",
  "servee_type": "Servee type",
  "registered_agent": "Registered agent",
  "case_name": "Case name",
  "case_number": "Case number",
  "court_name": "Court name",
  "court_state": "Court state",
  "case_type": "Case type",
  "case_subtype": "Case sub-type",
  "service_level": "Service level",
  "difficult_serve_context": "Difficult serve context",
  "witness_fee": "Witness fee",
  "skip_trace": "Skip trace",
  "e_filing": "E-filing",
  "mailed_affidavit": "Mailed affidavit",
  "stakeout_hours": "Stakeout hours",
  "mailing_type": "Mailing type",
  "mailing_timing": "Mailing timing",
  "mailing_outcomes": "Mailing outcomes"
}
```

Use the keys accepted by your ServeManager account, which may differ from their
visible labels. Deploy after changing the environment variable.

## Field behavior

At payment preparation, the app creates one ServeManager job per servee. It
writes mapped values to the job's `custom` object. The same operational context
is also retained in structured `service_instructions`, so the field is still
available to the server team if a configured custom field is missing or renamed.

## Verify

1. Create a test request with a phone, email, social profile, and one add-on.
2. Complete the test payment flow.
3. Open the created ServeManager job.
4. Confirm the selected custom fields have values and the service instructions
   contain the same context.
5. If a custom field is empty, check the custom field's API key and update
   `SERVEMANAGER_CUSTOM_FIELD_MAP`; do not change the browser form field name.
