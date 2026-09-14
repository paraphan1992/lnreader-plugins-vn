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
        this.version = '2.3.6';
        this.webStorageUtilized = true;
        this.pluginSettings = {
            site: {
                value: 'https://nettruyenar.com',
                label: 'Site URL',
            },
        };
        this.imageRequestInit = {
            headers: { Referer: 'https://nettruyenar.com/' },
        };
        this.filters = {};
    }
    Object.defineProperty(NetTruyenManga.prototype, "site", {
        get: function () {
            var site = storage_1.storage.get('site') || 'https://nettruyenar.com';
            // Apex / www .com.mx hang 15–40s; seo/ww/aa/bb now redirect or stall.
            if (/nettruyen\.com\.mx/i.test(site) ||
                /nettruyenseo\.com/i.test(site) ||
                /nettruyenww\.com/i.test(site) ||
                /nettruyenaa\.com/i.test(site) ||
                /nettruyenbb\.com/i.test(site)) {
                site = 'https://nettruyenar.com';
            }
            site = site.replace(/\/+$/, '');
            if (this.imageRequestInit.headers) {
                this.imageRequestInit.headers.Referer = "".concat(site, "/");
            }
            return site;
        },
        enumerable: false,
        configurable: true
    });
    NetTruyenManga.prototype.toPath = function (href) {
        try {
            var url = href.startsWith('http')
                ? new URL(href)
                : new URL(href, this.site);
            return url.pathname;
        }
        catch (_a) {
            return href.replace(this.site, '');
        }
    };
    NetTruyenManga.prototype.comicMeta = function (html, novelPath) {
        var _a, _b, _c, _d;
        var slug = ((_a = html.match(/gOpts\.comicSlug\s*=\s*'([^']+)'/)) === null || _a === void 0 ? void 0 : _a[1]) ||
            ((_b = novelPath.match(/\/truyen-tranh\/(.+)-\d+\/?$/)) === null || _b === void 0 ? void 0 : _b[1]);
        var comicId = ((_c = html.match(/gOpts\.comicId\s*=\s*'(\d+)'/)) === null || _c === void 0 ? void 0 : _c[1]) ||
            ((_d = novelPath.match(/\/truyen-tranh\/.+-(\d+)\/?$/)) === null || _d === void 0 ? void 0 : _d[1]);
        return { slug: slug, comicId: comicId };
    };
    NetTruyenManga.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('.comic-item, .item, .row .item').each(function (_, ele) {
            var a = loadedCheerio(ele).find('h3 a, .title a, a.jtip');
            var href = a.attr('href');
            var name = a.text().trim();
            var cover = loadedCheerio(ele).find('.image img, img').attr('data-original') ||
                loadedCheerio(ele).find('.image img, img').attr('data-src') ||
                loadedCheerio(ele).find('.image img, img').attr('src');
            if (!href || !name)
                return;
            var path = _this.toPath(href);
            if (!path.includes('/truyen-tranh/'))
                return;
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
        var seen = new Set();
        loadedCheerio('#chapter_list .chapter a, #nt_listchapter .chapter a, .list-chapter .chapter a').each(function (_, ele) {
            var href = loadedCheerio(ele).attr('href') || '';
            var name = loadedCheerio(ele).text().replace(/\s+/g, ' ').trim();
            if (!href || !name || name === 'Xem thêm')
                return;
            var path = _this.toPath(href);
            if (path.split('/').filter(Boolean).length < 3)
                return;
            if (seen.has(path))
                return;
            seen.add(path);
            chapters.push({ name: name, path: path });
        });
        chapters.reverse();
        return chapters.map(function (chapter, index) { return (__assign(__assign({}, chapter), { chapterNumber: index + 1 })); });
    };
    NetTruyenManga.prototype.fetchChapterList = function (slug, comicId) {
        return __awaiter(this, void 0, void 0, function () {
            var url, json, rows, chapters, seen, _i, rows_1, row, chapterSlug, chapterId, name_1, path, num;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/Comic/Services/ComicService.asmx/ChapterList") +
                            "?slug=".concat(encodeURIComponent(slug), "&comicId=").concat(encodeURIComponent(comicId));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    Referer: "".concat(this.site, "/"),
                                    Accept: 'application/json, text/javascript, */*; q=0.01',
                                },
                            }).then(function (r) { return r.json(); })];
                    case 1:
                        json = (_a.sent());
                        rows = Array.isArray(json === null || json === void 0 ? void 0 : json.data) ? json.data : [];
                        chapters = [];
                        seen = new Set();
                        for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                            row = rows_1[_i];
                            chapterSlug = String(row.chapter_slug || '').trim();
                            chapterId = String(row.chapter_id || '').trim();
                            name_1 = String(row.chapter_name || '').replace(/\s+/g, ' ').trim();
                            if (!chapterSlug || !chapterId || !name_1)
                                continue;
                            path = "/truyen-tranh/".concat(slug, "/").concat(chapterSlug, "/").concat(chapterId);
                            if (seen.has(path))
                                continue;
                            seen.add(path);
                            num = Number(row.chapter_num);
                            chapters.push({
                                name: name_1,
                                path: path,
                                chapterNumber: Number.isFinite(num) ? num : undefined,
                            });
                        }
                        chapters.sort(function (a, b) { return (a.chapterNumber || 0) - (b.chapterNumber || 0); });
                        return [2 /*return*/, chapters.map(function (chapter, index) {
                                var _a;
                                return (__assign(__assign({}, chapter), { chapterNumber: (_a = chapter.chapterNumber) !== null && _a !== void 0 ? _a : index + 1 }));
                            })];
                }
            });
        });
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
            var body, loadedCheerio, novel, cover, meta, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.title-detail, h1.title-detail').text().trim() ||
                                'Truyện Tranh',
                            chapters: [],
                            totalPages: 1,
                        };
                        cover = loadedCheerio('.col-image img').attr('src') ||
                            loadedCheerio('.col-image img').attr('data-original') ||
                            loadedCheerio('.col-image img').attr('data-src');
                        novel.cover = cover
                            ? cover.startsWith('http')
                                ? cover
                                : cover.startsWith('//')
                                    ? "https:".concat(cover)
                                    : this.site + cover
                            : undefined;
                        novel.summary = loadedCheerio('.detail-content p, .shortened')
                            .text()
                            .trim();
                        novel.author = loadedCheerio('.author .col-xs-8').text().trim();
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        meta = this.comicMeta(body, novelPath);
                        if (!(meta.slug && meta.comicId)) return [3 /*break*/, 5];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        _a = novel;
                        return [4 /*yield*/, this.fetchChapterList(meta.slug, meta.comicId)];
                    case 3:
                        _a.chapters = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _b = _c.sent();
                        novel.chapters = [];
                        return [3 /*break*/, 5];
                    case 5:
                        if ((novel.chapters || []).length < 2) {
                            novel.chapters = this.parseChapters(loadedCheerio);
                        }
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NetTruyenManga.prototype.parsePage = function (novelPath, _page) {
        return __awaiter(this, void 0, void 0, function () {
            var novel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.parseNovel(novelPath)];
                    case 1:
                        novel = _a.sent();
                        return [2 /*return*/, { chapters: novel.chapters || [] }];
                }
            });
        });
    };
    NetTruyenManga.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, images, seen;
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
                        seen = new Set();
                        loadedCheerio([
                            '.reading-detail .page-chapter img',
                            '.reading-detail img',
                            '.page-chapter img',
                            'img.lozad',
                            'img[data-src]',
                            'img[data-sv1]',
                        ].join(', ')).each(function (_, ele) {
                            var raw = loadedCheerio(ele).attr('data-src') ||
                                loadedCheerio(ele).attr('data-sv1') ||
                                loadedCheerio(ele).attr('data-original') ||
                                loadedCheerio(ele).attr('src') ||
                                '';
                            var src = raw.replace(/&amp;/g, '&').trim();
                            if (!src || src.startsWith('data:') || src.startsWith('blob:'))
                                return;
                            if (/logo|icon|avatar|brandview|gtag|\.js(\?|$)/i.test(src))
                                return;
                            var fullSrc = src.startsWith('http')
                                ? src
                                : src.startsWith('//')
                                    ? "https:".concat(src)
                                    : _this.site + src;
                            if (seen.has(fullSrc))
                                return;
                            seen.add(fullSrc);
                            images.push("<img class=\"chapter-page\" src=\"".concat(fullSrc, "\" alt=\"\" />"));
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
