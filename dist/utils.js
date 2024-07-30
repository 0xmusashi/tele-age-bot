"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToEpoch = convertToEpoch;
exports.calculateDays = calculateDays;
const date_fns_1 = require("date-fns");
function convertToEpoch(dateString) {
    // Parse the date string to a Date object
    const date = (0, date_fns_1.parse)(dateString, 'yyyy-MM-dd', new Date());
    // Get the Unix epoch time in milliseconds and convert to seconds
    const epochTimeInSeconds = (0, date_fns_1.getTime)(date) / 1000;
    return epochTimeInSeconds;
}
function calculateDays(targetDate) {
    const currentDate = new Date();
    // Calculate the difference in milliseconds
    const differenceInMs = currentDate.getTime() - targetDate;
    // Convert milliseconds to days and round to the nearest integer
    const differenceInDays = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
    return differenceInDays;
}
