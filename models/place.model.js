const { Schema, model, default: mongoose } = require("mongoose");

const placeSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        address: { type: String, required: true },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true}
        },
        creator: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
    },
    { timestamps: true }
);

const Place = model("Place", placeSchema);
module.exports = Place;