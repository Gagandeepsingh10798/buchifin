const Model = require("../../models");
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages
const mongoose = require('mongoose');
const moment = require('moment')
const utils = require("../../utils");

let PROJECTION = {
    CREATE: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0, isBlocked: 0 , acceptedAt:0,loadedAt:0,dispatchedAt: 0, deliveredAt:0,bookingId:0},
    FIND_WITH_PASSWORD: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0 ,bookingId:0},
    FIND: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0 ,bookingId:0},
    FIND_POPULATE: {
        customerId: { __v: 0, countryCode: 0, isEmailVerify: 0, isPhoneVerify: 0, password: 0, address: 0, isDeleted: 0, isBlocked: 0, deviceToken: 0, _id: 0, email: 0, createdAt: 0, updatedAt: 0, __v: 0, deviceType: 0}

    },
    FIND_AGGREGATE: {
        customer: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0, _id: 0, profileStatus: 0, isEmailVerify: 0, isPhoneVerify: 0, password: 0, lat: 0, long: 0 },
        product: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0, lat: 0, long: 0, category: { _id: 0, isDeleted: 0, isBlocked: 0, description: 0, image: 0, slug: 0, createdAt: 0, updatedAt: 0, __v: 0 } },
        deliveryAddress: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, customerId: 0, _id: 0},
        __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0, driver: 0, vehicle: 0,acceptedAt:0,loadedAt:0,dispatchedAt: 0, deliveredAt:0, bookingId:0
    },
    FIND_LOOKUP: {
        customer: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0, _id: 0, profileStatus: 0, isEmailVerify: 0, isPhoneVerify: 0, password: 0, lat: 0, long: 0 },
        product: { __v: 0, createdAt: 0, updatedAt: 0, price: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0, lat: 0, long: 0, category: { _id: 0, isDeleted: 0, isBlocked: 0, description: 0, image: 0, slug: 0, createdAt: 0, updatedAt: 0, __v: 0 } },
        deliveryAddress: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, customerId: 0, _id: 0},
        __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0, driver: 0, vehicle: 0,acceptedAt:0,loadedAt:0,dispatchedAt: 0, deliveredAt:0, bookingId:0
    },
}
const Create = async (createObj) => {
    try {
        let booking = await Model.Booking(createObj).save();
        if (createObj.promo){
            const promo = await Model.Promo.findById(createObj.promo);
            if (!promo) return {status: codes.BAD_REQUEST, message: messages.INVALID, data: {}}
            const currentDate = moment(new Date());
            if(promo.validUpto <  currentDate)return {status: codes.BAD_REQUEST, message: messages.PROMO_CODE_EXPIRE, data: {}}
            booking.promo = promo._id;
            // booking.amount -= (promo.discount * booking.amount) / 100;
            await booking.save();
            booking = await Model.Booking.findById(booking._id, PROJECTION.CREATE);
            return { status: codes.OK, message: messages.BOOKING_ADDED_SUCCESSFULLY, data: booking }
        }
        booking = await Model.Booking.findById(booking._id, PROJECTION.CREATE).lean().exec()
        return { status: codes.OK, message: messages.BOOKING_ADDED_SUCCESSFULLY, data: booking }
    }
    catch (error) {
        throw new Error(error)
    }
}

