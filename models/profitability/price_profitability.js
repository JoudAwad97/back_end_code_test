const mongosoe = require("mongoose");

const PriceSchema = mongosoe.Schema({
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

const PriceProfitability = mongosoe.model("PriceProfitability", PriceSchema);

module.exports = PriceProfitability;
