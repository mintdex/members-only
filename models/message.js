const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxlength: 100 },
    timestamp: { type: Date, default: Date.now },
    text: { type: String }

});

MessageSchema
    .virtual("relative_time")
    .get(function () {
        return DateTime.fromJSDate(this.timestamp).toRelative();
    })

// Export module
module.exports = mongoose.model("Message", MessageSchema);