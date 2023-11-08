# csc307-team-project

Contributing:
- Root ESLint:
  - uses recommended rules to enforce best practices and common rules for typescript
  - extends prettier's configurations: uses prettier's code formatting rules in ESlint
  - results in error level ESLint issue if code formatting does not comply with prettier's formatting
  
- backend:
  - extends root ESLint configuration
  
- frontend:
  - extends root ESLint configuration
  - plugins: "react" and "react-hooks" to enforce styling specific to react and react-hook

- automatic configuration:
  - the settings.json file has workspace ESLint configurations so contributors do not need to manually configure it
    - automatically formats on save.

- Setup Instructions:
  - VSCode:
    - Navigate to "Extensions" page (Ctrl + Shift + X)
    - Search for "Prettier - Code formatter" by Prettier
    - Install
    - Search for "ESLint" by Microsoft
    - Install

- Scripts 
  - (use -w=frontend or -w=backend for a specific workspace)
  - npm run lint: checks code for styling and formatting issues using ESLint and Prettier and issues will be reported
  - npm run lint-fix: checks code styling and formatting issues using ESLint and Prettier and fixes them.
  
  
