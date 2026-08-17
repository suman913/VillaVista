const listings = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;

const DEFAULT_IMAGE = {
    url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    filename: "default-villa",
};

const DEFAULT_GEOMETRY = {
    type: "Point",
    coordinates: [77.209, 28.6139],
};

async function getGeometry(location) {
    if (!geocodingClient || !location) {
        return DEFAULT_GEOMETRY;
    }

    const response = await geocodingClient.forwardGeocode({
        query: location,
        limit: 1,
    }).send();

    return response.body.features[0]?.geometry || DEFAULT_GEOMETRY;
}




module.exports.index = async (req, res) => {
    const allListing = await listings.find({});
    res.render("../views/listings/index.ejs", { allListing });
}


module.exports.rendernewForm = async (req, res) => {
    res.render("listings/form.ejs");
};


module.exports.showsallListings = async (req, res) => {
    let { id } = req.params;
    const listing = await listings.findById(id).populate({ path: "reviews", populate: { path: "author", } }).populate("owner");
    if (!listing) {
        req.flash("error", " Listing you are requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("../views/listings/show.ejs", { listing });
}

module.exports.rendereditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await listings.findById(id);
    if (!listing) {
        req.flash("error", " Listing you are requested for does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image?.url || DEFAULT_IMAGE.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150,h_100");
    res.render("../views/listings/edit.ejs", { listing, originalImageUrl });
}


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await listings.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

    if (req.file) {
        let url = req.file.path || `/uploads/${req.file.filename}`;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    listing.geometry = await getGeometry(listing.location);
    await listing.save();
    req.flash("success", " listing update successfully");
    res.redirect("/listings");
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await listings.findByIdAndDelete(id);
    req.flash("success", " listing Deleted");
    res.redirect("/listings");
}

module.exports.createListing = async (req, res, next) => {
    let image = DEFAULT_IMAGE;
    if (req.file) {
        image = {
            url: req.file.path || `/uploads/${req.file.filename}`,
            filename: req.file.filename,
        };
    }

    let Listing = await new listings(req.body.listing);
    Listing.owner = req.user._id;
    Listing.image = image;
    Listing.geometry = await getGeometry(req.body.listing.location);

    await Listing.save();
    req.flash("success", "new listing successfully created");
    res.redirect("/listings");
}
