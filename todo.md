1/5/26 Demo Review Bug
- reviewed_by and reviewed_at rows don't update for demo accounts
- Will probably need demo_reviewed_by and demo_reviewed_at columns to avoid confusion
- I have added 'reviewed_by' and 'reviewed_at' to the demo query inside /content/[id]/action.ts as a partial fix
  - Will incorrectly show Demo accounts as having approved/rejected posts even after the demo action has expired, should be patched out eventually