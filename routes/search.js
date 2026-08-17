const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const listings = require("../models/listing");

router.post("/", wrapAsync(async(req,res)=>{
    const nameQuery = (req.body.search || "").trim();
    const results = nameQuery
        ? await listings.find({
            $or: [
                { location: new RegExp(nameQuery, "i") },
                { title: new RegExp(nameQuery, "i") },
                { country: new RegExp(nameQuery, "i") },
                { category: new RegExp(nameQuery, "i") },
            ],
        })
        : [];

    res.render("../views/listings/search.ejs", { results });
}));




module.exports = router;
