const mongosoe = require("mongoose");

const ReplyCountProfitabilitySchema = mongosoe.Schema({
  count: {
    type: Number,
  },
  total: {
    type: Number,
  },
  sum: {
    type: Number,
  },
});

const ReplyCountProfitability = mongosoe.model(
  "ReplyCountProfitability",
  ReplyCountProfitabilitySchema
);

module.exports = ReplyCountProfitability;
