---
applyTo: '**'
---

<todos title="Security Implementation: Password Hashing & Input Validation" rule="Review steps frequently throughout the conversation and DO NOT stop between steps unless they explicitly require it.">
- [x] add-password-to-schema: Add password field to Prisma User model and generate migration 🔴
  _Need to add optional password field to support both OAuth and credential-based authentication_
- [x] install-validation-deps: Install Zod, react-hook-form, and related validation dependencies 🔴
- [x] create-validation-schemas: Create Zod schemas for user registration, login, and order forms 🔴
  _Use Zod for runtime type checking and form validation across the app_
- [x] implement-password-hashing: Update auth.ts to use bcrypt for password hashing and verification 🔴
  _Use bcrypt with salt rounds of 12 for secure password storage_
- [x] create-password-utils: Create utility functions for password hashing and validation 🟡
- [x] update-signup-api: Update signup API endpoint to hash passwords and validate input 🔴
- [x] update-auth-forms: Update signin/signup forms to use react-hook-form with Zod validation 🟡
- [x] add-form-validation: Add input validation to checkout and admin forms 🟡
- [x] update-tests: Update tests to cover new validation and authentication flows 🟡
- [x] test-security-implementation: Test password hashing, validation, and authentication flows end-to-end 🔴
  _Successfully tested API endpoints, form validation, password hashing, TypeScript compilation, and database operations. All security implementations working correctly._
</todos>

<!-- Auto-generated todo section -->
<!-- Add your custom Copilot instructions below -->
