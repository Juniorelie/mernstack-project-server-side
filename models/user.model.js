const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); //to check if email already exist

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 8 },
        image: { type: String },
        places: [{
			type: Schema.Types.ObjectId,
			ref: "Place",
			required: true,
		}],
    },
    { timestamps: true }
);

userSchema.plugin(uniqueValidator);

const User = model("User", userSchema)
module.exports = User;