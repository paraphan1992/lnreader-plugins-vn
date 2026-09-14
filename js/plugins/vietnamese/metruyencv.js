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
var MeTruyenCv = /** @class */ (function () {
    function MeTruyenCv() {
        this.id = 'metruyencv';
        this.name = 'Mê Truyện Chữ (Metruyencv)';
        this.icon = 'src/vi/metruyencv/icon.png';
        this.version = '2.1.5';
        this.pluginSettings = {
            site: {
                value: 'https://www.metruyencv.org',
                label: 'Site URL',
            },
        };
        this.filters = {};
    }
    Object.defineProperty(MeTruyenCv.prototype, "site", {
        get: function () {
            return storage_1.storage.get('site') || 'https://www.metruyencv.org';
        },
        enumerable: false,
        configurable: true
    });
    MeTruyenCv.prototype.toPath = function (href) {
        try {
            var url = href.startsWith('http') ? new URL(href) : new URL(href, this.site);
            return url.pathname.endsWith('/') ? url.pathname : "".concat(url.pathname, "/");
        }
        catch (_a) {
            return href.replace(this.site, '');
        }
    };
    MeTruyenCv.prototype.absUrl = function (src) {
        if (!src)
            return undefined;
        var value = src.trim();
        if (!value || value.startsWith('data:'))
            return undefined;
        if (value.startsWith('http'))
            return value;
        if (value.startsWith('//'))
            return "https:".concat(value);
        return this.site + (value.startsWith('/') ? value : "/".concat(value));
    };
    MeTruyenCv.prototype.decodeHtml = function (value) {
        return (0, cheerio_1.load)("<span>".concat(value, "</span>")).text().trim();
    };
    MeTruyenCv.prototype.stripAds = function ($) {
        $('script, style, iframe, .ads, .adsbygoogle, [class*="quangcao"]').remove();
    };
    MeTruyenCv.prototype.novelsFromJson = function (items) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var novels = [];
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var name_1 = this.decodeHtml(((_a = item.title) === null || _a === void 0 ? void 0 : _a.rendered) || '');
            var href = item.link || (item.slug ? "".concat(this.site, "/truyen/").concat(item.slug, "/") : '');
            if (!name_1 || !href)
                continue;
            var media = (_c = (_b = item._embedded) === null || _b === void 0 ? void 0 : _b['wp:featuredmedia']) === null || _c === void 0 ? void 0 : _c[0];
            var cover = (media === null || media === void 0 ? void 0 : media.source_url) ||
                ((_f = (_e = (_d = media === null || media === void 0 ? void 0 : media.media_details) === null || _d === void 0 ? void 0 : _d.sizes) === null || _e === void 0 ? void 0 : _e.full) === null || _f === void 0 ? void 0 : _f.source_url) ||
                ((_j = (_h = (_g = item.yoast_head_json) === null || _g === void 0 ? void 0 : _g.og_image) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.url);
            novels.push({ name: name_1, path: this.toPath(href), cover: this.absUrl(cover) });
        }
        return novels;
    };
    MeTruyenCv.prototype.parseChapters = function (loadedCheerio) {
        var _this = this;
        var chapters = [];
        var seen = new Set();
        var nodes = loadedCheerio('#chapter-list a[href*="/chuong-"], .chapter-item a[href*="/chuong-"]');
        var links = nodes.length
            ? nodes
            : loadedCheerio('a[href*="/chuong-"]');
        links.each(function (_, ele) {
            var _a;
            var href = loadedCheerio(ele).attr('href') || '';
            var name = loadedCheerio(ele).text().replace(/\s+/g, ' ').trim();
            var path = _this.toPath(href);
            if (!path.includes('/chuong-') || !name || name === 'Đọc' || seen.has(path)) {
                return;
            }
            seen.add(path);
            chapters.push({
                name: name,
                path: path,
                chapterNumber: Number((_a = path.match(/\/chuong-(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]),
            });
        });
        chapters.sort(function (a, b) { return (a.chapterNumber || 0) - (b.chapterNumber || 0); });
        return chapters;
    };
    MeTruyenCv.prototype.listLastPage = function (loadedCheerio) {
        var lastPage = 1;
        loadedCheerio('a[href*="/chuong/page/"]').each(function (_, ele) {
            var _a;
            var href = loadedCheerio(ele).attr('href') || '';
            var page = Number((_a = href.match(/\/chuong\/page\/(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]);
            if (page > lastPage)
                lastPage = page;
        });
        return Math.min(lastPage, 80);
    };
    MeTruyenCv.prototype.mergeChapters = function (target, incoming) {
        var seen = new Set(target.map(function (chapter) { return chapter.path; }));
        var added = 0;
        for (var _i = 0, incoming_1 = incoming; _i < incoming_1.length; _i++) {
            var chapter = incoming_1[_i];
            if (seen.has(chapter.path))
                continue;
            seen.add(chapter.path);
            target.push(chapter);
            added += 1;
        }
        return added;
    };
    MeTruyenCv.prototype.fetchAllChapters = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var firstUrl, firstHtml, first$, chapters, lastPage, concurrency, page, chunk, next, pages, added, _i, pages_1, html;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firstUrl = "".concat(this.site).concat(novelPath, "chuong/page/1/");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(firstUrl)
                                .then(function (r) { return r.text(); })
                                .catch(function () { return ''; })];
                    case 1:
                        firstHtml = _a.sent();
                        first$ = firstHtml ? (0, cheerio_1.load)(firstHtml) : (0, cheerio_1.load)('');
                        chapters = this.parseChapters(first$);
                        lastPage = this.listLastPage(first$);
                        if (lastPage <= 1)
                            return [2 /*return*/, chapters];
                        concurrency = 4;
                        page = 2;
                        _a.label = 2;
                    case 2:
                        if (!(page <= lastPage)) return [3 /*break*/, 5];
                        chunk = [];
                        for (next = page; next < page + concurrency && next <= lastPage; next++) {
                            chunk.push(next);
                        }
                        return [4 /*yield*/, Promise.all(chunk.map(function (pageNo) {
                                return (0, fetch_1.fetchApi)("".concat(_this.site).concat(novelPath, "chuong/page/").concat(pageNo, "/"))
                                    .then(function (r) { return r.text(); })
                                    .catch(function () { return ''; });
                            }))];
                    case 3:
                        pages = _a.sent();
                        added = 0;
                        for (_i = 0, pages_1 = pages; _i < pages_1.length; _i++) {
                            html = pages_1[_i];
                            if (!html)
                                continue;
                            added += this.mergeChapters(chapters, this.parseChapters((0, cheerio_1.load)(html)));
                        }
                        if (!added)
                            return [3 /*break*/, 5];
                        _a.label = 4;
                    case 4:
                        page += concurrency;
                        return [3 /*break*/, 2];
                    case 5:
                        chapters.sort(function (a, b) { return (a.chapterNumber || 0) - (b.chapterNumber || 0); });
                        return [2 /*return*/, chapters];
                }
            });
        });
    };
    MeTruyenCv.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var api, result, items, novels, html_1, _a, html;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        api = "".concat(this.site, "/wp-json/wp/v2/manga?per_page=20&page=").concat(pageNo, "&_embed=1");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(api)];
                    case 2:
                        result = _b.sent();
                        return [4 /*yield*/, result.json()];
                    case 3:
                        items = _b.sent();
                        if (!Array.isArray(items)) return [3 /*break*/, 6];
                        novels = this.novelsFromJson(items);
                        if (!(pageNo === 1 && novels.some(function (n) { return !n.cover; }))) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/truyen/"))
                                .then(function (r) { return r.text(); })
                                .catch(function () { return ''; })];
                    case 4:
                        html_1 = _b.sent();
                        if (html_1)
                            this.mergeCovers(novels, this.parseListing((0, cheerio_1.load)(html_1)));
                        _b.label = 5;
                    case 5: return [2 /*return*/, novels];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        _a = _b.sent();
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [3 /*break*/, 8];
                    case 8:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/truyen/")).then(function (r) { return r.text(); })];
                    case 9:
                        html = _b.sent();
                        return [2 /*return*/, this.parseListing((0, cheerio_1.load)(html))];
                }
            });
        });
    };
    MeTruyenCv.prototype.mergeCovers = function (novels, listed) {
        var byPath = new Map(listed.map(function (item) { return [item.path, item.cover]; }));
        for (var _i = 0, novels_1 = novels; _i < novels_1.length; _i++) {
            var novel = novels_1[_i];
            if (!novel.cover)
                novel.cover = byPath.get(novel.path);
        }
    };
    MeTruyenCv.prototype.parseListing = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('a[href*="/truyen/"]').each(function (_, ele) {
            var node = loadedCheerio(ele);
            var href = node.attr('href') || '';
            var path = _this.toPath(href);
            if (!/^\/truyen\/[^/]+\/$/.test(path))
                return;
            var name = node.text().trim();
            if (!name || name.length < 3 || novels.some(function (n) { return n.path === path; }))
                return;
            var wrap = node.closest('div, article, li, .item');
            var cover = _this.absUrl(node.find('img').attr('data-src') ||
                node.find('img').attr('src') ||
                wrap.find('img').attr('data-src') ||
                wrap.find('img').attr('src'));
            novels.push({ name: name, path: path, cover: cover });
        });
        return novels;
    };
    MeTruyenCv.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, $, novel, chapters, ajax;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        this.stripAds($);
                        novel = {
                            path: novelPath,
                            name: $('h1').first().text().trim() || 'Truyện MTC',
                            chapters: [],
                            totalPages: 1,
                        };
                        novel.cover = this.absUrl($('meta[property="og:image"]').attr('content') ||
                            $('.summary_image img, .manga-cover img, img.wp-post-image')
                                .first()
                                .attr('data-src') ||
                            $('.summary_image img, .manga-cover img, img.wp-post-image')
                                .first()
                                .attr('src') ||
                            $('img').first().attr('data-src') ||
                            $('img').first().attr('src'));
                        novel.summary = $('.summary, .description, .entry-content, #manga-description')
                            .first()
                            .text()
                            .trim();
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        return [4 /*yield*/, this.fetchAllChapters(novelPath)];
                    case 2:
                        chapters = _a.sent();
                        if (chapters.length < 2) {
                            chapters = this.parseChapters($);
                        }
                        if (!(chapters.length < 2)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(url, "ajax/chapters/"), {
                                method: 'POST',
                                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                            })
                                .then(function (r) { return r.text(); })
                                .catch(function () { return ''; })];
                    case 3:
                        ajax = _a.sent();
                        if (ajax) {
                            chapters = this.parseChapters((0, cheerio_1.load)(ajax));
                        }
                        _a.label = 4;
                    case 4:
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    MeTruyenCv.prototype.parsePage = function (novelPath, _page) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, this.fetchAllChapters(novelPath)];
                    case 1: return [2 /*return*/, (_a.chapters = _b.sent(), _a)];
                }
            });
        });
    };
    MeTruyenCv.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        this.stripAds($);
                        $('img').each(function (_, el) {
                            var node = $(el);
                            var src = node.attr('data-src') ||
                                node.attr('data-original') ||
                                node.attr('data-lazy-src') ||
                                node.attr('src') ||
                                '';
                            if (!src || src.startsWith('data:'))
                                return;
                            node.attr('src', src.startsWith('//') ? "https:".concat(src) : src);
                            node.removeAttr('srcset');
                            node.removeAttr('width');
                            node.removeAttr('height');
                        });
                        return [2 /*return*/, ($('#chapter-content').html() ||
                                $('.uk-article.text-based').html() ||
                                $('.chapter-body').html() ||
                                $('.chapter-content').html() ||
                                $('.uk-article').html() ||
                                $('#chapter-c').html() ||
                                '')];
                }
            });
        });
    };
    MeTruyenCv.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var api, result, items, _a, html;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        api = "".concat(this.site, "/wp-json/wp/v2/manga?search=").concat(encodeURIComponent(searchTerm), "&page=").concat(pageNo, "&per_page=20&_embed=1");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(api)];
                    case 2:
                        result = _b.sent();
                        return [4 /*yield*/, result.json()];
                    case 3:
                        items = _b.sent();
                        if (Array.isArray(items)) {
                            return [2 /*return*/, this.novelsFromJson(items)];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [3 /*break*/, 5];
                    case 5:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/?s=").concat(encodeURIComponent(searchTerm))).then(function (r) { return r.text(); })];
                    case 6:
                        html = _b.sent();
                        return [2 /*return*/, this.parseListing((0, cheerio_1.load)(html))];
                }
            });
        });
    };
    return MeTruyenCv;
}());
exports.default = new MeTruyenCv();
