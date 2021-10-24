// import models
const { Item } = require("../models/index");

// import logger
const logger = require("../utils/winston");

// get item function
const getItems = async (req, res) => {
  logger.info("[CALLED GET ITEMS FUNCTION]");
  // get the query params
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;

  // fetch the data logic
  try {
    // start the function timer
    console.time();

    /**
     * 1) Fetch items with pagination depending on the page and limit query params
     * 2) sort them desc with the "profitability" property
     * 3) remove the (_id,__v) field from the selection
     */
    let items = await Item.find()
      .skip(page * limit - limit)
      .limit(limit)
      .sort({ profitability: -1 })
      .select("-_id -__v -profitability");

    // get the total items count
    let total_items = await Item.countDocuments();

    // log the end of the function time
    console.timeEnd();

    // check for the next page existing
    let next_page = page * limit < total_items;

    // calculate the total_pages
    const total_pages = Math.round(total_items / limit);

    return res.status(200).json({
      items,
      total_items,
      total_pages,
      next_page,
      current_page: page,
    });
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};

module.exports = {
  getItems,
};
