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
var filterInputs_1 = require("@libs/filterInputs");
var storage_1 = require("@libs/storage");
var NOVEL_PATH = /^\/truyen\/([^/]+)\/(\d+)\/([^/]+)\/?$/;
var wait = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
function fetchText(url, init) {
    return __awaiter(this, void 0, void 0, function () {
        var lastError, attempt, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < 3)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, init).then(function (r) { return r.text(); })];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    err_1 = _a.sent();
                    lastError = err_1;
                    return [4 /*yield*/, wait(400 * (attempt + 1))];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    attempt++;
                    return [3 /*break*/, 1];
                case 7: throw lastError;
            }
        });
    });
}
var SangTacViet = /** @class */ (function () {
    function SangTacViet() {
        this.id = 'sangtacviet';
        this.name = 'Sáng Tác Việt';
        this.icon = 'src/vi/sangtacviet/icon.png';
        this.version = '2.2.0';
        this.webStorageUtilized = true;
        this.pluginSettings = {
            site: {
                value: 'https://sangtacviet.com',
                label: 'Site URL',
            },
        };
        this.imageRequestInit = {
            headers: { Referer: 'https://sangtacviet.com/' },
        };
        this.filters = {
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sắp xếp',
                value: 'viewweek',
                options: [
                    { label: 'Lượt đọc tuần', value: 'viewweek' },
                    { label: 'Lượt đọc ngày', value: 'viewday' },
                    { label: 'Lượt đọc tổng', value: 'view' },
                    { label: 'Mới cập nhật', value: 'update' },
                    { label: 'Mới nhập kho', value: 'new' },
                    { label: 'Lượt thích', value: 'like' },
                    { label: 'Lượt theo dõi', value: 'following' },
                    { label: 'Lượt đánh dấu', value: 'bookmarked' },
                    { label: 'Đề cử', value: 'auto' },
                ],
            },
            type: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Loại truyện',
                value: '',
                options: [
                    { label: 'Tất cả', value: '' },
                    { label: 'Truyện sáng tác', value: 'sangtac' },
                    { label: 'Truyện dịch', value: 'dich' },
                    { label: 'Txt dịch tự động', value: 'txt' },
                ],
            },
            category: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Thể loại',
                value: '',
                options: [
                    { label: 'Tất cả', value: '' },
                    { label: 'Huyền huyễn', value: 'hh' },
                    { label: 'Đô thị', value: 'dt' },
                    { label: 'Ngôn tình', value: 'nt' },
                    { label: 'Võng du', value: 'vd' },
                    { label: 'Khoa học viễn tưởng', value: 'kh' },
                    { label: 'Lịch sử', value: 'ls' },
                    { label: 'Đồng nhân', value: 'dn' },
                    { label: 'Dị năng', value: 'dna' },
                    { label: 'Linh dị', value: 'ld' },
                    { label: 'Light Novel', value: 'ln' },
                ],
            },
            step: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Tình trạng',
                value: '',
                options: [
                    { label: 'Tất cả', value: '' },
                    { label: 'Hoàn thành', value: '3' },
                    { label: 'Còn tiếp', value: '1' },
                    { label: 'Tạm ngưng', value: '2' },
                    { label: 'Không tạm ngưng', value: '5' },
                ],
            },
        };
    }
    Object.defineProperty(SangTacViet.prototype, "site", {
        get: function () {
            var site = (storage_1.storage.get('site') || '').trim().replace(/\/+$/, '') ||
                'https://sangtacviet.com';
            if (this.imageRequestInit.headers) {
                this.imageRequestInit.headers.Referer = "".concat(site, "/");
            }
            return site;
        },
        enumerable: false,
        configurable: true
    });
    SangTacViet.prototype.toPath = function (href) {
        try {
            var url = href.startsWith('http')
                ? new URL(href)
                : new URL(href, this.site);
            return url.pathname.endsWith('/') ? url.pathname : "".concat(url.pathname, "/");
        }
        catch (_a) {
            return href.replace(this.site, '');
        }
    };
    SangTacViet.prototype.stripAds = function ($) {
        $('script, style, iframe, .ads, .adsbygoogle, [class*="quangcao"]').remove();
    };
    SangTacViet.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('a[href*="/truyen/"]').each(function (_, ele) {
            var href = loadedCheerio(ele).attr('href') || '';
            var path = _this.toPath(href);
            if (!NOVEL_PATH.test(path))
                return;
            var novelName = loadedCheerio(ele).find('.searchbooktitle, b').text().trim() ||
                loadedCheerio(ele).text().trim();
            var cover = loadedCheerio(ele).find('img').attr('src') ||
                loadedCheerio(ele).find('img').attr('data-src') ||
                loadedCheerio(ele).parent().find('img').attr('src');
            if (!novelName || novels.some(function (n) { return n.path === path; }))
                return;
            novels.push({
                name: novelName,
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
    SangTacViet.prototype.parseTocPayload = function (data, novelPath) {
        var match = novelPath.match(NOVEL_PATH);
        if (!match)
            return [];
        var host = match[1], vol = match[2], bookId = match[3];
        var chapters = [];
        var row = /(\d+)-\/-(-?\d+)-\/-\s*(.*?)-\/\/-/g;
        var item;
        var padded = data.endsWith('-//-') ? data : "".concat(data, "-//-");
        while ((item = row.exec(padded))) {
            var chapterId = item[2];
            var name_1 = item[3].trim();
            if (!chapterId || !name_1)
                continue;
            chapters.push({
                name: name_1,
                path: "/truyen/".concat(host, "/").concat(vol, "/").concat(bookId, "/").concat(chapterId, "/"),
                chapterNumber: chapters.length + 1,
            });
        }
        return chapters;
    };
    /** Same endpoint the site's /search/ page calls; supports paging. */
    SangTacViet.prototype.searchBooks = function (params, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var query, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = Object.entries(__assign(__assign({}, params), { p: String(pageNo) }))
                            .map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return "".concat(key, "=").concat(encodeURIComponent(value));
                        })
                            .join('&');
                        return [4 /*yield*/, fetchText("".concat(this.site, "/io/searchtp/searchBooks?").concat(query), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    Referer: "".concat(this.site, "/search/"),
                                },
                                body: 'ignores=',
                            })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    SangTacViet.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var filters, params, novels, _a, body;
            var _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        filters = options === null || options === void 0 ? void 0 : options.filters;
                        params = {
                            find: '',
                            minc: '0',
                            sort: (options === null || options === void 0 ? void 0 : options.showLatestNovels)
                                ? 'update'
                                : ((_c = (_b = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 'viewweek'),
                        };
                        if ((_d = filters === null || filters === void 0 ? void 0 : filters.type) === null || _d === void 0 ? void 0 : _d.value)
                            params.type = filters.type.value;
                        if ((_e = filters === null || filters === void 0 ? void 0 : filters.category) === null || _e === void 0 ? void 0 : _e.value)
                            params.category = filters.category.value;
                        if ((_f = filters === null || filters === void 0 ? void 0 : filters.step) === null || _f === void 0 ? void 0 : _f.value)
                            params.step = filters.step.value;
                        params.tag = '';
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.searchBooks(params, pageNo)];
                    case 2:
                        novels = _g.sent();
                        if (novels.length || pageNo > 1)
                            return [2 /*return*/, novels];
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _g.sent();
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, fetchText("".concat(this.site, "/index.php?ngmar=all"))];
                    case 5:
                        body = _g.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    SangTacViet.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed, body, $, novel, infoThumb, infoAuthor, infoMatch, info, cover, bookName, host, bookId, tocUrl, tocText, toc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsed = novelPath.match(NOVEL_PATH);
                        return [4 /*yield*/, fetchText(this.site + novelPath)];
                    case 1:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        this.stripAds($);
                        novel = {
                            path: novelPath,
                            name: $('h1').first().text().trim() || 'Truyện Sáng Tác',
                            chapters: [],
                            totalPages: 1,
                        };
                        infoThumb = '';
                        infoAuthor = '';
                        infoMatch = body.match(/bookinfo\s*=\s*(\{[\s\S]*?\});/);
                        if (infoMatch) {
                            try {
                                info = JSON.parse(infoMatch[1]);
                                infoThumb = String(info.thumb || '');
                                infoAuthor = String(info.author || '');
                            }
                            catch (_b) {
                                infoThumb = '';
                            }
                        }
                        cover = infoThumb ||
                            $('meta[property="og:image"]').attr('content') ||
                            $('#thumb-prop').attr('data-src') ||
                            $('.bookinfo img, img.cover').attr('src') ||
                            $('.bookinfo img, img.cover').attr('data-src') ||
                            $('img[src*="bookcover"], img[src*="qdbimg"]').attr('src');
                        novel.cover = cover
                            ? cover.startsWith('http')
                                ? cover
                                : cover.startsWith('//')
                                    ? "https:".concat(cover)
                                    : this.site + cover
                            : undefined;
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        novel.author = $('h2').first().text().trim() || infoAuthor || undefined;
                        novel.summary = $('.textzoom').first().text().replace(/\s+/g, ' ').trim();
                        bookName = $('#book_name2').first().text().trim();
                        if (bookName)
                            novel.name = bookName;
                        if (!parsed) return [3 /*break*/, 3];
                        host = parsed[1], bookId = parsed[3];
                        tocUrl = "".concat(this.site, "/index.php?ngmar=chapterlist&h=").concat(encodeURIComponent(host), "&bookid=").concat(encodeURIComponent(bookId), "&sajax=getchapterlist");
                        return [4 /*yield*/, fetchText(tocUrl, {
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    Referer: this.site + '/',
                                },
                            })];
                    case 2:
                        tocText = _a.sent();
                        toc = {};
                        try {
                            toc = JSON.parse(tocText.substring(Math.max(0, tocText.indexOf('{'))));
                        }
                        catch (_c) {
                            toc = {};
                        }
                        if (String(toc.code) === '1' && typeof toc.data === 'string') {
                            novel.chapters = this.parseTocPayload(toc.data, novelPath);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, novel];
                }
            });
        });
    };
    SangTacViet.prototype.parsePage = function (novelPath, _page) {
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
    SangTacViet.prototype.chapterIds = function (chapterPath) {
        var match = chapterPath.match(/^\/truyen\/([^/]+)\/(\d+)\/([^/]+)\/([^/]+)\/?$/);
        if (!match)
            return null;
        return { host: match[1], bookId: match[3], chapId: match[4] };
    };
    SangTacViet.prototype.readChapterAjax = function (chapterPath, pageHtml) {
        return __awaiter(this, void 0, void 0, function () {
            var ids, gac, ac, cookie, url, headers, _loop_1, attempt, state_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        ids = this.chapterIds(chapterPath);
                        if (!ids)
                            return [2 /*return*/, ''];
                        gac = ((_a = pageHtml.match(/document\.cookie\s*=\s*["']_gac=([^"';]+)/)) === null || _a === void 0 ? void 0 : _a[1]) ||
                            ((_b = pageHtml.match(/_gac=([^"';\s]+)/)) === null || _b === void 0 ? void 0 : _b[1]);
                        ac = ((_c = pageHtml.match(/document\.cookie\s*=\s*["']_ac=([^"';]+)/)) === null || _c === void 0 ? void 0 : _c[1]) ||
                            ((_d = pageHtml.match(/_ac=([^"';\s]+)/)) === null || _d === void 0 ? void 0 : _d[1]);
                        cookie = [gac ? "_gac=".concat(gac) : '', ac ? "_ac=".concat(ac) : '']
                            .filter(Boolean)
                            .join('; ');
                        url = "".concat(this.site, "/index.php?bookid=").concat(encodeURIComponent(ids.bookId)) +
                            "&h=".concat(encodeURIComponent(ids.host), "&c=").concat(encodeURIComponent(ids.chapId), "&ngmar=readc&sajax=readchapter&sty=1&exts=");
                        headers = {
                            'X-Requested-With': 'XMLHttpRequest',
                            Referer: this.site + chapterPath,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        };
                        if (cookie)
                            headers.Cookie = cookie;
                        _loop_1 = function (attempt) {
                            var raw, payload, jsonText;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                            method: 'POST',
                                            headers: headers,
                                            body: '',
                                        }).then(function (r) { return r.text(); })];
                                    case 1:
                                        raw = _f.sent();
                                        payload = {};
                                        try {
                                            jsonText = raw.includes('{"')
                                                ? raw.substring(raw.indexOf('{"'))
                                                : raw;
                                            payload = JSON.parse(jsonText);
                                        }
                                        catch (_g) {
                                            payload = {};
                                        }
                                        if (!(String(payload.code) === '7')) return [3 /*break*/, 3];
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                return setTimeout(resolve, Number(payload.time) || 200);
                                            })];
                                    case 2:
                                        _f.sent();
                                        return [2 /*return*/, "continue"];
                                    case 3:
                                        if (String(payload.code) === '0' && typeof payload.data === 'string') {
                                            return [2 /*return*/, { value: payload.data }];
                                        }
                                        return [2 /*return*/, "break"];
                                }
                            });
                        };
                        attempt = 0;
                        _e.label = 1;
                    case 1:
                        if (!(attempt < 4)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(attempt)];
                    case 2:
                        state_1 = _e.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        if (state_1 === "break")
                            return [3 /*break*/, 4];
                        _e.label = 3;
                    case 3:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, ''];
                }
            });
        });
    };
    SangTacViet.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, ajaxHtml, content, $, html, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchText(this.site + chapterPath, {
                            headers: { Referer: this.site + '/' },
                        })];
                    case 1:
                        body = _a.sent();
                        return [4 /*yield*/, this.readChapterAjax(chapterPath, body)];
                    case 2:
                        ajaxHtml = _a.sent();
                        if (ajaxHtml && ajaxHtml.replace(/<[^>]+>/g, '').trim().length > 80) {
                            content = (0, cheerio_1.load)(ajaxHtml);
                            this.stripAds(content);
                            return [2 /*return*/, content.html() || ajaxHtml];
                        }
                        $ = (0, cheerio_1.load)(body);
                        this.stripAds($);
                        $('#hiddenid').remove();
                        html = $('#maincontent').html() ||
                            $('.contentbox').html() ||
                            $('#chapter-content').html() ||
                            '';
                        text = html.replace(/<[^>]+>/g, '').trim();
                        if (text.length > 80 && !text.includes('Nhấp vào để tải chương')) {
                            return [2 /*return*/, html];
                        }
                        // The chapter API is gated by the site's in-browser anti-bot script; it
                        // only answers once a real WebView session has run it and set cookies.
                        return [2 /*return*/, ('<p>Sáng Tác Việt chỉ trả nội dung chương cho phiên trình duyệt đã mở trang.</p>' +
                                '<p>Bấm biểu tượng quả địa cầu (Mở WebView) ở chương này, đợi chữ hiện ra, ' +
                                'quay lại rồi kéo xuống để tải lại chương.</p>')];
                }
            });
        });
    };
    SangTacViet.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.searchBooks({ find: searchTerm.normalize('NFC').trim(), minc: '0', tag: '' }, pageNo)];
            });
        });
    };
    return SangTacViet;
}());
exports.default = new SangTacViet();
