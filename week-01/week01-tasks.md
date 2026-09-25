### Tech SG Studio - Internship week 01 tasks

### Week 1 Tasks

* **Development environment setup** -> already done

  * VS Code install aur setup karna.
  * Chrome ya Firefox with Developer Tools use karna.
  * GitHub account create/setup karna. 

* **HTML fundamentals** -> already done

  * Basic HTML document structure samajhna.
  * `<!DOCTYPE html>`, `<html>`, `<head>` aur `<body>` ka use karna.
  * Common HTML tags practice karna:

    * Headings: `<h1>`, `<h2>`
    * Paragraphs: `<p>`
    * Links: `<a>`
    * Images: `<img>`
    * Lists: `<ul>`, `<li>`
    * Containers: `<div>`, `<span>` 

* **HTML Forms & Tables** -> already done

  * Basic contact form create karna.
  * `<form>`, `<label>`, `<input>`, `<textarea>` aur `<button>` use karna.
  * Basic HTML tables banana using `<table>`, `<tr>`, `<th>` and `<td>`. 

* **Semantic HTML** -> already done

  * Generic `<div>` ki jagah semantic elements use karna:

    * `<header>`
    * `<nav>`
    * `<main>`
    * `<section>`
    * `<article>`
    * `<footer>`
  * Semantic structure ko accessibility aur SEO ke liye correctly use karna. 

* **CSS fundamentals** -> already done

  * HTML ke saath external CSS file connect karna.
  * CSS selectors practice karna:

    * Element selector
    * Class selector
    * ID selector
  * Colours, typography, font size, font weight, line height aur text alignment apply karna. 

* **CSS Box Model** -> already done

  * `Content`
  * `Padding`
  * `Border`
  * `Margin`
  * In properties ko practical CSS mein use karna. 

* **CSS Units** -> already done

  * `px`
  * `%`
  * `em`
  * `rem`
  * Responsive sizing ke liye relative units ko samajhna, especially `rem`. 

* **Flexbox** -> already done

  * `display: flex` -> navbar me use ho raha hai.
  * `flex-direction`
  * `justify-content`
  * `align-items`
  * `gap`
  * Flexbox se row/column layouts banana. 

* **CSS Grid** -> will be cover in services section in portfolio

  * Basic Grid layout samajhna.
  * Rows aur columns ke saath layouts create karna.
  * `grid-template-columns`, `grid-template-rows` aur `gap` practice karna. 

* **Responsive Design**

  * Website ko mobile, tablet aur desktop screens ke liye responsive banana.
  * Relative units, Flexbox/Grid aur media queries use karna.
  * `@media` queries ke through mobile-specific layouts banana. 

### Final Week 1 Project

* **HTML & CSS only** se ek **static personal portfolio website** build karni hai.
* **JavaScript use nahi karna.**
* Portfolio mein minimum:

  * Header + Navigation
  * About section
  * Projects **ya** Skills section
  * Footer
* Semantic HTML tags use karne hain.
* At least **one Flexbox layout** implement karna hai.
* Page ko responsive banana hai.
* Project **Sunday 9:00 PM** tak submit karna hai. 

**Short version:** Week 1 ka actual deliverable ek **responsive static portfolio website using HTML + CSS, without JavaScript** hai.

### DEADLINE: SUNDAY 9:00AM
------
Resources:
Google fonts links:
  https://fonts.googleapis.com
  https://fonts.gstatic.com
  https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap

Image link: https://www.vecteezy.com/vector-art/15435210-web-development-programmer-engineering-website

------

### Portfolio mein ab tak jo implement ho chuka hai (progress summary)

* **Theme & Colours**

  * Kozowood reference image se 5-colour palette liya (`3E362E`, `865D36`, `93785B`, `AC8968`, `A69080`).
  * CSS custom properties (`:root` variables) mein define kiya, taake pura theme ek jagah se manage ho.

* **Global setup**

  * `Space Mono` Google Font connect kiya.
  * Global reset (`*`, `box-sizing: border-box`).
  * `html { scroll-behavior: smooth; }` aur sections par `scroll-margin-top` (sticky navbar ke neeche heading hide na ho, iske liye).

* **Semantic HTML structure**

  * `<header>`, `<nav>`, `<main>`, multiple `<section id="...">`, `<footer>` use kiye.
  * Har section ka apna `id` hai: `hero`, `services`, `skills`, `about`, `projects`, `contact`.

