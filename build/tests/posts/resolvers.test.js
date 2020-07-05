"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils_1 = require("../utils");
var database_1 = __importDefault(require("../../database"));
var posts_1 = require("../../posts");
var locations_1 = require("../../locations");
var types_1 = require("../../types");
var posts = [
    {
        title: 'My first post',
        titleColour: '#fff',
        content: 'I am your father',
        date: new Date(1592733214700).toISOString(),
        order: new Date(1592733214700).toISOString(),
        photo: 'https://live.staticflickr.com/65535/48529735877_7b3f6fcb0c_b.jpg',
        status: types_1.Status.live,
        location: {
            location: 'Valparaiso',
            lat: -33.045559,
            lng: -71.619423,
            duration: 0,
            hideFromBounding: false
        }
    },
    {
        title: 'My second post',
        titleColour: '#fff',
        content: 'I am your father',
        date: new Date(1592733199360).toISOString(),
        order: new Date(1592733199360).toISOString(),
        photo: 'https://live.staticflickr.com/65535/48529735877_7b3f6fcb0c_b.jpg',
        status: types_1.Status.draft,
        location: {
            location: 'Valparaiso',
            lat: -33.045559,
            lng: -71.619423,
            duration: 0,
            hideFromBounding: false
        }
    }
];
var newPost = {
    title: 'My third post',
    titleColour: '#fff',
    content: 'I am your father',
    date: new Date(1592750588797).toISOString(),
    order: new Date(1592750588797).toISOString(),
    photo: 'https://live.staticflickr.com/65535/48529735877_7b3f6fcb0c_b.jpg',
    status: types_1.Status.draft,
    location: {
        location: 'Valparaiso',
        lat: -33.045559,
        lng: -71.619423,
        duration: 0,
        hideFromBounding: false
    }
};
var editedPost = __assign(__assign({}, newPost), { title: 'An edited post' });
var allPosts = function (status) {
    if (status === void 0) { status = null; }
    var where = '';
    if (status) {
        where = "(status: \"" + status + "\")";
    }
    return utils_1.graphQLRequest({
        query: "\n      query {\n        allPosts" + where + " {\n          id\n          title\n          titleColour\n          content\n          date\n          order\n          photo\n          status\n          location {\n            location\n            lat\n            lng\n            duration\n            hideFromBounding\n          }\n        }\n      }\n    "
    });
};
var getPost = function (id) {
    return utils_1.graphQLRequest({
        query: "\n      query {\n        post(\n          id: \"" + id + "\"\n        ) {\n          title\n          titleColour\n          content\n          date\n          order\n          photo\n          status\n          location {\n            location\n            lat\n            lng\n            duration\n            hideFromBounding\n          }\n        }\n      }\n    "
    });
};
// @ts-ignore
var addPost = function (_a, bearer, returnValues) {
    var title = _a.title, titleColour = _a.titleColour, content = _a.content, date = _a.date, order = _a.order, photo = _a.photo, status = _a.status, _b = _a.location, location = _b.location, lat = _b.lat, lng = _b.lng, duration = _b.duration, hideFromBounding = _b.hideFromBounding;
    if (returnValues === void 0) { returnValues = "{\n  id\n  title\n  titleColour\n  content\n  date\n  order\n  photo\n  status\n  location {\n    location\n    lat\n    lng\n    duration\n    hideFromBounding\n  }\n}"; }
    var sentBearer = '';
    var sentTitle = '';
    if (bearer && bearer !== '') {
        sentBearer = "bearer " + bearer;
    }
    if (title) {
        sentTitle = "title: \"" + title + "\",";
    }
    return utils_1.graphQLRequest({
        query: "\n      mutation {\n        addPost(\n          " + sentTitle + "\n          titleColour: \"" + titleColour + "\",\n          content: \"" + content + "\",\n          date: \"" + date + "\",\n          order: \"" + order + "\",\n          photo: \"" + photo + "\",\n          status: " + status + ",\n          location: \"" + location + "\",\n          lat: " + lat + ",\n          lng: " + lng + ",\n          duration: " + duration + ",\n          hideFromBounding: " + hideFromBounding + ",\n        ) " + returnValues + "\n      }\n    ",
        bearer: sentBearer
    });
};
// @ts-ignore
var editPost = function (_a, bearer, returnValues) {
    var id = _a.id, title = _a.title, titleColour = _a.titleColour, content = _a.content, date = _a.date, order = _a.order, photo = _a.photo, status = _a.status, _b = _a.location, location = _b.location, lat = _b.lat, lng = _b.lng, duration = _b.duration, hideFromBounding = _b.hideFromBounding;
    if (returnValues === void 0) { returnValues = "{\n  id\n  title\n  titleColour\n  content\n  date\n  order\n  photo\n  status\n  location {\n    location\n    lat\n    lng\n    duration\n    hideFromBounding\n  }\n}"; }
    var sentBearer = '';
    if (bearer && bearer !== '') {
        sentBearer = "bearer " + bearer;
    }
    return utils_1.graphQLRequest({
        query: "\n      mutation {\n        editPost(\n          id: \"" + id + "\",\n          title: \"" + title + "\",\n          titleColour: \"" + titleColour + "\",\n          content: \"" + content + "\",\n          date: \"" + date + "\",\n          order: \"" + order + "\",\n          photo: \"" + photo + "\",\n          status: " + status + ",\n          location: \"" + location + "\",\n          lat: " + lat + ",\n          lng: " + lng + ",\n          duration: " + duration + ",\n          hideFromBounding: " + hideFromBounding + ",\n        ) " + returnValues + "\n      }\n    ",
        bearer: sentBearer
    });
};
var deletePost = function (id, bearer, returnValues) {
    if (returnValues === void 0) { returnValues = "{\n  success\n}"; }
    return utils_1.graphQLRequest({
        query: "\n      mutation {\n        deletePost(\n          id: \"" + id + "\",\n        ) " + returnValues + "\n      }\n    ",
        bearer: "bearer " + bearer
    });
};
var returnPostWithISODates = function (post) { return (__assign(__assign({}, post), { date: new Date(Number(post.date)).toISOString(), order: new Date(Number(post.order)).toISOString() })); };
beforeEach(function (done) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, posts_1.Post.destroy({ where: {} })];
            case 1:
                _a.sent();
                return [4 /*yield*/, locations_1.Location.destroy({ where: {} })];
            case 2:
                _a.sent();
                return [4 /*yield*/, utils_1.asyncForEach(posts, function (post) { return __awaiter(void 0, void 0, void 0, function () {
                        var location_1, newPost_1, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, locations_1.Location
                                            .create(__assign({}, post.location))];
                                case 1:
                                    location_1 = _a.sent();
                                    return [4 /*yield*/, posts_1.Post
                                            .create(__assign({}, post))];
                                case 2:
                                    newPost_1 = _a.sent();
                                    return [4 /*yield*/, newPost_1.setLocation(location_1)];
                                case 3: return [2 /*return*/, _a.sent()];
                                case 4:
                                    error_1 = _a.sent();
                                    console.log(error_1);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _a.sent();
                done();
                return [2 /*return*/];
        }
    });
}); });
afterAll(function (done) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, posts_1.Post.destroy({ where: {} })];
            case 1:
                _a.sent();
                return [4 /*yield*/, locations_1.Location.destroy({ where: {} })];
            case 2:
                _a.sent();
                database_1.default.close();
                done();
                return [2 /*return*/];
        }
    });
}); });
describe('photos', function () {
    describe('allPosts', function () {
        it('should return all the posts', function () {
            return allPosts()
                .expect(function (res) {
                var returnedPosts = res.body.data.allPosts.map(function (post) { return (__assign(__assign({}, lodash_1.omit(post, ['id'])), { date: new Date(Number(post.date)).toISOString(), order: new Date(Number(post.order)).toISOString() })); });
                expect(res.body).toHaveProperty('data.allPosts');
                expect(res.body.data.allPosts.length).toEqual(2);
                expect(returnedPosts).toEqual(posts);
            })
                .expect(200);
        });
        it('should return all the posts by status', function () {
            return allPosts(types_1.Status.live)
                .expect(function (res) {
                var returnedPosts = res.body.data.allPosts.map(function (post) { return (__assign(__assign({}, lodash_1.omit(post, ['id'])), { date: new Date(Number(post.date)).toISOString(), order: new Date(Number(post.order)).toISOString() })); });
                expect(res.body).toHaveProperty('data.allPosts');
                expect(res.body.data.allPosts.length).toEqual(1);
                expect(returnedPosts).toEqual(posts.filter(function (post) { return post.status === types_1.Status.live; }));
            })
                .expect(200);
        });
    });
    describe('get post', function () {
        it('should return a specfic post by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var returnedAllPosts, firstReturnedId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, allPosts()];
                    case 1:
                        returnedAllPosts = _a.sent();
                        firstReturnedId = returnedAllPosts.body.data.allPosts[0].id;
                        return [2 /*return*/, getPost(firstReturnedId)
                                .expect(function (res) {
                                var returnedPost = res.body.data.post;
                                var updatedPost = __assign(__assign({}, res.body.data.post), { date: new Date(Number(returnedPost.date)).toISOString(), order: new Date(Number(returnedPost.order)).toISOString() });
                                expect(res.body).toHaveProperty('data.post');
                                expect(updatedPost).toEqual(posts[0]);
                            })
                                .expect(200)];
                }
            });
        }); });
        it('should return an error when the ID cannot be found', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getPost(0)
                        .expect(function (res) {
                        expect(res.body).toHaveProperty('errors');
                        expect(res.body.errors[0].message).toEqual('Unable to fetch Post');
                    })];
            });
        }); });
    });
    describe('addPost', function () {
        it('should add a new post', function () { return __awaiter(void 0, void 0, void 0, function () {
            var bearer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getJWToken()];
                    case 1:
                        bearer = _a.sent();
                        return [2 /*return*/, addPost(newPost, bearer)
                                .expect(function (res) {
                                var returnedPost = res.body.data.addPost;
                                var omittedPost = lodash_1.omit(returnedPost, ['id']);
                                expect(res.body.data).toHaveProperty('addPost');
                                expect(returnPostWithISODates(omittedPost)).toEqual(newPost);
                            })];
                }
            });
        }); });
        it('should return an error when fields are missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var bearer, modifiedPost;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getJWToken()];
                    case 1:
                        bearer = _a.sent();
                        modifiedPost = __assign(__assign({}, newPost), { title: null });
                        // @ts-ignore // adding a nulled field to represent it not being added in the front end
                        return [2 /*return*/, addPost(modifiedPost, bearer)
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('errors');
                                expect(res.body.errors[0].message).toEqual('Field "addPost" argument "title" of type "String!" is required, but it was not provided.');
                            })];
                }
            });
        }); });
        it('should return an error when the auth bearer is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, addPost(newPost, '1234567890')
                        .expect(function (res) {
                        expect(res.body).toHaveProperty('errors');
                        expect(res.body.errors[0].message).toEqual('Context creation failed: Failed to authenticate token.');
                    })];
            });
        }); });
        it('should return an error when the auth bearer is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, addPost(newPost, '')
                        .expect(function (res) {
                        expect(res.body).toHaveProperty('errors');
                        expect(res.body.errors[0].message).toEqual('Not Authenticated, please sign in');
                    })];
            });
        }); });
    });
    describe('editPost', function () {
        it('should edit an existing post', function () { return __awaiter(void 0, void 0, void 0, function () {
            var bearer, returnedAllPosts, firstReturnedId, postToEdit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getJWToken()];
                    case 1:
                        bearer = _a.sent();
                        return [4 /*yield*/, allPosts()];
                    case 2:
                        returnedAllPosts = _a.sent();
                        firstReturnedId = returnedAllPosts.body.data.allPosts[0].id;
                        postToEdit = __assign({ id: firstReturnedId }, editedPost);
                        return [2 /*return*/, editPost(postToEdit, bearer)
                                .expect(function (res) {
                                expect(res.body.data).toHaveProperty('editPost');
                                expect(returnPostWithISODates(res.body.data.editPost)).toEqual(postToEdit);
                            })];
                }
            });
        }); });
        it('should return an error if the post ID doesnt match', function () { return __awaiter(void 0, void 0, void 0, function () {
            var bearer, postToEdit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getJWToken()];
                    case 1:
                        bearer = _a.sent();
                        postToEdit = __assign({ id: 0 }, editedPost);
                        return [2 /*return*/, editPost(postToEdit, bearer)
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('errors');
                                expect(res.body.errors[0].message).toEqual('Unable to update Post with ID: 0');
                            })];
                }
            });
        }); });
        it('should return an error if the auth fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var returnedAllPosts, firstReturnedId, postToEdit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, allPosts()];
                    case 1:
                        returnedAllPosts = _a.sent();
                        firstReturnedId = returnedAllPosts.body.data.allPosts[0].id;
                        postToEdit = __assign({ id: firstReturnedId }, editedPost);
                        return [2 /*return*/, editPost(postToEdit, '')
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('errors');
                                expect(res.body.errors[0].message).toEqual('Not Authenticated, please sign in');
                            })];
                }
            });
        }); });
    });
    describe('deletePost', function () {
        it('should not delete a post when auth fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var returnedAllPosts, firstReturnedId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, allPosts()];
                    case 1:
                        returnedAllPosts = _a.sent();
                        firstReturnedId = returnedAllPosts.body.data.allPosts[0].id;
                        return [2 /*return*/, deletePost(firstReturnedId, '')
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('errors');
                                expect(res.body.errors[0].message).toEqual('Not Authenticated, please sign in');
                            })];
                }
            });
        }); });
        it('should not delete a post when the ID doesnt match', function () { return __awaiter(void 0, void 0, void 0, function () {
            var bearer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getJWToken()];
                    case 1:
                        bearer = _a.sent();
                        return [2 /*return*/, deletePost(0, bearer)
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('errors');
                                expect(res.body.errors[0].message).toEqual('No Post found with ID: 0');
                            })];
                }
            });
        }); });
        it('should delete a post', function () { return __awaiter(void 0, void 0, void 0, function () {
            var bearer, returnedNewPost, newPostId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getJWToken()];
                    case 1:
                        bearer = _a.sent();
                        return [4 /*yield*/, addPost(newPost, bearer)];
                    case 2:
                        returnedNewPost = _a.sent();
                        newPostId = returnedNewPost.body.data.addPost.id;
                        return [4 /*yield*/, allPosts()
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('data.allPosts');
                                expect(res.body.data.allPosts.length).toEqual(3);
                            })
                                .expect(200)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, deletePost(newPostId, bearer)
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('data.deletePost');
                                expect(res.body.data.deletePost.success).toEqual(true);
                            })
                                .expect(200)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, allPosts()
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('data.allPosts');
                                expect(res.body.data.allPosts.length).toEqual(2);
                            })
                                .expect(200)];
                }
            });
        }); });
    });
});
