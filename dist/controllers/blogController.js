"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSinglePost = exports.getUserPost = exports.singlePost = exports.getPost = exports.updatePost = exports.createPost = void 0;
const utils_1 = require("../utils/utils");
const BlogPostModel_1 = __importDefault(require("../model/BlogPostModel"));
const cloudinary_1 = require("cloudinary");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verify = req.user;
        const validateUser = utils_1.creatBlogPostSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            res.status(400).json({ Error: validateUser.error.details[0].message });
        }
        let links = [];
        if (Array.isArray(req.files) && req.files.length > 0) {
            links = yield Promise.all(req.files.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.v2.uploader.upload(item.path);
                return result.secure_url;
            })));
        }
        const newPost = yield BlogPostModel_1.default.create(Object.assign(Object.assign({}, validateUser.value), { user: verify._id, pictures: links.join(",") }));
        return res
            .status(200)
            .json({ message: "Blog Post created successfully", newPost });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { pictures } = _a, rest = __rest(_a, ["pictures"]);
        const { id } = req.params;
        const validateUser = utils_1.updateBlogPostSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            res.status(400).json({ Error: validateUser.error.details[0].message });
        }
        const Post = yield BlogPostModel_1.default.findById({ _id: id });
        if (!Post) {
            return res.status(400).json({
                error: "Post not found",
            });
        }
        const updateRecord = yield BlogPostModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, rest), { pictures }), {
            new: true,
            runValidators: true,
            context: "query",
        });
        if (!updateRecord) {
            return res.status(404).json({
                msg: "Post not updated",
            });
        }
        return res.status(200).json({
            message: "Post updates successfully",
            updateRecord,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updatePost = updatePost;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllUserPost = yield BlogPostModel_1.default.find().populate("user");
        res.status(200).json({
            msg: "Post successfully fetched",
            getAllUserPost,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getPost = getPost;
const singlePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getsinglePost = yield BlogPostModel_1.default.findById(id);
        if (!getsinglePost) {
            return res.status(400).json({
                error: "Post not found",
            });
        }
        res.status(200).json({
            msg: "Post successfully fetched",
            getsinglePost
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.singlePost = singlePost;
const getUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const getAllUserPost = yield BlogPostModel_1.default.find({ user: userId });
        res.status(200).json({
            msg: "Post successfully fetched",
            getAllUserPost,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUserPost = getUserPost;
const deleteSinglePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteSingleRecord = yield BlogPostModel_1.default.findByIdAndDelete(id);
        if (!deleteSingleRecord) {
            return res.status(400).json({
                error: "Post not found",
            });
        }
        res.status(200).json({
            message: "Post successfully deleted",
            deleteSingleRecord
        });
    }
    catch (error) {
        console.error("Problem deleting Todo");
    }
});
exports.deleteSinglePost = deleteSinglePost;
