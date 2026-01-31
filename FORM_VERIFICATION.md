# Google Form Integration - Field Mapping

## Form URL
```
https://docs.google.com/forms/d/e/1FAIpQLSc_R9SnfJLULefvQEar6xIjnKQPnG1EEUyUmMBOj2q3INnK6w/formResponse
```

## Field Entry IDs

| Field Name | Entry ID           | Current Config | Status |
|-----------|-------------------|----------------|--------|
| Roll No   | entry.1980545502  | ✅ Configured  | MATCH  |
| Name      | entry.1735108337  | ✅ Configured  | MATCH  |
| Year      | entry.235212158   | ✅ Configured  | MATCH  |
| Dept      | entry.1142478584  | ✅ Configured  | MATCH  |
| Event     | entry.520065292   | ✅ Configured  | MATCH  |

## Verification Status: ✅ ALL FIELDS MATCH

All form entry IDs in `src/config.js` match the Google Form exactly. The integration is correctly configured.

## How to Update Entry IDs

If you ever change the Google Form fields:

1. Open the form in edit mode
2. Right-click on a field → "Inspect Element"
3. Look for `name="entry.XXXXXXXX"`
4. Update `src/config.js` googleForm.entryIds with new values

## Department Auto-Detection

The system automatically extracts department from roll numbers using the middle letter(s):
- Example: `23S042` → Detects "S" → B.Sc. Applied Science
- See `DEPT_CODES.md` for complete mapping
