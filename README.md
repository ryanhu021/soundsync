[![build](https://github.com/ryanhu021/soundsync/actions/workflows/build.yml/badge.svg?branch=main&event=push)](https://github.com/ryanhu021/soundsync/actions/workflows/build.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/9efdc130-5f01-4c96-9a0c-caedfd8c7619/deploy-status)](https://app.netlify.com/sites/soundsync/deploys)
![Render Status](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fsoundsync-status.onrender.com%2Fsrv-cks47cg5vl2c73d3hd70&query=%24.status&style=flat-square&logo=render&label=render)


# SoundSync - CSC307 Team Project

## Product Vision
SoundSync revolutionizes your music experience, offering a dynamic platform where you can effortlessly create, view, and edit playlists tailored to your unique taste. Dive into a world of curated musical journeys, easily shared with friends and the vibrant SoundSync community. Seamlessly import and export your playlists to the popular streaming platforms: Spotify and Deezer, ensuring a fluid transition between SoundSync and your preferred listening environment. Elevate your music curation game with SoundSync — the ultimate destination for creating, editing, sharing, and exporting playlists.

## Story Board and UI Prototype
Our [UI prototype](https://www.figma.com/file/D8K5cXKixuDci62zEdhjVo/307-Project---SoundSync?type=design&node-id=0%3A1&mode=design&t=javpgxsRfI5nJH1m-1).  
Our [Figma story board](https://www.figma.com/file/ll44GHS0V2ezEDmyTDPjtt/SoundSync-Storyboard?type=design&node-id=0%3A1&mode=design&t=BlH2pSeYMtnAPs5f-1).  
Last edited 11/3/2023.

## Data Model
[Data Model](docs/data-model.md)

## Development Environment Set Up:
- Setup:
  - Clone the repository from : https://github.com/ryanhu021/soundsync.git
  - run `npm install`
  - create an `.env` file based on the `.env.template`
  - On Windows: `npm run lint-fix` after each `git pull`

- Run Locally:
  - frontend setup
    - `npm start -w frontend`
  - backend setup
    - `npm run dev -w backend`
- Build Locally:
  - `npm run build -w fronted`
  - `npm run build -w backend`

- Test Locally:
  - `npm test`
  
- Making changes:
  - make a new branch off dev: `git checkout -b branch_name` from the dev branch
    - main is the production code and dev is the working code
  - make appropriate changes
  - to merge:
    - `git add changed_files` or `git add .`
    - `git commit -m "appropriate message"`
    - `git push -u origin branch_name`
    - make a pull request to be approved. Make that the build workflow completes

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

- Linter Setup Instructions:
  - VSCode:
    - Navigate to "Extensions" page (Ctrl + Shift + X)
    - Search for "Prettier - Code formatter" by Prettier
    - Install
    - Search for "ESLint" by Microsoft
    - Install

- Scripts 
  - (use -w=frontend or -w=backend for a specific workspace)
  - npm run lint: checks code for styling and formatting issues using ESLint and Prettier and issues will be reported
  - npm run lint-fix: checks code styling and formatting issues using ESLint and Prettier and fixes them for all.
  
  
