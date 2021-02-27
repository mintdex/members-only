const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const saltRounds = 10;

const UserSchema = new Schema({
    full_name: {type: String, required: true, maxlength: 100 },
    username: {type: String, required: true},
    password: {type: String, required: true},
    membership_status: {type: Boolean, default: false},
    is_admin: {type: Boolean, default: false}
});

// Hash password
UserSchema.methods.generateHash = async (password) => {
    return await bcrypt.hash(password, saltRounds);
}

// Check password
UserSchema.methods.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// Export module
module.exports = mongoose.model("User", UserSchema);