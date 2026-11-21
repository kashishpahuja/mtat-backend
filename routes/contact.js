
import { Router } from "express";
import { ContactPage } from "../models/index.js";
import { requireAdmin } from "../middleware/auth.js";
import nodemailer from "nodemailer";

const MAIL_USER = process.env.MAIL_USER?.trim();
const MAIL_PASS = process.env.MAIL_PASS?.trim();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT || 465),
  secure: Number(process.env.MAIL_PORT || 465) === 465,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });


const router = Router();

const DEFAULT_PAGE = {
  pageKey: "contact",
};

const ALLOWED_FIELDS = [
  "hero",
  "contactInfo",
  "quickLinks",
  "socials",
  "enquiry",
  "map",
  "isPublished",
];

// SUBMIT CONTACT ENQUIRY AND SEND EMAIL
router.post("/contact/enquiry", async (req, res) => {
  try {
    // Check SMTP configuration
    if (!MAIL_USER || !MAIL_PASS) {
      console.error("SMTP CONFIG ERROR: MAIL_USER or MAIL_PASS is missing");

      return res.status(500).json({
        success: false,
        message: "Email service is not configured. Please contact us directly.",
      });
    }

    const { name, email, phone, message } = req.body || {};

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = String(phone || "").trim();
    const cleanMessage = message.trim();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (
      cleanName.length > 150 ||
      cleanEmail.length > 254 ||
      cleanPhone.length > 30 ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "Submitted information exceeds the allowed length.",
      });
    }

    // Get the recipient saved by the admin panel
    const contactPage = await ContactPage.findOne({
      pageKey: "contact",
      isPublished: true,
    }).select("enquiry.recipientEmail");

    if (!contactPage) {
      return res.status(404).json({
        success: false,
        message: "Contact form is currently unavailable.",
      });
    }

    const recipientEmail = contactPage.enquiry?.recipientEmail
      ?.trim()
      .toLowerCase();

    if (!recipientEmail || !emailRegex.test(recipientEmail)) {
      console.error(
        "CONTACT EMAIL ERROR: Invalid recipient in database:",
        recipientEmail
      );

      return res.status(500).json({
        success: false,
        message: "Enquiry recipient email is not configured correctly.",
      });
    }

    // Send FROM the fixed MTAT email TO the admin-configured recipient
    const mailOptions = {
      from: {
        name: "MTAT Technologies",
        address: MAIL_USER,
      },

      to: recipientEmail,

      replyTo: {
        name: cleanName,
        address: cleanEmail,
      },

      subject: `New Website Enquiry - ${cleanName}`,

      text: `
New enquiry received from the MTAT Technologies website.

Name: ${cleanName}
Email: ${cleanEmail}
Phone: ${cleanPhone || "Not provided"}

Message:
${cleanMessage}
      `,

      html: `
        <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#01193B;padding:25px;color:white;">
            <h2 style="margin:0;">New Website Enquiry</h2>
            <p style="margin:8px 0 0;color:#dbeafe;">MTAT Technologies</p>
          </div>

          <div style="padding:25px;color:#334155;">
            <p>You have received a new enquiry through your website.</p>

            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">Name</td>
                <td style="padding:12px;border-bottom:1px solid #eee;">${escapeHtml(cleanName)}</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">Email</td>
                <td style="padding:12px;border-bottom:1px solid #eee;">${escapeHtml(cleanEmail)}</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td>
                <td style="padding:12px;border-bottom:1px solid #eee;">${escapeHtml(cleanPhone || "Not provided")}</td>
              </tr>
            </table>

            <h3 style="margin-top:25px;color:#01193B;">Message / Requirements</h3>

            <div style="background:#f8fafc;padding:18px;border-radius:8px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</div>

            <p style="margin-top:25px;font-size:13px;color:#64748b;">
              You can reply directly to this email to respond to ${escapeHtml(cleanName)}.
            </p>
          </div>

          <div style="background:#f1f5f9;padding:15px;text-align:center;font-size:12px;color:#64748b;">
            Automatically generated from the MTAT Technologies website.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("CONTACT ENQUIRY EMAIL SENT:", {
      messageId: info.messageId,
      from: MAIL_USER,
      to: recipientEmail,
    });

    return res.status(200).json({
      success: true,
      message: "Your enquiry has been submitted successfully.",
    });
  } catch (error) {
    // Log the actual SMTP / database error in the backend terminal
    console.error("CONTACT ENQUIRY EMAIL ERROR:", {
      message: error.message,
      code: error.code,
      response: error.response,
      command: error.command,
    });

    return res.status(500).json({
      success: false,
      message: "Unable to send your enquiry. Please try again later.",
    });
  }
});


// GET PUBLIC CONTACT PAGE
router.get("/contact", async (req, res, next) => {
  try {
   const page = await ContactPage.findOne({
  pageKey: "contact",
  isPublished: true,
})
  .select("-enquiry.recipientEmail")
  .lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Contact page is not available.",
      });
    }

    // Keep both image fields compatible.
    const image =
      page.hero?.image ||
      page.hero?.backgroundImage ||
      "/Images/contact.webp";

    page.hero = {
      ...page.hero,
      image,
      backgroundImage: image,
    };

    res.set("Cache-Control", "no-store");

    return res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
});

// GET CONTACT PAGE FOR ADMIN
router.get("/contact/admin", requireAdmin, async (req, res, next) => {
  try {
    let page = await ContactPage.findOne({
      pageKey: "contact",
    });

    if (!page) {
      page = await ContactPage.create(DEFAULT_PAGE);
    }

    return res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE CONTACT PAGE
router.put("/contact/admin", requireAdmin, async (req, res, next) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact page data.",
      });
    }

    const updates = {};

    // Only accept allowed fields.
    for (const field of ALLOWED_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field];
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No valid contact page fields provided.",
      });
    }

    if (
      Object.prototype.hasOwnProperty.call(updates, "isPublished") &&
      typeof updates.isPublished !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid publication status.",
      });
    }

    // Validate and normalize hero image.
    if (updates.hero !== undefined) {
      if (
        !updates.hero ||
        typeof updates.hero !== "object" ||
        Array.isArray(updates.hero)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid hero section data.",
        });
      }

      const hero = { ...updates.hero };

      const image =
        hero.image ||
        hero.backgroundImage;

      if (typeof image === "string" && image.trim()) {
        hero.image = image.trim();
        hero.backgroundImage = image.trim();
      }

      // Do not allow empty image values to overwrite existing images.
      else {
        delete hero.image;
        delete hero.backgroundImage;
      }

      // Use nested paths only. Do not mix $set hero and $set hero.image.
      delete updates.hero;

      for (const [key, value] of Object.entries(hero)) {
        updates[`hero.${key}`] = value;
      }
    }

    const page = await ContactPage.findOneAndUpdate(
      { pageKey: "contact" },
      { $set: updates },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      success: true,
      message: "Contact page updated successfully.",
      data: page,
    });
  } catch (error) {
    next(error);
  }
});

export default router;



// import { Router } from "express";
// import { ContactPage } from "../models/index.js";
// import { requireAdmin } from "../middleware/auth.js";

// const router = Router();

// const DEFAULT_PAGE = {
//   pageKey: "contact",
// };

// // GET PUBLIC CONTACT PAGE
// router.get("/contact", async (req, res, next) => {
//   try {
//     const page = await ContactPage.findOne({
//       pageKey: "contact",
//       isPublished: true,
//     }).lean();

//     if (!page) {
//       return res.status(404).json({
//         success: false,
//         message: "Contact page is not available.",
//       });
//     }

//     return res.json({
//       success: true,
//       data: page,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // GET CONTACT PAGE FOR ADMIN
// router.get(
//   "/contact/admin",
//   requireAdmin,
//   async (req, res, next) => {
//     try {
//       let page = await ContactPage.findOne({
//         pageKey: "contact",
//       });

//       if (!page) {
//         page = await ContactPage.create(DEFAULT_PAGE);
//       }

//       return res.json({
//         success: true,
//         data: page,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// // UPDATE CONTACT PAGE
// router.put(
//   "/contact/admin",
//   requireAdmin,
//   async (req, res, next) => {
//     try {
//     //   const updates = req.body;

//     //   if (
//     //     !updates ||
//     //     typeof updates !== "object" ||
//     //     Array.isArray(updates)
//     //   ) {
//     //     return res.status(400).json({
//     //       success: false,
//     //       message: "Invalid contact page data.",
//     //     });
//     //   }

//     //   // Never allow clients to modify system fields.
//     //   delete updates._id;
//     //   delete updates.__v;
//     //   delete updates.pageKey;
//     //   delete updates.createdAt;
//     //   delete updates.updatedAt;
//     //     const allowedFields = [
//     //     "hero",
//     //     "contactInfo",
//     //     "quickLinks",
//     //     "socials",
//     //     "enquiry",
//     //     "map",
//     //     "isPublished",
//     //     ];

//         const updates = {};

//         for (const field of allowedFields) {
//         if (Object.prototype.hasOwnProperty.call(req.body, field)) {
//             updates[field] = req.body[field];
//         }
//         }

//         if (Object.keys(updates).length === 0) {
//         return res.status(400).json({
//         success: false,
//         message: "No valid contact page fields provided.",
//         });
//         }

//         if (
//         Object.prototype.hasOwnProperty.call(updates, "isPublished") &&
//         typeof updates.isPublished !== "boolean"
//         ) {
//         return res.status(400).json({
//         success: false,
//         message: "Invalid publication status.",
//         });
//         }



//       const page = await ContactPage.findOneAndUpdate(
//         { pageKey: "contact" },
//         { $set: updates },
//         {
//           new: true,
//           upsert: true,
//           runValidators: true,
//           setDefaultsOnInsert: true,
//         }
//       );

//       return res.json({
//         success: true,
//         message: "Contact page updated successfully.",
//         data: page,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// export default router;
