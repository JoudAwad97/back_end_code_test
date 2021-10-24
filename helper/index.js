/**
 * function to calculate the new state after adding new record to it
 * @param {Object} old_state - object that contains three props (sum,total,count)
 * @param {Object} record - record that represet the newley added record
 * @param {String} type - the type of data to get
 * @returns {Object} - the newely updated object after adding the new record to it
 */
const calculateNewState = (old_state, record, type) => {
  if (record.priceInUsd) {
    old_state["total"] = Math.round(old_state["total"] + record[type]);
    old_state["count"] = old_state["count"] + 1;
    // calculate the new sum
    old_state["sum"] = Math.round(old_state["total"] / old_state["count"]);
  }
  return old_state;
};

/**
 * function that calculate the Profitability of an item
 * @param {Object} record - the item instance
 * @param {Object} price_prof - the price prof instance
 * @param {Object} views_prof - the views prof instance
 * @param {Object} count_prof - the count prof instance
 * @returns {Number} - the profitability of an item
 */
const calculatePointSystem = (record, price_prof, views_prof, count_prof) => {
  /**
   *
   * VIEW COUNT => 15% of total points
   * REPLY COUNT => 35% of total points
   * PRICE COUNT => 50% of total points
   *
   */

  // RANGE FOR PRICE
  let RANGE_PRICE = calculateRanges(price_prof.sum);
  let LOW_PRICE_RANGE = RANGE_PRICE.LOW_RANGE;
  let HIGH_PRICE_RANGE = RANGE_PRICE.HIGH_RANGE;

  // get points of the record Price
  let pointsOfPrice;
  if (record.priceInUsd)
    pointsOfPrice = getPointsOfRangedNumber(
      record.priceInUsd,
      LOW_PRICE_RANGE,
      HIGH_PRICE_RANGE,
      50
    );
  else pointsOfPrice = 0;

  // RANGE FOR VIEWS
  let RANGE_VIEWS = calculateRanges(views_prof.sum);
  let LOW_VIEW_RANGE = RANGE_VIEWS.LOW_RANGE;
  let HIGH_VIEW_RANGE = RANGE_VIEWS.HIGH_RANGE;
  let pointOfViews;
  if (record.viewCount)
    pointOfViews = getPointsOfRangedNumber(
      record.viewCount,
      LOW_VIEW_RANGE,
      HIGH_VIEW_RANGE,
      15
    );
  else pointOfViews = 0;

  // RAGE FOR REPLY COUNT
  let RANGE_REPLY = calculateRanges(count_prof.sum);
  let LOW_REPLY_RANGE = RANGE_REPLY.LOW_RANGE;
  let HIGH_REPLY_RANGE = RANGE_REPLY.HIGH_RANGE;
  let pointOfReply;
  if (record.replyCount)
    pointOfReply = getPointsOfRangedNumber(
      record.replyCount,
      LOW_REPLY_RANGE,
      HIGH_REPLY_RANGE,
      35
    );
  else pointOfReply = 0;

  let full_percentage = Math.round(pointsOfPrice + pointOfViews + pointOfReply);

  // get the percentage of the points
  return full_percentage;
};

/**
 * calculate how many point the number get depending on it is up and down range
 * @param {Number} number - the number to calculate the point for
 * @param {Number} low - the lowest range
 * @param {Number} hight - the highest range
 * @param {Number} percentage_value - the percentage of the number
 * @returns {Number} - the points from 10
 */
const getPointsOfRangedNumber = (number, low, hight, percentage_value) => {
  const LOW_POINT = 40;
  const NORMAL_POINT = 60;
  // number is higher than the highest range
  let x_percentage;
  if (number >= hight) {
    x_percentage = 100;
  }
  // number is lower than the low value
  else if (number <= low) {
    x_percentage = (number * 100) / low;
    x_percentage = (LOW_POINT * x_percentage) / (100 * 100);
    x_percentage = x_percentage * 100;
  }
  // number in the middle of two ranges (normal value)
  else {
    x_percentage = (number * 100) / hight;
    x_percentage = (NORMAL_POINT * x_percentage) / (100 * 100);
    x_percentage = x_percentage * 100;
  }

  // calculate the percentage from the over all percentage
  x_percentage = Math.round((x_percentage * percentage_value) / 100);

  return x_percentage;
};

/**
 * calculate the RANGE Sizes for an item
 * @param {Number} middle_range
 * @returns {Object} - that contains two variables for hight and low ranges
 */
const calculateRanges = (middle_range) => {
  middle_range = Math.round(middle_range);
  let HIGH_RANGE = Math.round(middle_range * 1.5);
  let LOW_RANGE = Math.round(middle_range / 1.5);
  return { HIGH_RANGE, LOW_RANGE };
};

module.exports = {
  calculateNewState,
  calculatePointSystem,
};
