const mongoose = require("mongoose");

// define the item schema
const ItemSchema = mongoose.Schema({
  threadId: { type: String },
  threadTitle: { type: String },
  threadUrl: { type: String },
  profileUrl: { type: String },
  avatarUrl: { type: String },
  userName: { type: String },
  replyCount: { type: Number },
  viewCount: { type: Number },
  articleHTML: { type: String },
  articleText: { type: String },
  threadProperties: [{ type: String }],
  type: { type: String },
  currency: { type: String },
  shipping_destinations: { type: String },
  price: { type: Number },
  priceInUsd: { type: Number },
  profitability: { type: Number },
  profitability_percentage: { type: String },
});

// create the item model in the data base with assossiated Schema
const Item = mongoose.model("item", ItemSchema);

module.exports = Item;