const Find = async (findObj, projection = null) => {
    try {
        if (findObj._id) findObj._id = mongoose.Types.ObjectId(findObj._id);
        if (findObj.driver) findObj.driver = mongoose.Types.ObjectId(findObj.driver);
        if (findObj.customer) findObj.customer = mongoose.Types.ObjectId(findObj.customer);
        let bookings = await Model.Booking.find({ ...findObj, isDeleted: false }, projection ? projection : PROJECTION.FIND).sort({ createdAt: -1 }).lean().exec();
        return { status: codes.OK, message: messages.BOOKING_FETCHED_SSUCESSFULLY, data: bookings }
    }
    catch (error) {
        throw new Error(error)
    }
}
const FindAndPopulate = async (findObj) => {
    try {
        let bookings = await Model.Booking.find({ ...findObj, isDeleted: false }).populate("review.customerId", 'profilePic firstName lastName ').lean().exec()
        return { status: codes.OK, message: messages.BOOKING_FETCHED_SSUCESSFULLY, data: bookings }
    }
    catch (error) {
        throw new Error(error)
    }
}
const FindWithAggregate = async (findObj) => {
    
    try {
        let query = findObj
        query.isDeleted = false
        if (findObj._id) query._id = mongoose.Types.ObjectId(findObj._id);
        let pipeline = [
            {
                $match: query
            },{
                $sort: {createdAt: -1}
            }
        ]
        pipeline.push({
            $lookup: {
                from: 'customers',
                localField: 'customer',
                foreignField: '_id',
                as: 'customer'
            }
        });

        pipeline.push({
            $unwind: "$customer"
        });

        pipeline.push({
            $lookup: {
                from: "fuelproducts",
                localField: "product",
                foreignField: "_id",
                as: "product"
            }
        }, {
            $unwind: "$product"
        });

        pipeline.push({
            $lookup: {
                from: "fuelcategories",
                localField: "product.category",
                foreignField: "_id",
                as: "product.category"
            }
        });
        pipeline.push({ $unwind: "$product.category" });

        pipeline.push({
            $lookup: {
                from: "addresses",
                localField: "deliveryAddress",
                foreignField: "_id",
                as: "deliveryAddress"
            }
        });
        pipeline.push({
            $unwind: "$deliveryAddress"
        });
        
        pipeline.push({ $project: PROJECTION.FIND_AGGREGATE });
        let bookings = await Model.Booking.aggregate(pipeline)
        return { status: codes.OK, message: bookings.length == 0 ? messages.NO_BOOKING_FOUND : messages.BOOKING_FETCHED_SSUCESSFULLY, data: bookings }
    }
    catch (error) {
        throw new Error(error)
    }
};

const FindBookingsWithPage = async(findObj,page=1,limit=10,projection = null) => {
    try {
        let query = findObj
        query.isDeleted = false
        if (findObj._id) query._id = mongoose.Types.ObjectId(findObj._id);
        if (findObj.driver) query.driver = mongoose.Types.ObjectId(findObj.driver);
        let pipeline = [
            {
                $match: query
            },
            {
                $sort: {createdAt: -1}
            }
        ]
        pipeline.push({
            $lookup: {
                from: 'customers',
                localField: 'customer',
                foreignField: '_id',
                as: 'customer'
            }
        });

        pipeline.push({
            $unwind: "$customer"
        });

        pipeline.push({
            $lookup: {
                from: "fuelproducts",
                localField: "product",
                foreignField: "_id",
                as: "product"
            }
        }, {
            $unwind: "$product"
        });

        pipeline.push({
            $lookup: {
                from: "fuelcategories",
                localField: "product.category",
                foreignField: "_id",
                as: "product.category"
            }
        });
        pipeline.push({ $unwind: "$product.category" });

        pipeline.push({
            $lookup: {
                from: "addresses",
                localField: "deliveryAddress",
                foreignField: "_id",
                as: "deliveryAddress"
            }
        });
        pipeline.push({
            $unwind: "$deliveryAddress"
        });
        
        pipeline.push({ $project: projection ? projection :  PROJECTION.FIND_AGGREGATE });
        let bookings = await Model.Booking.aggregate(pipeline).limit(limit).skip((page-1)*limit);
        const totalBookings = await Model.Booking.find({driver: findObj.driver}).countDocuments();
        return { status: codes.OK, message: bookings.length == 0 ? messages.NO_BOOKING_FOUND : messages.BOOKING_FETCHED_SSUCESSFULLY, data: {totalPages : Math.ceil(totalBookings/limit), bookings} }
    }
    catch (error) {
        throw new Error(error)
    }
}

