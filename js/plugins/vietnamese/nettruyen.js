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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var filterInputs_1 = require("@libs/filterInputs");
var storage_1 = require("@libs/storage");
var NetTruyenManga = /** @class */ (function () {
    function NetTruyenManga() {
        this.id = 'nettruyen-manga';
        this.name = 'NetTruyen';
        this.icon = 'src/vi/nettruyen/icon.png';
        this.version = '2.4.0';
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
        this.liveKey = 'liveSite';
        this.hosts = ['https://nettruyenar.com', 'https://www.nettruyen.com.mx'];
        this.filters = {
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sắp xếp',
                value: '10',
                options: [
                    { label: 'Top all', value: '10' },
                    { label: 'Top tháng', value: '11' },
                    { label: 'Top tuần', value: '12' },
                    { label: 'Top ngày', value: '13' },
                    { label: 'Ngày cập nhật', value: '0' },
                    { label: 'Truyện mới', value: '15' },
                    { label: 'Theo dõi', value: '20' },
                    { label: 'Bình luận', value: '25' },
                    { label: 'Số chapter', value: '30' },
                ],
            },
            status: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Tình trạng',
                value: '-1',
                options: [
                    { label: 'Tất cả', value: '-1' },
                    { label: 'Đang tiến hành', value: '1' },
                    { label: 'Hoàn thành', value: '2' },
                ],
            },
            genre: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Thể loại',
                value: '',
                options: [
                    { label: 'Tất cả', value: '' },
                    { label: 'Action', value: 'action-95' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Anime', value: 'anime' },
                    { label: 'Chuyển Sinh', value: 'chuyen-sinh-2130' },
                    { label: 'Comedy', value: 'comedy-99' },
                    { label: 'Comic', value: 'comic' },
                    { label: 'Cooking', value: 'cooking' },
                    { label: 'Cổ Đại', value: 'co-dai-207' },
                    { label: 'Doujinshi', value: 'doujinshi' },
                    { label: 'Drama', value: 'drama-103' },
                    { label: 'Đam Mỹ', value: 'dam-my' },
                    { label: 'Fantasy', value: 'fantasy-105' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Live action', value: 'live-action' },
                    { label: 'Manga', value: 'manga-112' },
                    { label: 'Manhua', value: 'manhua' },
                    { label: 'Manhwa', value: 'manhwa-11400' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mecha', value: 'mecha-117' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Ngôn Tình', value: 'ngon-tinh' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Romance', value: 'romance-121' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Sci-fi', value: 'sci-fi' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shoujo Ai', value: 'shoujo-ai-126' },
                    { label: 'Shounen', value: 'shounen-127' },
                    { label: 'Shounen Ai', value: 'shounen-ai' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Thiếu Nhi', value: 'thieu-nhi' },
                    { label: 'Tragedy', value: 'tragedy-136' },
                    { label: 'Trinh Thám', value: 'trinh-tham' },
                    { label: 'Truyện scan', value: 'truyen-scan' },
                    { label: 'Truyện Màu', value: 'truyen-mau' },
                    { label: 'Webtoon', value: 'webtoon' },
                    { label: 'Xuyên Không', value: 'xuyen-khong-205' },
                    { label: 'Tu Tiên', value: 'tu-tien' },
                ],
            },
        };
    }
    Object.defineProperty(NetTruyenManga.prototype, "site", {
        get: function () {
            var live = (storage_1.storage.get(this.liveKey) || '').replace(/\/+$/, '');
            var site = live || this.hosts[0];
            if (this.imageRequestInit.headers) {
                this.imageRequestInit.headers.Referer = "".concat(site, "/");
            }
            return site;
        },
        enumerable: false,
        configurable: true
    });
    NetTruyenManga.prototype.candidateHosts = function () {
        var live = (storage_1.storage.get(this.liveKey) || '').replace(/\/+$/, '');
        if (live && this.hosts.includes(live)) {
            return __spreadArray([live], this.hosts.filter(function (host) { return host !== live; }), true);
        }
        return __spreadArray([], this.hosts, true);
    };
    NetTruyenManga.prototype.rememberHost = function (host) {
        storage_1.storage.set(this.liveKey, host, Date.now() + 6 * 60 * 60 * 1000);
        if (this.imageRequestInit.headers) {
            this.imageRequestInit.headers.Referer = "".concat(host, "/");
        }
    };
    NetTruyenManga.prototype.isChallenge = function (html) {
        return /just a moment|cf-mitigated|challenge-platform|Enable JavaScript and cookies to continue/i.test(html);
    };
    NetTruyenManga.prototype.fetchText = function (pathAndQuery, extraHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var lastError, _i, _a, host, attempt, res, html, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.candidateHosts();
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 10];
                        host = _a[_i];
                        attempt = 0;
                        _b.label = 2;
                    case 2:
                        if (!(attempt < 2)) return [3 /*break*/, 9];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, , 8]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(host + pathAndQuery, {
                                headers: __assign({ Referer: "".concat(host, "/") }, extraHeaders),
                            })];
                    case 4:
                        res = _b.sent();
                        return [4 /*yield*/, res.text()];
                    case 5:
                        html = _b.sent();
                        if (this.isChallenge(html) || html.length < 800)
                            return [3 /*break*/, 9];
                        this.rememberHost(host);
                        return [2 /*return*/, html];
                    case 6:
                        err_1 = _b.sent();
                        lastError = err_1 instanceof Error ? err_1 : new Error(String(err_1));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        attempt++;
                        return [3 /*break*/, 2];
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: throw (lastError ||
                        new Error('NetTruyen bị Cloudflare chặn. Tắt VPN rồi bấm Thử lại.'));
                }
            });
        });
    };
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
        var _a, _b, _c, _d, _e;
        var slug = ((_a = html.match(/gOpts\.comicSlug\s*=\s*'([^']+)'/)) === null || _a === void 0 ? void 0 : _a[1]) ||
            ((_b = novelPath.match(/\/truyen-tranh\/(.+)-\d+\/?$/)) === null || _b === void 0 ? void 0 : _b[1]) ||
            ((_c = novelPath.match(/^\/(.+)-\d+\/?$/)) === null || _c === void 0 ? void 0 : _c[1]);
        var comicId = ((_d = html.match(/gOpts\.comicId\s*=\s*'(\d+)'/)) === null || _d === void 0 ? void 0 : _d[1]) ||
            ((_e = novelPath.match(/\/(?:truyen-tranh\/)?.+-(\d+)\/?$/)) === null || _e === void 0 ? void 0 : _e[1]);
        return { slug: slug, comicId: comicId };
    };
    NetTruyenManga.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        // The main grid sits in `.items`; sliders and sidebars repeat the same
        // top comics on every page, so only fall back to them when it is missing.
        var main = loadedCheerio('.items .row .item');
        var cards = main.length
            ? main
            : loadedCheerio('.comic-item, .item, .row .item');
        cards.each(function (_, ele) {
            var a = loadedCheerio(ele).find('h3 a, .title a, a.jtip').first();
            var href = a.attr('href');
            var name = a.text().trim();
            var cover = loadedCheerio(ele).find('.image img, img').attr('data-original') ||
                loadedCheerio(ele).find('.image img, img').attr('data-src') ||
                loadedCheerio(ele).find('.image img, img').attr('src');
            if (!href || !name)
                return;
            var path = _this.toPath(href);
            if (/\/(chapter-|chuong-|chap-)\d+/i.test(path))
                return;
            if (path.split('/').filter(Boolean).length < 1)
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
            if (path.split('/').filter(Boolean).length < 2)
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
            var host, url, raw, json, rows, chapters, seen, _i, rows_1, row, chapterSlug, chapterId, name_1, path, num, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        host = this.site;
                        if (!/nettruyenar\.com|nettruyenww\.com|nettruyenaa\.com/i.test(host)) {
                            return [2 /*return*/, []];
                        }
                        url = "".concat(host, "/Comic/Services/ComicService.asmx/ChapterList") +
                            "?slug=".concat(encodeURIComponent(slug), "&comicId=").concat(encodeURIComponent(comicId));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    Referer: "".concat(host, "/"),
                                    Accept: 'application/json, text/javascript, */*; q=0.01',
                                },
                            }).then(function (r) { return r.text(); })];
                    case 2:
                        raw = _b.sent();
                        if (this.isChallenge(raw))
                            return [2 /*return*/, []];
                        json = JSON.parse(raw);
                        rows = Array.isArray(json === null || json === void 0 ? void 0 : json.data) ? json.data : [];
                        chapters = [];
                        seen = new Set();
                        for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                            row = rows_1[_i];
                            chapterSlug = String(row.chapter_slug || '').trim();
                            chapterId = String(row.chapter_id || '').trim();
                            name_1 = String(row.chapter_name || '')
                                .replace(/\s+/g, ' ')
                                .trim();
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
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NetTruyenManga.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var showLatestNovels, filters, sort, status, genre, body;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        showLatestNovels = options === null || options === void 0 ? void 0 : options.showLatestNovels;
                        filters = options === null || options === void 0 ? void 0 : options.filters;
                        sort = showLatestNovels ? '0' : ((_a = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _a === void 0 ? void 0 : _a.value) || '10';
                        status = ((_b = filters === null || filters === void 0 ? void 0 : filters.status) === null || _b === void 0 ? void 0 : _b.value) || '-1';
                        genre = ((_c = filters === null || filters === void 0 ? void 0 : filters.genre) === null || _c === void 0 ? void 0 : _c.value) ? "/".concat(filters.genre.value) : '';
                        return [4 /*yield*/, this.fetchText("/tim-truyen".concat(genre, "?status=").concat(status, "&sort=").concat(sort, "&page=").concat(pageNo))];
                    case 1:
                        body = _d.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    NetTruyenManga.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, cover, summary, author, status, meta, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchText(novelPath)];
                    case 1:
                        body = _b.sent();
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
                        summary = loadedCheerio('.detail-content .shortened').first().clone();
                        summary.find('h1, h2, h3, script, style').remove();
                        // NetTruyen prepends a generated SEO paragraph (views, stars, followers).
                        summary
                            .find('p')
                            .filter(function (_, el) {
                            return /nổi bật trên|lượt đọc|người theo dõi/i.test(loadedCheerio(el).text());
                        })
                            .remove();
                        novel.summary = (summary.text() || loadedCheerio('.detail-content p').text())
                            .replace(/\s+/g, ' ')
                            .trim();
                        author = loadedCheerio('.list-info .author .col-xs-8').text().trim();
                        if (author && !/đang cập nhật/i.test(author))
                            novel.author = author;
                        novel.genres = loadedCheerio('.list-info .kind .col-xs-8 a')
                            .map(function (_, el) { return loadedCheerio(el).text().trim(); })
                            .get()
                            .filter(Boolean)
                            .join(',');
                        status = loadedCheerio('.list-info .status .col-xs-8')
                            .text()
                            .toLowerCase();
                        novel.status = status.includes('hoàn thành')
                            ? novelStatus_1.NovelStatus.Completed
                            : status.includes('đang')
                                ? novelStatus_1.NovelStatus.Ongoing
                                : novelStatus_1.NovelStatus.Unknown;
                        meta = this.comicMeta(body, novelPath);
                        if (!(meta.slug && meta.comicId)) return [3 /*break*/, 3];
                        _a = novel;
                        return [4 /*yield*/, this.fetchChapterList(meta.slug, meta.comicId)];
                    case 2:
                        _a.chapters = _b.sent();
                        _b.label = 3;
                    case 3:
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
                    case 0: return [4 /*yield*/, this.fetchText(chapterPath, {
                            Referer: "".concat(this.site, "/"),
                        })];
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
            var qs, _i, _a, path, body, novels, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        qs = "keyword=".concat(encodeURIComponent(searchTerm), "&page=").concat(pageNo);
                        _i = 0, _a = ["/tim-truyen?".concat(qs), "/tim-kiem-nang-cao?".concat(qs)];
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        path = _a[_i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.fetchText(path)];
                    case 3:
                        body = _c.sent();
                        novels = this.parseNovels((0, cheerio_1.load)(body));
                        if (novels.length)
                            return [2 /*return*/, novels];
                        return [3 /*break*/, 5];
                    case 4:
                        _b = _c.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, []];
                }
            });
        });
    };
    return NetTruyenManga;
}());
exports.default = new NetTruyenManga();
