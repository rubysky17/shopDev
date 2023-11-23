'use strict'

const { getSelectDate, unGetSelectDate } = require("../../utils");


const findAllDiscountCodeUnSelect = async ({
    limit = 50, page = 1, sort = "ctime", filter, unSelect, model
}) => {
    const skip = (page - 1) * limit;

    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectDate(unSelect))
        .lean();

    return documents;
}

const findAllDiscountCodeSelect = async ({
    limit = 50, page = 1, sort = "ctime", filter, select, model
}) => {
    const skip = (page - 1) * limit;

    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectDate(select))
        .lean();

    return documents;
}


module.exports = {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect
}