const FindWithPagination = async(findObj,search=null,page=1,limit=10,projection = null) => {
    try {
        let pipeline = [
            {
                $match: {...findObj, isDeleted: false}
            }
        ];

        pipeline.push({
            $lookup: {
                from: "customers",
                localField: "customer",
                foreignField: "_id",
                as: "customer"
            }
        },
        {
            $unwind: "$customer"
        },
        {
            $project: PROJECTION.FIND
        });
        
        const searchStatus = Number(search);
        
        console.log({status: searchStatus, type: typeof searchStatus});

        if (search && search.trim() != "") {
            search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            let searchObj = {
              $match: {
                $or: [
                  { "customer.firstName": { $regex: search, $options: "i" } },
                  { "customer.lastName": { $regex: search, $options: "i" } },           
                  { "product": { $regex: search, $options: "i" } },
                  { "amount": { $regex: search, $options: "i" } }
                ],
            $and:{
                "status":  searchStatus 
            }},
            }
            pipeline.push(searchObj);
          };
          pipeline.push({
              $project: projection ? projection : PROJECTION.FIND
          });
          const totalBookings = (await Model.Booking.aggregate(pipeline)).length;
        let bookings = await Model.Booking.aggregate(pipeline).sort({createdAt: -1}).skip((page-1)*limit).limit(limit);
        return { status: codes.OK, message: messages.BOOKING_FETCHED_SSUCESSFULLY, data: {totalPages : Math.ceil(totalBookings/limit) , bookings} };

    }
    catch (error) {
        throw new Error(error)
    }
}

const FindWithAggregateWithLimit = async (findObj,skip,search) => {
    try {
        console.log("IN Service")
        console.log(search, typeof search);
        let query = findObj
        query.isDeleted = false
        if (findObj._id) query._id = mongoose.Types.ObjectId(findObj._id);

        let pipeline = [
            {
                $match: query
            }
        ]
        pipeline.push({
            $lookup: {
                from: 'customers',
                localField: 'customer',
                foreignField: '_id',
                as: 'customer'
            }
        });

        pipeline.push({
            $unwind: "$customer"
        });

        pipeline.push({
            $lookup: {
                from: "fuelproducts",
                localField: "product",
                foreignField: "_id",
                as: "product"
            }
        }, {
            $unwind: "$product"
        });

        pipeline.push({
            $lookup: {
                from: "fuelcategories",
                localField: "product.category",
                foreignField: "_id",
                as: "product.category"
            }
        });
        pipeline.push({ $unwind: "$product.category" });

        pipeline.push({
            $lookup: {
                from: "addresses",
                localField: "deliveryAddress",
                foreignField: "_id",
                as: "deliveryAddress"
            }
        });
        pipeline.push({
            $unwind: "$deliveryAddress"
        });
        pipeline.push({
            $addFields: {
                fullName: {$concat: ['$firstName',' ', '$lastName']}
            }
        })
        // let search = query.search;
        if (typeof search == "number"){
            pipeline.push({
                $match:{
                    status: search
                }
            })
        } else
        if (search && search.trim() != "") {
            console.log({search});
            search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            pipeline.push({
                $addFields: {
                  fullName: {
                    $concat: ["$customer.firstName", " ", "$customer.lastName"],
                  },
                },
              });
            let searchObj = {
              $match: {
                $or: [
                  { "firstName": { $regex: search, $options: "i" } },
                  { "lastName": { $regex: search, $options: "i" } },
                  { "fullName": { $regex: search, $options: "i" } },
                  { "email": { $regex: search, $options: "i" } },
                  //
                  { "product.catagory.name": { $regex: search, $options: "i" } },
                  { "deliveryAddress.phone": { $regex: search, $options: "i" } },
                  { "deliveryAddress.countryCode": { $regex: search, $options: "i" } },
                  { "deliveryAddress.consignee": { $regex: search, $options: "i" } },
                  { "deliveryAddress.country":  search },
                  { "deliveryAddress.location": { $regex: search, $options: "i" } },
                  { "deliveryAddress.lat":  search },
                  { "deliveryAddress.long":  search },
                  {"deliveryTime":{ $regex: search, $options: "i" } },
                {"deliveryDistance":{ $regex: search, $options: "i" } },
                    {"paymentType": { $regex: search, $options: "i" }},
                    {fullName: { $regex: search, $options: "i" }},
                    {"customer.firstName": { $regex: search, $options: "i" }},
                    {"customer.lastName": { $regex: search, $options: "i" }},
                    {"customer.phone": { $regex: search, $options: "i" }},
                    {"customer.countryCode": { $regex: search, $options: "i" }},
                    {"customer.address": { $regex: search, $options: "i" }},
                    {"customer.email": { $regex: search, $options: "i" }},
                    {"customer.walletBalance":  Number(search)},
                    {"amount":  Number(search)},
                  {"bookingType": { $regex: search, $options: "i" }},
                  {"date": { $regex: search, $options: "i" }},
                  {"product.type": { $regex: search, $options: "i" }},
                  {"product.category.name": { $regex: search, $options: "i" }},
                  {"price": Number(search)},
                  {"capacity": Number(search)},
                  {"dimension": Number(search)},
                  {"location": { $regex: search, $options: "i" }},
                ],
              },
            };
            pipeline.push(searchObj);
          }
        pipeline.push({ $project: PROJECTION.FIND_AGGREGATE });

        let bookings = await Model.Booking.aggregate(pipeline).sort({ date: -1 }).skip(skip).limit(10);
        let totalBookings = (await Model.Booking.aggregate(pipeline)).length;
        return { status: codes.OK, message: messages.BOOKING_FETCHED_SSUCESSFULLY, data: {bookings,pages: Math.ceil(totalBookings/10)}  }
    }
    catch (error) {
        throw new Error(error)
    }
};

