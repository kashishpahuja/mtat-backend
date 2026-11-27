
import mongoose from "mongoose";

export const getDefaultAboutContent = () => ({
  seo: {
    title: "About MTAT Technologies | Machine Tools & Industrial Solutions",
    description:
      "Discover MTAT Technologies, established in 1995. Your trusted partner for advanced machine tools, precision engineering technologies and industrial solutions.",
    ogTitle: "About MTAT Technologies",
    ogDescription:
      "The Solution Providers — delivering machine tools, technology and industrial support since 1995.",
  },

  hero: {
    company: "MTAT TECHNOLOGIES",
    title: "The Solution Providers",
    tagline:
      "Global Technology. Trusted Expertise. Local Support.",
    image: {
      url: "/Images/about/hero.webp",
      alt: "MTAT Technologies industrial machine tools and manufacturing solutions",
    },
    scrollHint: "SCROLL TO EXPLORE",
  },

  intro: {
    label: "WHO WE ARE",
    heading: "Engineering Progress Through Technology",
    paragraphs: [
      "Established in 1995, MTAT Technologies Private Limited is a machine tools and industrial solutions company based in Ludhiana, Punjab.",
      "With a team of approximately 60 professionals, we work with manufacturing businesses to connect them with advanced machinery, precision technologies and dependable industrial solutions.",
      "Our role goes beyond supplying machinery. We support customers through sales consultation, application support, installation coordination, training, after-sales service, maintenance and spare parts assistance.",
    ],
    image: {
      url: "/Images/about/company.webp",
      alt: "MTAT Technologies team and industrial solutions",
    },
    caption: "Supporting manufacturing excellence since 1995",
  },

  timeline: {
    label: "OUR JOURNEY",
    heading: "Built on Experience. Driven by Progress.",
    description:
      "Our journey reflects a continued commitment to industrial technology, customer support and manufacturing progress.",
    milestones: [
      {
        year: "1995",
        title: "The Beginning",
        description:
          "MTAT Technologies began its journey with a focus on machine tools and industrial solutions.",
      },
      {
        year: "Today",
        title: "A Growing Team",
        description:
          "A team of approximately 60 professionals works across technology solutions and customer support.",
      },
      {
        year: "Today",
        title: "Complete Customer Support",
        description:
          "Our support extends from machine selection and application guidance to installation coordination, training, maintenance and spare parts.",
      },
    ],
  },

  expertise: {
    label: "WHAT WE DO",
    heading: "Technology Across Every Stage of Manufacturing",
    intro:
      "We bring together machinery, precision technologies and application support to help manufacturers improve productivity and machining capabilities.",
    items: [
      {
        title: "Metal Cutting Solutions",
        description:
          "Advanced machining solutions for accurate, efficient and reliable metal cutting operations.",
        image: {
          url: "/Images/about/metal-cutting.webp",
          alt: "Metal cutting machine tools",
        },
      },
      {
        title: "Metal Forming Solutions",
        description:
          "Industrial machinery for sheet metal processing, forming and fabrication applications.",
        image: {
          url: "/Images/about/metal-forming.webp",
          alt: "Metal forming machinery",
        },
      },
      {
        title: "Precision Metrology",
        description:
          "Measurement and inspection technologies that support dimensional accuracy and quality control.",
        image: {
          url: "/Images/about/metrology.webp",
          alt: "Precision measurement and metrology equipment",
        },
      },
      {
        title: "Tool Room Machinery",
        description:
          "Machinery and equipment for tooling, precision machining and specialised manufacturing applications.",
        image: {
          url: "/Images/about/tool-room.webp",
          alt: "Tool room machinery",
        },
      },
      {
        title: "Application Support",
        description:
          "Consultation and application guidance to help customers identify suitable machinery and technology.",
        image: {
          url: "/Images/about/application-support.webp",
          alt: "Industrial machine application support",
        },
      },
      {
        title: "After-Sales Support",
        description:
          "Installation coordination, training, maintenance and spare parts assistance throughout the customer journey.",
        image: {
          url: "/Images/about/after-sales.webp",
          alt: "Industrial machinery maintenance and support",
        },
      },
    ],
  },

  partners: {
    label: "OUR TECHNOLOGY PARTNERS",
    description:
      "We work with established technology brands to bring advanced machinery and manufacturing solutions to our customers.",
    logos: [
      {
        name: "Jyoti",
        image: "/Images/brands/jyoti.webp",
        alt: "Jyoti Machine Tools",
        link: "",
      },
      {
        name: "EIFCO",
        image: "/Images/brands/eifco.webp",
        alt: "EIFCO Machine Tools",
        link: "",
      },
      {
        name: "Energy Mission",
        image: "/Images/brands/energymission.webp",
        alt: "Energy Mission",
        link: "",
      },
      {
        name: "Hexagon",
        image: "/Images/brands/hexagon.webp",
        alt: "Hexagon Metrology",
        link: "",
      },
      {
        name: "Sodick",
        image: "/Images/brands/sodick.webp",
        alt: "Sodick",
        link: "",
      },
      {
        name: "Pinnacle",
        image: "/Images/brands/pinnacle.webp",
        alt: "Pinnacle Machine Tools",
        link: "",
      },
      {
        name: "Sukrit",
        image: "/Images/brands/sukrit.webp",
        alt: "Sukrit",
        link: "",
      },
      {
        name: "Kiya",
        image: "/Images/brands/kiya.webp",
        alt: "Kiya Machine Tools",
        link: "",
      },
    ],
  },

  industries: {
    label: "INDUSTRIES WE SUPPORT",
    heading: "Supporting Diverse Manufacturing Requirements",
    intro:
      "Our machinery and technology solutions cater to a range of machining, fabrication, tooling and precision measurement requirements.",
    items: [
      {
        title: "Automotive Manufacturing",
        description:
          "Machining and measurement solutions for automotive manufacturing requirements.",
        image: {
          url: "/Images/about/automotive.webp",
          alt: "Automotive manufacturing",
        },
      },
      {
        title: "General Engineering",
        description:
          "Machine tools and manufacturing technologies for engineering applications.",
        image: {
          url: "/Images/about/engineering.webp",
          alt: "General engineering",
        },
      },
      {
        title: "Fabrication & Sheet Metal",
        description:
          "Metal forming and processing technologies for fabrication requirements.",
        image: {
          url: "/Images/about/fabrication.webp",
          alt: "Sheet metal fabrication",
        },
      },
      {
        title: "Tool Rooms & Precision Machining",
        description:
          "Machinery and technologies for tooling, precision machining and inspection.",
        image: {
          url: "/Images/about/tool-room-industry.webp",
          alt: "Tool room and precision machining",
        },
      },
    ],
  },

  cta: {
    eyebrow: "LET'S BUILD SOMETHING BETTER",
    title: "Looking for the Right Manufacturing Solution?",
    description:
      "Connect with MTAT Technologies to explore machinery, technology and industrial solutions suited to your requirements.",
    buttonText: "Enquire Now",
    buttonLink: "/contact",
    backgroundImage: {
      url: "/Images/banner.webp",
      alt: "Industrial manufacturing solutions",
    },
  },
});

const aboutPageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "about",
      unique: true,
      immutable: true,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: getDefaultAboutContent,
    },

    published: {
      type: Boolean,
      default: false,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const AboutPage =
  mongoose.models.AboutPage ||
  mongoose.model("AboutPage", aboutPageSchema);

export default AboutPage;




// import mongoose from "mongoose";

// const aboutPageSchema = new mongoose.Schema(
//   {
//     key: {
//       type: String,
//       default: "about",
//       unique: true,
//       immutable: true,
//     },

//     content: {
//       type: mongoose.Schema.Types.Mixed,
//       required: true,
//       default: () => ({
//         seo: {
//           title: "",
//           description: "",
//           ogTitle: "",
//           ogDescription: "",
//         },

//         hero: {
//           company: "",
//           title: "",
//           tagline: "",
//           image: { url: "", alt: "" },
//           scrollHint: "SCROLL TO EXPLORE",
//         },

//         intro: {
//           label: "",
//           heading: "",
//           paragraphs: [],
//           image: { url: "", alt: "" },
//           caption: "",
//         },

//         timeline: {
//           label: "",
//           heading: "",
//           description: "",
//           milestones: [],
//         },

//         expertise: {
//           label: "",
//           heading: "",
//           intro: "",
//           items: [],
//         },

//         partners: {
//           label: "Our Technology Partners",
//           description: "",
//           logos: [],
//         },

//         industries: {
//           label: "",
//           heading: "",
//           intro: "",
//           items: [],
//         },

//         cta: {
//           eyebrow: "",
//           title: "",
//           description: "",
//           buttonText: "Enquire Now",
//           buttonLink: "/contact",
//           backgroundImage: { url: "", alt: "" },
//         },
//       }),
//     },

//     published: {
//       type: Boolean,
//       default: false,
//     },

//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//     minimize: false,
//   }
// );

// export const AboutPage =
//   mongoose.models.AboutPage ||
//   mongoose.model("AboutPage", aboutPageSchema);

// export default AboutPage;
