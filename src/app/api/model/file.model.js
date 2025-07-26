

import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
   
    s3Key: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    contentType: {
        type: String,
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
},{
    timestamps: true,
})

const File = mongoose.models.File || mongoose.model("File", fileSchema)

export default File;