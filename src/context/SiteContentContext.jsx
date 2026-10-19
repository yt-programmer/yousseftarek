import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const defaults = {
  "site": {
    "name": "YOUSSEF TAREK",
    "footerName": "Youssef Tarek",
    "faviconUrl": "",
    "copyrightText": "All rights reserved."
  },
  "navigation": {
    "home": "home",
    "about": "about-me",
    "works": "works",
    "testimonials": "Testimonials",
    "contacts": "contacts"
  },
  "hero": {
    "title": "Hi I'm Youssef Tarek",
    "role": "MERN Stack Developer",
    "description": "Building modern web experiences and Turning ideas into interactive web apps",
    "buttonText": "View My Works",
    "photoUrl": "",
    "verifiedText": "Verified"
  },
  "homeAbout": {
    "title": "about me",
    "description": "Welcome to my portfolio! I’m Youssef Tarek, a passionate and creative web developer based in Cairo, Egypt. I focus on building modern, responsive, and user-friendly websites. I believe in turning ideas into powerful digital experiences using the latest technologies. My goal is to deliver smart and efficient web solutions that help businesses and individuals grow online. Through continuous learning and hands-on projects, I’m always improving and committed to providing high-quality results.",

    "imageUrl": "",
    "readMoreText": "Read More ~~)"
  },
  "aboutPage": {
    "title": "about Me",
    "subtitle": "Who am I ?",
    "description": "Welcome to my portfolio. My name is Youssef Tarek, a web developer based in Cairo, Egypt, with a strong focus on building modern, scalable, and high-quality web applications. I work primarily with the MERN Stack, developing responsive and interactive front-end interfaces using React and Tailwind CSS, while building reliable and efficient back-end systems with Node.js, Express, and MongoDB. I believe that web development is more than just writing code—it is about solving real problems and transforming ideas into functional, well-designed digital products. For this reason, I pay close attention to clean code, performance, user experience, and overall application structure in every project I build. Throughout my journey, I have worked on multiple hands-on projects that helped me strengthen my technical skills and gain a deeper understanding of full-stack development, from planning and development to deployment. I am constantly learning and exploring new technologies to improve my workflow and deliver better results. My goal is to continue building impactful digital solutions that provide real value to users and businesses, while consistently growing as a developer and maintaining a high standard of quality in everything I create.",

    "imageUrl": ""
  },
  "projects": {
    "homeTitle": "Works",
    "viewAllText": "View All ~~)",
    "pageTitle": "works",
    "pageSubtitle": "List of my works",
    "emptyText": "No Works"
  },
  "testimonials": {
    "title": "Testimonials",
    "emptyText": "No Testimonials",
    "pageTitle": "Client testimonials",
    "pageSubtitle": "Real feedback from people I have worked with.",
    "formTitle": "Leave a review",
    "formDescription": "Your review will appear publicly after approval.",
    "viewAllText": "View all testimonials",
    "addReviewText": "Leave a review",
    "submitText": "Submit review",
    "nameLabel": "Your name",
    "positionLabel": "Role or company",
    "ratingLabel": "Rating",
    "descriptionLabel": "Your review",
    "phoneLabel": "WhatsApp number (optional)",
    "websiteLabel": "Website URL (optional)",
    "websiteLinkText": "Visit website",
    "pendingMessage": "Thanks! Your review was sent for approval."
  },
  "skills": {
    "title": "Skills",
    "items": [
      {
        "title": "frontend",
        "skills": "html , css , javascript , react , tailwind , bootstrap"
      },
      {
        "title": "backend",
        "skills": "nodejs , express , mongodb , mongoose"
      },
      {
        "title": "languages",
        "skills": "english , Arabic"
      },
      {
        "title": "others",
        "skills": "communication , teamwork , problem solving, time management, learning new things, content creation"
      }
    ]
  },
  "contactSection": {
    "title": "contacts",
    "description": "I’m interested in freelance opportunities. However, if you have other request or question, don’t hesitate to contact me.",
    "buttonText": "Let's Talk ~~)"
  },
  "contactPage": {
    "title": "contacts",
    "subtitle": "Who am I ?",
    "description": "I’m interested in freelance opportunities. However, if you have other request or question, don’t hesitate to contact me.",
    "allMediaTitle": "All Media",
    "sendMessageTitle": "Send Message",
    "formFields": [
      "Name",
      "Email",
      "Message"
    ],
    "submitButtonText": "Send"
  },
  "socials": [
    {
      "platform": "facebook",
      "label": "Facebook",
      "url": "https://www.facebook.com/Youssef10Tarek/"
    },
    {
      "platform": "whatsapp",
      "label": "WhatsApp",
      "url": "https://wa.me/201200722824"
    },
    {
      "platform": "tiktok",
      "label": "TikTok",
      "url": "https://www.tiktok.com/@youssef_tarek.yt"
    },
    {
      "platform": "telegram",
      "label": "Telegram",
      "url": "https://t.me/yousseftarek_yt"
    },
    {
      "platform": "linkedin",
      "label": "LinkedIn",
      "url": "https://www.linkedin.com/in/youssef-tarek-mohammed"
    }
  ],
  "seo": {
    "title": "Youssef Tarek | MERN Stack Developer",
    "description": "Portfolio of Youssef Tarek, MERN Stack Developer building modern web applications.",
    "keywords": "Youssef Tarek, MERN Stack Developer, React, Node.js, MongoDB"
  }
};
const SiteContentContext = createContext({ content: defaults, loading: true, refresh: async () => {} });
export const useSiteContent = () => useContext(SiteContentContext);
export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/api/site-content`);
      if (response.data?.data?.content) {
        const remote = response.data.data.content;
        setContent((current) => ({
          ...current,
          ...remote,
          hero: { ...defaults.hero, ...(current.hero || {}), ...(remote.hero || {}) },
        }));
      }
    } catch (error) {
    } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    const favicon = content.site?.faviconUrl;
    if (favicon) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
      link.href = favicon; link.type = /\.svg(?:$|\?)/i.test(favicon) ? "image/svg+xml" : /\.png(?:$|\?)/i.test(favicon) ? "image/png" : "image/webp";
    }
    if (content.seo?.title) document.title = content.seo.title;
  }, [content.site?.faviconUrl, content.seo?.title]);
  return <SiteContentContext.Provider value={{ content, loading, refresh, setContent }}>{children}</SiteContentContext.Provider>;
};
export { defaults as defaultSiteContent };