* **Navbar**

  * Sticky navbar, desktop aur mobile dono par.
  * Same-page anchor links (`<a href="#services">`).
  * Hamburger menu sirf mobile par, JavaScript se open/close (`aria-expanded`, `aria-label` bhi update hota hai).
  * Hover/active states, subtle transitions.

* **Hero Section**

  * Flexbox layout (`display: flex`, `justify-content: space-between`, `align-items: center`).
  * Real profile intro (background, experience, SEO result) CV se liya gaya.
  * Do CTA buttons (`View My Work` -> `#projects`, `Let's Connect` -> `#contact`).
  * Stat cards (Flexbox row) aur ek image card jisme `object-fit: cover`, `border-radius`, glass-style caption hai.

* **Services Section**

  * CSS Grid based card layout (`grid-template-columns: repeat(3, 1fr)`).
  * Inline SVG icons (koi external icon library use nahi ki).
  * Consistent card design: icon, title, description, border, hover effect.

* **Skills Section**

  * Grid layout mein technology categories (Languages, Frameworks, Mobile, Tools).
  * Har skill ek "badge" style list item hai (`.badges`), boring list ki jagah.

* **About Section**

  * Two-column Grid layout: image + text.
  * Experience/education stats chhote info cards mein (Flexbox/Grid mix).

* **Projects Section**

  * Grid based project cards: image, title, description, technology badges, "View Project ->" link.
  * Real projects CV se liye: Dost Umrah Service aur PlanIQ.

* **Social Icons & Contact**

  * Facebook, WhatsApp, Instagram, GitHub, LinkedIn sab inline SVG hain.
  * Proper `aria-label`, hover animation, consistent sizing.
  * Contact section mein email aur WhatsApp number CV se real data hai.

* **Card Design System**

  * Ek hi consistent card style (`.card` class) Services, Skills, About stats, Projects aur Contact sab jagah reuse ho raha hai — border, radius, padding, hover sab same.

* **Footer**

  * Simple copyright se aagay: brand text, Quick Links, Social icons, copyright line — sab semantic `<footer>` ke andar.

* **Scroll Reveal Animation**

  * `IntersectionObserver` (JavaScript) se `.reveal` class wale elements fade-up hote hain jab scroll karte hain.
  * `prefers-reduced-motion` ka bhi khayal rakha gaya hai.

* **Responsive Design**

  * Har section ke liye desktop, tablet (1024px) aur mobile (768px) breakpoints already implemented hain.
  * `@media` queries se navbar, hero, cards, about aur footer sab stack/resize hote hain.

* **Code Architecture**

  * CSS logically organised hai: Theme -> Global -> Navbar -> Buttons -> Cards -> Hero -> Services/Skills -> About -> Projects -> Contact/Social -> Footer -> Animations -> Responsive.
  * HTML mein bhi comments se sections clearly separate hain.

**Note:** Yeh abhi internship ka **multi-page/advance version** hai (JS ke saath, scroll animation, sticky navbar etc), jabke Week 1 ka official deliverable **HTML + CSS only, static, no JavaScript** portfolio hai. Submission ke waqt is baat ka khayal rakhna hoga ke Week 1 ki requirement alag hai aur ye portfolio uske aagay ka kaam hai.

* **Theme update (light + dark mix)**

  * Poori site ek hi dark tone mein flat lag rahi thi, isliye theme ko revise kiya gaya.
  * **Hero aur Footer** dark theme par rakhe gaye (brand ka dark bookend, jaisa reference image mein bhi dark strip tha).
  * **Services, Skills, About, Projects, Contact** sections ka background warm cream (`--bg-light`) kar diya.
  * In sections ke andar sab cards (`.card`, `.stat-card`) **white background** ke sath dark text (`--text-dark`, `--muted-dark`) mein convert kiye, border ki jagah soft shadow se depth di gayi.
  * Accent colour (`#ac8968`) sab jagah same rakha, taake buttons/hover/icons consistent rahein.


**Note:** Yeh abhi internship ka **multi-page/advance version** hai (JS ke saath, scroll animation, sticky navbar etc), jabke Week 1 ka official deliverable **HTML + CSS only, static, no JavaScript** portfolio hai. Submission ke waqt is baat ka khayal rakhna hoga ke Week 1 ki requirement alag hai aur ye portfolio uske aagay ka kaam hai. main ne requirement ko zehen me rakhty hoy yeh built kia hai main jitni JS required hai utni use ki hai.