const FindAndLookup = async (obj, page=1) => {
    try {
        const query = { ...obj, isDeleted: false };
        if (obj._id) query._id = mongoose.Types.ObjectId(obj._id);
        let pipeline = [
            {
                $match: query
            },
            { $sort: {
                createdAt: -1
            }
           }
        ];
        pipeline.push({
            $lookup: {
                from: 'fuelproducts',
                localField: 'product',
                foreignField: '_id',
                as: 'product'
            }
        });
        pipeline.push({ $unwind: "$product" });

        pipeline.push({
            $lookup: {
                from: "fuelcategories",
                localField: "product.category",
                foreignField: "_id",
                as: "product.category"
            }
        });
        pipeline.push({ $unwind: "$product.category" });

        pipeline.push({
            $lookup: {
                from: 'addresses',
                localField: 'deliveryAddress',
                foreignField: '_id',
                as: 'deliveryAddress'
            },
        });
        pipeline.push({ $unwind: "$deliveryAddress" });
        
        
        pipeline.push({ $project: { ...PROJECTION.FIND_LOOKUP, review: 0, customer: 0 } })
        const bookings = await Model.Booking.aggregate(pipeline).sort({createdAt: -1}).skip((page-1)*10).limit(10);
        const totalBookings = (await Model.Booking.aggregate(pipeline)).length;
        return { status: codes.OK, message: messages.BOOKING_FETCHED_SSUCESSFULLY, data: {totalPages : Math.ceil(totalBookings/10) , bookings} };

    } catch (error) {
        throw new Error(error.message);
    }

}
const Update = async (id, updateObj) => {
    try {
        console.log("ID -->", id);
        let booking = await Model.Booking.findByIdAndUpdate(mongoose.Types.ObjectId(id), updateObj).lean().exec()
        booking = await Model.Booking.findById(booking._id, PROJECTION.CREATE).lean().exec();
        return { status: codes.OK, message: messages.FORM_UPDATED_SUCCESSFULLY, data: booking }
    }
    catch (error) {
        throw new Error(error)
    }
};


module.exports = {
    Create,
    FindWithPagination,
    Find,
    Update,
    FindAndPopulate,
    FindWithAggregate,
    FindAndLookup,
    FindWithAggregateWithLimit,
    FindBookingsWithPage
}