# Abyss

The goal of Abyss is to provide an alternative to Taiga.

---
## STATUS: FAILURE

---
**NOTES**

The current version of Abyss is a **developer** version.
Be sure to have **FFMPEG** installed on your device.
<br />
<br />
In Popura.js file, modify this line:
```javascript
export const Popura = popura("Your MyAnimeList username", "Your MyAnimeList password");
```
In Abyss.js file, modify this line:
```javascript
export const TargetDirectory = "path/to/your/anime/test/directory";

```
---

**HOW TO USE**

### 1. Install FFMPEG
<dl>
  <dt>Windows</dt>
  <dd>Follow this link: [wikiHow: How to install FFmpeg on Windows](https://www.wikihow.com/Install-FFmpeg-on-Windows)</dd>

  <dt>Ubuntu</dt>
  <dd>sudo add-apt-repository ppa:mc3man/trusty-media</dd>
  <dd>sudo apt-get update</dd>
  <dd>sudo apt-get install ffmpeg</dd>
</dl>

### 2. Clone repository

### 3. Start developing
<dl>
  <dt>NPM</dt>
  <dd>npm install</dd>
  <dd>npm start</dd>

  <dt>Yarn</dt>
  <dd>yarn install</dd>
  <dd>yarn start</dd>
</dl>

---

## ScreenShots

#### Abyss anime selection page

<img src="https://github.com/SSebigo/abyss/blob/master/screenshots/abyss_home.PNG" width="50%">

#### Abyss episode selection page

<img src="https://github.com/SSebigo/abyss/blob/master/screenshots/abyss_episode_selection.PNG" width="50%">

#### Abyss video player page

<img src="https://github.com/SSebigo/abyss/blob/master/screenshots/abyss_player.PNG" width="50%">

### TODO

- [ ] Improve video conversion with ffmpeg
- [ ] Embed ffmpeg in the release version
- [ ] Add episodes thumbnail
- [ ] Improve UI & UX
- [ ] Launch Beta version
- [ ] Add MyAnimeList news
