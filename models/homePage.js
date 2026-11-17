
import mongoose from "mongoose";

const { Schema } = mongoose;

const HomePageSchema = new Schema(
  {
    key: {
      type: String,
      default: "home",
      unique: true,
      immutable: true,
    },

    // Hero banner
    hero: {
      type: Schema.Types.Mixed,
      default: () => ({
        heading: "Advance Machine Tools & Industrial Solutions",
        description:
          "MTAT Technologies delivers advanced machine tools, precision machining technologies and industrial manufacturing solutions to help businesses enhance productivity, improve accuracy and build stronger manufacturing capabilities.",
        buttonText: "Explore Our Solutions",
        buttonLink: "/products",
        video: "/video/mtat1.mp4",
        overlayOpacity: 80,
        enabled: true,
      }),
    },

    // Services section
    services: {
      type: Schema.Types.Mixed,
      default: () => ({
        eyebrow: "OUR EXPERTISE",
        heading: "Complete Manufacturing Solutions.",
        highlightedHeading: "Precision at Every Step.",
        headingLinkText: "Explore Our Solutions",
        headingLink: "#all-services",
        description: [
          "MTAT Technologies brings together advanced machine tools, industrial machinery and precision measurement technologies to support the evolving needs of modern manufacturing.",
          "From metal cutting and sheet metal processing to tool room equipment and metrology, we connect businesses with established technology partners and solutions designed to enhance accuracy, productivity and operational efficiency. With a customer-focused approach and a commitment to dependable support, we help manufacturers identify the right technologies for their production requirements.",
        ],
        items: [
          {
            title: "01. Metal Cutting Solutions",
            description:
              "Explore advanced CNC turning centres, machining centres, multi-axis machines and gear-hobbing solutions for precision machining applications.",
            image:
              "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=800&q=80",
            href: "/products/metal-cutting",
            buttonText: "Explore Metal Cutting",
          },
          {
            title: "02. Metal Forming Solutions",
            description:
              "Discover press brakes, power presses, hydraulic presses and sheet metal processing technologies for industrial forming applications.",
            image:
              "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
            href: "/products/metal-forming",
            buttonText: "Explore Metal Forming",
          },
          {
            title: "03. Precision Metrology",
            description:
              "Explore dimensional measurement and inspection solutions, including coordinate measuring machines, optical measuring systems and portable measuring arms.",
            image:
              "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=800&q=80",
            href: "/products/metrology",
            buttonText: "Explore Metrology",
          },
          {
            title: "04. Tool Room Solutions",
            description:
              "Discover specialised machinery for precision tooling and finishing, including EDM, wire EDM, surface grinding and cylindrical grinding solutions.",
            image:
              "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
            href: "/products/tool-room-accessories",
            buttonText: "Explore Tool Room Solutions",
          },
          {
            title: "05. Machine Selection & Supply",
            description:
              "Explore machine options from our product portfolio with assistance in identifying equipment suited to your production requirements and applications.",
            image:
              "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=800&q=80",
            href: "/contact",
            buttonText: "Enquire About Machinery",
          },
          {
            title: "06. Service & Spares Support",
            description:
              "Connect with our team for service assistance and spare-parts enquiries for supported machines and brands.",
            image:
              "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
            href: "/contact",
            buttonText: "Get Support",
          },
        ],
      }),
    },

    // Company story, introduction video and partner logos
    companyStory: {
      type: Schema.Types.Mixed,
      default: () => ({
        eyebrow: "Our Story Since 1995",
        heading: "Three Decades of",
        highlightedHeading: "Engineering Progress.",
        introduction:
          "Established in Ludhiana, Punjab, in 1995, MTAT Technologies began with a vision to connect manufacturing businesses with dependable machine tools and practical engineering solutions.",
        description:
          "From an initial team of two professionals, we have grown into an organisation of approximately 60 professionals, developing our technology portfolio, strengthening industry partnerships and expanding our customer support capabilities. Today, we continue to support manufacturing businesses with advanced machinery, application-oriented guidance and a commitment to long-term relationships.",
        buttonText: "Discover Our Journey",
        buttonLink: "/about",
        video: "/video/intro1.mp4",
        videoPoster: "/Images/company-video-poster.webp",
        videoCaption:
          "From precision machining to advanced manufacturing technologies, we connect industrial expertise with solutions built for progress.",
        partnersHeading: "Our Technology Partners",
        partnersSubheading:
          "Global Technology. Trusted Expertise. Local Support.",
        partners: [
          { name: "Jyoti CNC", logo: "/Images/brands/jyoti.webp" },
          { name: "EIFCO", logo: "/Images/brands/eifco.webp" },
          { name: "Energy Mission", logo: "/Images/brands/energymission.webp" },
          { name: "Hexagon", logo: "/Images/brands/hexagon.webp" },
          { name: "Sodick", logo: "/Images/brands/sodick.webp" },
          { name: "Pinnacle", logo: "/Images/brands/pinnacle.webp" },
          { name: "Sukrit", logo: "/Images/brands/sukrit.webp" },
          { name: "Kiya", logo: "/Images/brands/kiya.webp" },
        ],
      }),
    },

    // Why choose MTAT section
    whyUs: {
      type: Schema.Types.Mixed,
      default: () => ({
        eyebrow: "Why MTAT",
        heading: "Precision. Partnership. Progress.",
        description:
          "The right technology. Expert guidance. Reliable support. MTAT helps businesses make informed manufacturing decisions with confidence.",
        backgroundImage: "/Images/banner.webp",
        strengths: [
          {
            number: "01",
            title: "Precision",
            description:
              "Advanced machine-tool technologies for accuracy and reliable manufacturing performance.",
            icon: "industry",
          },
          {
            number: "02",
            title: "Partnership",
            description:
              "Strong technology partnerships built on trust, expertise, and shared growth.",
            icon: "handshake",
          },
          {
            number: "03",
            title: "Expertise",
            description:
              "The right machinery and technology for diverse industrial applications.",
            icon: "cogs",
          },
          {
            number: "04",
            title: "Progress",
            description:
              "Responsive on-ground support to keep businesses moving forward.",
            icon: "headset",
          },
        ],
        leftImages: [
          {
            image:
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80",
            alt: "Industrial manufacturing",
          },
          {
            image:
              "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=500&q=80",
            alt: "Machine tools",
          },
          {
            image:
              "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=500&q=80",
            alt: "Engineering technology",
          },
          {
            image:
              "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=500&q=80",
            alt: "Industrial workshop",
          },
        ],
        rightImages: [
          {
            image:
              "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=500&q=80",
            alt: "Manufacturing facility",
          },
          {
            image:
              "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
            alt: "Industrial facility",
          },
          {
            image:
              "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=500&q=80",
            alt: "Industrial machinery",
          },
        ],
        closingLine1: "Technology you can trust.",
        closingLine2: "Relationships built for the long term.",
      }),
    },

    // Testimonials heading/settings.
    // Actual testimonial entries remain in the existing Testimonial collection.
    testimonialsSection: {
      type: Schema.Types.Mixed,
      default: () => ({
        enabled: true,
        eyebrow: "Client Success Stories",
        heading: "Trusted by Leaders in",
        highlightedHeading: "Precision Engineering",
        description:
          "Hear how our high-performance CNC machinery, robust tooling, and dedicated support empower manufacturing excellence across industries.",
      }),
    },

    // Bottom enquiry CTA
    enquiry: {
      type: Schema.Types.Mixed,
      default: () => ({
        eyebrow: "Let's Talk Manufacturing",
        heading: "Looking for the Right Machine?",
        description:
          "Explore precision machine tools and manufacturing technologies suited to your production needs. Connect with our team to discuss your requirements and find the right solution for your business.",
        buttonText: "Enquire Now",
        buttonLink: "/contact",
        backgroundImage: "/Images/banner.webp",
        enabled: true,
      }),
    },
  },
  { timestamps: true, minimize: false }
);

export const HomePage =
  mongoose.models.HomePage ||
  mongoose.model("HomePage", HomePageSchema);
