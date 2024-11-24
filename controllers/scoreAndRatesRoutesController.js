const { faker } = require('@faker-js/faker');
const {
    eachDayOfInterval,
    subDays,
    startOfToday,
    eachMonthOfInterval,
    startOfMonth,
    subMonths
} = require('date-fns');

const registroSchema = require('../models/registration')

exports.getScore= async (_, res) => {
    const today = startOfToday();
    const thirtyDaysAgo = subDays(today, 30);
    const intervalDates = eachDayOfInterval({start: thirtyDaysAgo, end: today})

    const data = intervalDates.map((date) => {
        const num = faker.number.int({min: 0, max: 5000, multipleOf: 100})
        return {date, num}
    });

    res.status(200).json(data)
};

exports.getRates = async (_, res) => {
    const currentMonth = startOfMonth(new Date());
    const sixMonthsAgo = subMonths(currentMonth, 6);
    const intervalMonths = eachMonthOfInterval({start: sixMonthsAgo, end: currentMonth})

    const data = intervalMonths.map((date) => {
        const num = faker.number.int({min: 0, max: 15000, multipleOf: 2500})

        return {date, num}
    })

    res.status(200).json(data)
};
