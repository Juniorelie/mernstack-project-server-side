const HttpError = require("../models/error");

const getAddressCoordinates = require("../utility/location");

const Place = require("../models/place.model");
const User = require("../models/user.model"); //To create a place and add it to users
const { default: mongoose } = require("mongoose");


async function getPlaceById(req, res, next) {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find a place.", 500
        ); //Error in case get request has some problem, e.g missing information
        return next(error); 
    }
    

    if (!place) {
        const error = new HttpError(
            "Could not find a place for the provided id.", 
            404
        );
        return next(error);
    } //Error in case the place Id doesn't exist in db

    res.json({ place: place.toObject( {getters: true }) });
};

async function getPlacesByUserId(req, res, next) {
    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find the place by user id",
            500
        );
        return next(error);
    }
    

    if (!places || places.length === 0) {
        return next(
            new HttpError("Could not find places for the provided user id.", 404)
        );
    }

    res.json({ places: places.map(place => place.toObject( {getters: true })) });
}

async function createPlace(req, res, next) {
    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getAddressCoordinates(address);
    } catch(error) {
        return next(error);
    }
    
    const createdPlace = new Place ({
        title,
        description,
        address,
        location: coordinates,
        image: "https://cdn.getyourguide.com/img/tour/64a7d3161db5e.jpeg/145.jpg",
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            "Creating place failed, please try again",
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError("Could not find user for provided id", 404);
        return next (error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Creating place failed, please try again.",
            500
        )
        return next(error);
    }

    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError(
            "Creating place failed, please try again.", 500
        );
        return next(error);
    }

    res.status(201).json({place: createdPlace});
}

async function updatePlace(req, res, next) {
    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err){
        const error = new HttpError(
            "Error while updating the place, please try again",
            500
        );
        return next(error);
    }
    
    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            "Error while updating the place, please try again",
            500
        )
        return next(error);
    }

    res.status(200).json({place: place.toObject({ getters: true })})
};

async function deletePlace(req, res, next) {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findOneAndDelete({ _id: placeId}).populate("creator");
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete the place",
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError("Could not find place for this id", 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete place.", 
            500
        );
        return next(error);
    }

    res.status(204).json({message: "Place deleted"});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;