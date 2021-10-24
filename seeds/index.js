// import the app data
require("../app");

// import the JSON data file
const Data = require("../data/threads.json");
// import the models
const {
  Item,
  PriceProfitability,
  ReplyProfitability,
  ViewProfitability,
} = require("../models/index");

// import logger to log messages to user
const logger = require("../utils/winston");

// import helper functions
const { calculateNewState, calculatePointSystem } = require("../helper/index");

/**
 * class that is responsible of converting the JSON data to the database
 */
class Analyse {
  constructor() {
    this.prices = { count: 0, total: 0, sum: 0 };
    this.replies = { count: 0, total: 0, sum: 0 };
    this.views = { count: 0, total: 0, sum: 0 };
    this.data = [];
  }
  // seed into the item from the JSON file
  async seedData(records_number = null) {
    // delete all items existing in the data base
    logger.info("CLEARING DATABASES.....");
    await Item.deleteMany();
    await PriceProfitability.deleteMany();
    await ReplyProfitability.deleteMany();
    await ViewProfitability.deleteMany();

    // Tell user that we started implementing data into database
    logger.info("STARTED INSERTING DATA.....");
    // while inserting show a message each 5 seconds to the user
    let repeatedTask = setInterval(() => {
      logger.info("PLEASE BE PATIENT.....");
    }, 60000);
    // start looping on the data
    let index = 0;
    for (let item of Data) {
      if (records_number && index === records_number) break;
      // pass the item to the analyses function and check it for passing the conditions
      let passed_item = this.analyseRecord(item);
      if (passed_item) {
        // pass the item to the profitiblity functions
        this.analyseViewCount(passed_item);
        this.analyseReplyCount(passed_item);
        this.analysePrice(passed_item);
        // check for no duplicated data
        // create the record in the database
        item = new Item({ ...item });
        await item.save();
        this.data.push(item);
      }
      index++;
    }
    // clear interval and tell user that inserting is over
    clearInterval(repeatedTask);
    logger.info("DATA INSERTED SUCCESSFULLY.....");

    // update the records of the profitability
    let { price_prof, views_prof, count_prof } =
      await this.updateProfitability();

    // set profitability of each Item
    logger.info("PROFITABILITY OF EACH ITEM IN PROGRESS.....");
    for (let item of this.data) {
      await this.profitabilityItem(item, price_prof, views_prof, count_prof);
    }
    logger.info("PROFITABILITY OF EACH ITEM HAS BEEN DONE.....");

    logger.info("DATA SYNCED SUCCESSFULLY.....");
    // exit the process of seeding
    process.exit();
  }
  // apply some filter on the record to check if we want to add it to the database
  analyseRecord(record) {
    // remove the records where there is no price on them
    if (!record.priceInUsd) return;

    // can have sold in the threadTitle
    if (record.threadTitle && record.threadTitle.toLowerCase().includes("sold"))
      return;
    // can have sold in the articleText
    if (record.articleText && record.articleText.toLowerCase().includes("sold"))
      return;
    // filter with type (don't include the wanted)
    if (record.type && record.type.toLowerCase().includes("wanted")) return;

    // return the record in case all the condition are passed
    return record;
  }
  // function to get the profitability of an item
  async profitabilityItem(record, price_prof, views_prof, count_prof) {
    let profitability = calculatePointSystem(
      record,
      price_prof,
      views_prof,
      count_prof
    );
    await Item.findByIdAndUpdate(record._id, {
      profitability,
      profitability_percentage: profitability + "%",
    });
  }
  // update the database profitability items
  async updateProfitability() {
    // create the price PROFITABILITY
    let price_prof = new PriceProfitability({ ...this.prices });
    await price_prof.save();

    // create the views PROFITABILITY
    let views_prof = new ViewProfitability({ ...this.views });
    await views_prof.save();

    // create the count PROFITABILITY
    let count_prof = new ReplyProfitability({ ...this.replies });
    await count_prof.save();

    return { price_prof, views_prof, count_prof };
  }
  // reply analyse
  analyseReplyCount(record) {
    this.replies = calculateNewState(this.replies, record, "replyCount");
  }
  // Views analyse
  analyseViewCount(record) {
    this.views = calculateNewState(this.views, record, "viewCount");
  }
  // price tags
  analysePrice(record) {
    this.prices = calculateNewState(this.prices, record, "price");
  }
}

// export the class after init it
module.exports = new Analyse();
