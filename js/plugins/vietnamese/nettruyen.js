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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var storage_1 = require("@libs/storage");
var NetTruyenManga = /** @class */ (function () {
    function NetTruyenManga() {
        this.id = 'nettruyen-manga';
        this.name = 'NetTruyen';
        this.icon = 'src/vi/nettruyen/icon.png';
        this.version = '2.2.0';
        this.webStorageUtilized = true;
        this.pluginSettings = {
            site: {
                value: 'https://nettruyenseo.com',
                label: 'Site URL',
            },
        };
        this.imageRequestInit = {
            headers: { Referer: 'https://nettruyenseo.com/' },
        };
        this.filters = {};
    }
    Object.defineProperty(NetTruyenManga.prototype, "site", {
        get: function () {
            return storage_1.storage.get('site') || 'https://nettruyenseo.com';
        },
        enumerable: false,
        configurable: true
    });
    NetTruyenManga.prototype.toPath = function (href) {
        try {
            var url = href.startsWith('http') ? new URL(href) : new URL(href, this.site);
            return url.pathname;
        }
        catch (_a) {
            return href.replace(this.site, '');
        }
    };
    NetTruyenManga.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('.item, .row .item').each(function (_, ele) {
            var a = loadedCheerio(ele).find('h3 a, .title a, a.jtip');
            var href = a.attr('href');
            var name = a.text().trim();
            var cover = loadedCheerio(ele).find('.image img, img').attr('data-original') ||
                loadedCheerio(ele).find('.image img, img').attr('src');
            if (!href || !name)
                return;
            var path = _this.toPath(href);
            if (novels.some(function (n) { return n.path === path; }))
                return;
            novels.push({
                name: name,
                cover: cover
                    ? cover.startsWith('http')
                        ? cover
                        : cover.startsWith('//')
                            ? "https:".concat(cover)
                            : _this.site + cover
                    : undefined,
                path: path,
            });
        });
        return novels;
    };
    NetTruyenManga.prototype.parseChapters = function (loadedCheerio) {
        var _this = this;
        var chapters = [];
        loadedCheerio('.list-chapter .chapter a, #nt_listchapter .chapter a').each(function (_, ele) {
            var href = loadedCheerio(ele).attr('href') || '';
            var name = loadedCheerio(ele).text().trim();
            if (!href || !name)
                return;
            chapters.push({ name: name, path: _this.toPath(href) });
        });
        return chapters;
    };
    NetTruyenManga.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/?page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    NetTruyenManga.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, cover;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.title-detail, h1.title-detail').text().trim() ||
                                'Truyện Tranh',
                            chapters: [],
                            totalPages: 1,
                        };
                        cover = loadedCheerio('.col-image img').attr('src') ||
                            loadedCheerio('.col-image img').attr('data-original');
                        novel.cover = cover
                            ? cover.startsWith('http')
                                ? cover
                                : this.site + cover
                            : undefined;
                        novel.summary = loadedCheerio('.detail-content p, .shortened').text().trim();
                        novel.author = loadedCheerio('.author .col-xs-8').text().trim();
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        novel.chapters = this.parseChapters(loadedCheerio);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NetTruyenManga.prototype.parsePage = function (novelPath, _page) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, { chapters: this.parseChapters((0, cheerio_1.load)(body)) }];
                }
            });
        });
    };
    NetTruyenManga.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, images;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath, {
                            headers: { Referer: this.site + '/' },
                        }).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('script, iframe, .ads, .adsbygoogle').remove();
                        images = [];
                        loadedCheerio('.reading-detail .page-chapter img, .reading-detail img, .page-chapter img').each(function (_, ele) {
                            var src = loadedCheerio(ele).attr('data-src') ||
                                loadedCheerio(ele).attr('data-original') ||
                                loadedCheerio(ele).attr('src');
                            if (!src || src.startsWith('data:'))
                                return;
                            var fullSrc = src.startsWith('http')
                                ? src
                                : src.startsWith('//')
                                    ? "https:".concat(src)
                                    : _this.site + src;
                            images.push("<img src=\"".concat(fullSrc, "\" style=\"width:100%;margin-bottom:8px;\"/>"));
                        });
                        return [2 /*return*/, images.join('\n')];
                }
            });
        });
    };
    NetTruyenManga.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchUrl = "".concat(this.site, "/tim-truyen?keyword=").concat(encodeURIComponent(searchTerm), "&page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    return NetTruyenManga;
}());
exports.default = new NetTruyenManga();
