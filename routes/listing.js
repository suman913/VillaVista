const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
let listtingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listtingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listtingController.createListing));
    //new route
router.get("/new", isLoggedIn, wrapAsync(listtingController.rendernewForm));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listtingController.rendereditForm));

router.route("/:id")
    .get(wrapAsync(listtingController.showsallListings))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listtingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listtingController.destroyListing))


module.exports = router;

 





