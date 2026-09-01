# Start intake → ServeManager field map

The intake creates one held ServeManager job for each servee. This preserves the
selected documents, addresses, and service instructions for each person or
business instead of combining separate serves into one recipient record.

| Start step | Intake fields | ServeManager destination |
| --- | --- | --- |
| Documents | PDF name and each servee's selected document IDs | `documents_to_be_served_attributes[]`; each returned `put_url` receives the PDF bytes. |
| Recipient | Individual/business name; registered agent | `recipient_attributes.name` and `recipient_attributes.description`. |
| Recipient | Up to three phones, emails, Facebook, Instagram, LinkedIn | Structured `service_instructions` contact section, because ServeManager's documented job recipient object has no phone/email/social fields. |
| Service | Addresses assigned to that servee | `addresses_attributes[]`, using `Home` for the first and the selected location type for subsequent records. |
| Service | Instructions | `service_instructions`. |
| Case | Case name, number, court date | One shared `court_case` (`plaintiff`, `number`, `court_date`) and its `court_case_id` on every servee job. |
| Case | Court name/state, type/subtype, details | Structured `service_instructions` and `custom` metadata because the provided court form does not collect a court location ID/address. |
| Speed | Selected speed | `rush` for Expedited, Same Day, and Difficult Serve; service level is also placed in `service_instructions` and `custom`. |
| Add-ons | Witness fee, skip trace, e-filing, affidavit, stakeout, mailing | Structured `service_instructions`; Stripe remains the payment record. |
| Review/payment | All created job IDs | `servemanager_job_ids` Stripe metadata. The verified Stripe success webhook updates every listed ServeManager job. |

Fields with no native documented ServeManager equivalent are deliberately written
into structured service instructions rather than dropped. The API key is never
sent to the browser.

## Configured custom fields

ServeManager custom job fields are configured per account, and the API reference
does not publish each account's field keys. When the fields have been created in
ServeManager, set `SERVEMANAGER_CUSTOM_FIELD_MAP` in Vercel to map the canonical
Denver keys to those exact ServeManager keys. For example:

```json
{
  "phone_numbers": "Recipient phones",
  "email_addresses": "Recipient emails",
  "facebook": "Facebook profile",
  "instagram": "Instagram profile",
  "linkedin": "LinkedIn profile",
  "service_level": "Service level",
  "skip_trace": "Skip trace",
  "e_filing": "E-filing",
  "mailing_type": "Mailing type"
}
```

Available canonical keys include `servee_type`, `registered_agent`,
`phone_numbers`, `email_addresses`, `facebook`, `instagram`, `linkedin`,
`case_name`, `case_number`, `court_name`, `court_state`, `case_type`,
`case_subtype`, `service_level`, `service_instructions`,
`difficult_serve_context`, `witness_fee`, `skip_trace`, `e_filing`,
`mailed_affidavit`, `stakeout_hours`, `mailing_type`, `mailing_timing`, and
`mailing_outcomes`.
