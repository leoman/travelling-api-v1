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
var utils_1 = require("../utils");
var database_1 = __importDefault(require("../../database"));
var photos_1 = require("../../photos");
var posts_1 = require("../../posts");
var post = {
    title: 'My first post'
};
var photos = [
    {
        url: 'https://live.staticflickr.com/65535/48538852697_c147669d3c_b.jpg',
    },
    {
        url: 'https://live.staticflickr.com/65535/48572566706_11d7a68779_b.jpg',
    }
];
var allPhotos = function () {
    return utils_1.graphQLRequest({
        query: "\n      query {\n        allPhotos {\n          url\n        }\n      }\n    "
    });
};
var addPhotos = function (_a, bearer, returnValues) {
    var id = _a.id, url = _a.url;
    if (returnValues === void 0) { returnValues = "{\n  id\n  url\n}"; }
    return utils_1.graphQLRequest({
        query: "\n      mutation {\n        addPhoto(\n          id: \"" + id + "\",\n          url: \"" + url + "\",\n        ) " + returnValues + "\n      }\n    ",
        bearer: "bearer " + bearer
    });
};
var deletePhoto = function (_a, bearer, returnValues) {
    var id = _a.id;
    if (returnValues === void 0) { returnValues = "{\n  success\n}"; }
    return utils_1.graphQLRequest({
        query: "\n      mutation {\n        deletePhoto(\n          id: \"" + id + "\",\n        ) " + returnValues + "\n      }\n    ",
        bearer: "bearer " + bearer
    });
};
beforeEach(function (done) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, photos_1.Photo.destroy({ where: {} })];
            case 1:
                _a.sent();
                return [4 /*yield*/, posts_1.Post.destroy({ where: {} })];
            case 2:
                _a.sent();
                return [4 /*yield*/, utils_1.asyncForEach(photos, function (photo) { return __awaiter(void 0, void 0, void 0, function () {
                        var error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, photos_1.Photo
                                            .create({
                                            url: photo.url,
                                        })];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    error_1 = _a.sent();
                                    console.log(error_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
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
            case 0: return [4 /*yield*/, photos_1.Photo.destroy({ where: {} })];
            case 1:
                _a.sent();
                return [4 /*yield*/, posts_1.Post.destroy({ where: {} })];
            case 2:
                _a.sent();
                database_1.default.close();
                done();
                return [2 /*return*/];
        }
    });
}); });
describe('photos', function () {
    describe('allPhotos', function () {
        it('should return all the photos', function () {
            return allPhotos()
                .expect(function (res) {
                expect(res.body).toHaveProperty('data.allPhotos');
                expect(res.body.data.allPhotos).toEqual(photos);
            })
                .expect(200);
        });
        it('should add a new photo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var newPost, bearer, newPhoto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, posts_1.Post.create(post)];
                    case 1:
                        newPost = _a.sent();
                        return [4 /*yield*/, utils_1.getJWToken()];
                    case 2:
                        bearer = _a.sent();
                        newPhoto = { id: newPost.id, url: 'https://live.staticflickr.com/65535/48572714307_32c1605b43_b.jpg' };
                        return [2 /*return*/, addPhotos(newPhoto, bearer)
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('data.addPhoto');
                                expect(res.body.data.addPhoto.url).toEqual(newPhoto.url);
                            })
                                .expect(200)];
                }
            });
        }); });
        it('should delete a photo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var newPost, bearer, newPhoto, returnedNewPhoto, newPhotoId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, posts_1.Post.create(post)];
                    case 1:
                        newPost = _a.sent();
                        return [4 /*yield*/, utils_1.getJWToken()];
                    case 2:
                        bearer = _a.sent();
                        newPhoto = { id: newPost.id, url: 'https://live.staticflickr.com/65535/48572714307_32c1605b43_b.jpg' };
                        return [4 /*yield*/, addPhotos(newPhoto, bearer)];
                    case 3:
                        returnedNewPhoto = _a.sent();
                        newPhotoId = returnedNewPhoto.body.data.addPhoto.id;
                        return [4 /*yield*/, allPhotos()
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('data.allPhotos');
                                expect(res.body.data.allPhotos.length).toEqual(3);
                            })
                                .expect(200)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, deletePhoto({ id: newPhotoId }, bearer)
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('data.deletePhoto');
                                expect(res.body.data.deletePhoto.success).toEqual(true);
                            })
                                .expect(200)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, allPhotos()
                                .expect(function (res) {
                                expect(res.body).toHaveProperty('data.allPhotos');
                                expect(res.body.data.allPhotos.length).toEqual(2);
                            })
                                .expect(200)];
                }
            });
        }); });
    });
});
