import { Router } from "express";
import { ContactPage } from "../models/index.js";
import { requireAdmin } from "../middleware/auth.js";

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

// GET PUBLIC CONTACT PAGE
router.get("/contact", async (req, res, next) => {
  try {
    const page = await ContactPage.findOne({
      pageKey: "contact",
      isPublished: true,
    }).lean();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Contact page is not available.",
      });
    }

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

    for (const field of ALLOWED_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
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

   if (
  updates.hero &&
  typeof updates.hero === "object" &&
  !Array.isArray(updates.hero)
) {
  const nextImage =
    updates.hero.image ?? updates.hero.backgroundImage ?? "/Images/contact.webp";
  updates["hero.image"] = nextImage;
  updates["hero.backgroundImage"] = nextImage;
}

    // if (
    //   updates.hero &&
    //   typeof updates.hero === "object" &&
    //   !Array.isArray(updates.hero)
    // ) {
    //   updates["hero.image"] = updates.hero.image ?? "";
    // }

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
