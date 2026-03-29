# 🚀 Frazzo Media Website

Premium animated website for Frazzo Media digital agency.

---

## 📁 Folder Structure

```
frazzo-media/
├── index.html        ← Main website file
├── css/
│   └── style.css     ← All styles
├── js/
│   └── main.js       ← All animations & interactivity
├── vercel.json       ← Vercel deployment config
└── README.md         ← This file
```

---

## 🌐 How to Deploy to Vercel (Step by Step)

### Step 1 — Create a GitHub Account
Go to https://github.com and sign up (free)

### Step 2 — Create a New Repository
1. Click the **+** icon → **New repository**
2. Name it: `frazzo-media`
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload Your Files
1. On the repository page, click **Add file** → **Upload files**
2. Drag and drop the ENTIRE `frazzo-media` folder contents:
   - `index.html`
   - `css/` folder (with style.css inside)
   - `js/` folder (with main.js inside)
   - `vercel.json`
3. Click **Commit changes**

### Step 4 — Deploy to Vercel
1. Go to https://vercel.com → Sign up with your GitHub account
2. Click **New Project**
3. Find your `frazzo-media` repo → Click **Import**
4. Leave all settings as default
5. Click **Deploy**
6. ✅ Your site will be live at: `frazzo-media.vercel.app`

---

## ✏️ How to Edit Content

All text content is in `index.html`. Search for the section you want to edit:

| What to change | Search for in index.html |
|---|---|
| Agency name | `FRAZZO MEDIA` |
| Services | `id="services"` |
| Stats numbers | `data-target="150"` etc |
| Review names/text | `id="reviews"` |
| Contact email | `hello@frazzomedia.com` |
| Footer text | `id="footer"` |

---

## 🎨 How to Change Colors

Open `css/style.css` and edit the `:root` variables at the top:

```css
:root {
  --cyan:  #00f0ff;   ← Main accent color
  --pink:  #ff2d78;   ← Secondary accent
  --bg:    #030610;   ← Background color
}
```

---

## 📞 Contact Form Setup (Make it actually send emails)

The form currently shows a success message but doesn't send emails.
To make it send real emails for FREE:

1. Go to https://formspree.io → Sign up free
2. Create a new form → get your form ID (looks like `xabcdefg`)
3. In `index.html`, change the form tag from:
   `<form class="contact-form" id="contactForm">`
   to:
   `<form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_ID" method="POST">`
4. That's it — form submissions go straight to your email!

---

Built with ❤️ — Pure HTML, CSS & JavaScript. No frameworks needed.
