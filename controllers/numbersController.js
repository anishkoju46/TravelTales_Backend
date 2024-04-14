const { HotlineNumber } = require('../models/number_model');

exports.fetchHotlineNumbers = async (req, res, next) => {
    try {
        const hotlineNumbers = await HotlineNumber.find().exec();
        return res.status(200).json(hotlineNumbers);
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.fetchOneHotlineNumber = async (req, res, next) => {
    try {
        const hotlineNumber = await HotlineNumber.findById(req.params.id).exec();
        if (!hotlineNumber) {
            return res.status(404).json({ message: "Hotline Number Not Found" });
        }
        return res.status(200).json(hotlineNumber);
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.createHotlineNumber = async (req, res, next) => {
    try {
        const newHotlineNumber = new HotlineNumber(req.body);
        await newHotlineNumber.save();
        return res.status(201).json(newHotlineNumber);
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.editHotlineNumber = async (req, res, next) => {
    try {
        const hotlineNumberId = req.params.id;
        const updateFields = req.body;
        const updatedHotlineNumber = await HotlineNumber.findByIdAndUpdate(hotlineNumberId, { $set: updateFields }, { new: true }).exec();
        if (!updatedHotlineNumber) {
            return res.status(404).json({ message: "Hotline Number Not Found" });
        }
        return res.status(200).json(updatedHotlineNumber);
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.deleteHotlineNumber = async (req, res, next) => {
    try {
        const hotlineNumberId = req.params.id;
        const deletedHotlineNumber = await HotlineNumber.findByIdAndDelete(hotlineNumberId).exec();
        if (!deletedHotlineNumber) {
            return res.status(404).json({ message: "Hotline Number Not Found" });
        }
        return res.status(200).json({ message: "Hotline Number deleted successfully" });
    } catch (e) {
        console.log(e);
        next(e);
    }
};