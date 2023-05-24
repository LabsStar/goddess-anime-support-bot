import { Schema } from "mongoose";
import mongoose from "mongoose";


const TicketsSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },

    channelId: {
        type: String,
        required: true,
    },

    authorId: {
        type: String,
        required: true,
    },

    ticketId: {
        type: String,
        required: true,
    },

    open: {
        type: Boolean,
        required: true,
    },

    members: {
        type: Array,
        required: true,
    },

    category: {
        type: String,
        required: true,
        default: "other",
    },

    messages: {
        type: Array,
        required: true,
    },

    
}, { timestamps: true });

export default mongoose.model("Tickets", TicketsSchema);