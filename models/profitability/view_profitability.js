const mongosoe = require("mongoose");

const ViewCountProfitabilitySchema = mongosoe.Schema({
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

const ViewCountProfitability = mongosoe.model(
  "ViewCountProfitability",
  ViewCountProfitabilitySchema
);

module.exports = ViewCountProfitability;
