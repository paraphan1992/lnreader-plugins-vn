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
var NOVEL_PATH = /^\/truyen\/([^/]+)\/(\d+)\/([^/]+)\/?$/;
var SangTacViet = /** @class */ (function () {
    function SangTacViet() {
        this.id = 'sangtacviet';
        this.name = 'Sáng Tác Việt';
        this.icon = 'src/vi/sangtacviet/icon.png';
        this.version = '2.1.3';
        this.webStorageUtilized = true;
        this.pluginSettings = {
            site: {
                value: 'https://sangtacviet.app',
                label: 'Site URL',
            },
        };
        this.filters = {};
    }
    Object.defineProperty(SangTacViet.prototype, "site", {
        get: function () {
            return storage_1.storage.get('site') || 'https://sangtacviet.app';
        },
        enumerable: false,
        configurable: true
    });
    SangTacViet.prototype.toPath = function (href) {
        try {
            var url = href.startsWith('http') ? new URL(href) : new URL(href, this.site);
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
            var cover = loadedCheerio(ele).find('img').attr('src');
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
                chapterNumber: Number(item[1]) || undefined,
            });
        }
        return chapters;
    };
    SangTacViet.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/index.php?ngmar=all&p=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    SangTacViet.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed, body, $, novel, cover, host, bookId, tocUrl, toc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsed = novelPath.match(NOVEL_PATH);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
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
                        cover = $('.bookinfo img, img.cover').attr('src');
                        novel.cover = cover
                            ? cover.startsWith('http')
                                ? cover
                                : cover.startsWith('//')
                                    ? "https:".concat(cover)
                                    : this.site + cover
                            : undefined;
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        if (!parsed) return [3 /*break*/, 3];
                        host = parsed[1], bookId = parsed[3];
                        tocUrl = "".concat(this.site, "/index.php?ngmar=chapterlist&h=").concat(encodeURIComponent(host), "&bookid=").concat(encodeURIComponent(bookId), "&sajax=getchapterlist");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(tocUrl, {
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    Referer: this.site + '/',
                                },
                            }).then(function (r) { return r.json(); })];
                    case 2:
                        toc = _a.sent();
                        if ((toc === null || toc === void 0 ? void 0 : toc.code) === 1 && typeof toc.data === 'string') {
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
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ids = this.chapterIds(chapterPath);
                        if (!ids)
                            return [2 /*return*/, ''];
                        gac = (_a = pageHtml.match(/document\.cookie="_gac=([^";]+)/)) === null || _a === void 0 ? void 0 : _a[1];
                        ac = (_b = pageHtml.match(/document\.cookie="_ac=([^";]+)/)) === null || _b === void 0 ? void 0 : _b[1];
                        cookie = [
                            gac ? "_gac=".concat(gac) : '',
                            ac ? "_ac=".concat(ac) : '',
                        ]
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
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                            method: 'POST',
                                            headers: headers,
                                            body: '',
                                        }).then(function (r) { return r.text(); })];
                                    case 1:
                                        raw = _d.sent();
                                        payload = {};
                                        try {
                                            jsonText = raw.includes('{"')
                                                ? raw.substring(raw.indexOf('{"'))
                                                : raw;
                                            payload = JSON.parse(jsonText);
                                        }
                                        catch (_e) {
                                            payload = {};
                                        }
                                        if (!(String(payload.code) === '7')) return [3 /*break*/, 3];
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                return setTimeout(resolve, Number(payload.time) || 200);
                                            })];
                                    case 2:
                                        _d.sent();
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
                        _c.label = 1;
                    case 1:
                        if (!(attempt < 4)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(attempt)];
                    case 2:
                        state_1 = _c.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        if (state_1 === "break")
                            return [3 /*break*/, 4];
                        _c.label = 3;
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
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath, {
                            headers: { Referer: this.site + '/' },
                        }).then(function (r) { return r.text(); })];
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
                        return [2 /*return*/, ('<p>Sáng Tác Việt chỉ gửi nội dung chương sau khi trình duyệt nguồn đã mở.</p>' +
                                '<p>Mở menu nguồn → WebView, đợi trang hiện xong, quay lại rồi mở lại chương này.</p>')];
                }
            });
        });
    };
    SangTacViet.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchUrl = "".concat(this.site, "/index.php?ngmar=search&s=").concat(encodeURIComponent(searchTerm), "&p=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    return SangTacViet;
}());
exports.default = new SangTacViet();
