# SoundSync - CSC307 Team Project

## Product Vision
SoundSync revolutionizes your music experience, offering a dynamic platform where you can effortlessly create, view, and edit playlists tailored to your unique taste. Dive into a world of curated musical journeys, easily shared with friends and the vibrant SoundSync community. Seamlessly export your playlists to popular streaming platforms like Spotify and Deezer, ensuring a fluid transition between SoundSync and your preferred listening environment. Elevate your music curation game with SoundSync — the ultimate destination for creating, sharing, and exporting playlists.

## Story Board and UI Prototype
Our [UI prototype](https://www.figma.com/file/D8K5cXKixuDci62zEdhjVo/307-Project---SoundSync?type=design&node-id=0%3A1&mode=design&t=javpgxsRfI5nJH1m-1).
Our [Figma story board](https://www.figma.com/file/ll44GHS0V2ezEDmyTDPjtt/SoundSync-Storyboard?type=design&node-id=0%3A1&mode=design&t=BlH2pSeYMtnAPs5f-1).
Last edited 11/3/2023.

## Data Model

## Contributing:
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
  
  
