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
/** WikiCV `signFunc`: Latin-1 SHA-256. */
var sha256Latin1 = function sha256Latin1(W) {
    var self = sha256Latin1;
    var V = function (d, c) { return (d >>> c) | (d << (32 - c)); };
    var S = Math.pow;
    var R = S(2, 32);
    var P = '';
    var O = [];
    var N = 8 * W.length;
    var M = (self.h = self.h || []);
    var L = (self.k = self.k || []);
    var K = L.length;
    var J = {};
    for (var I = 2; 64 > K; I++) {
        if (!J[I]) {
            for (var U = 0; 313 > U; U += I) {
                J[U] = I;
            }
            M[K] = (S(I, 0.5) * R) | 0;
            L[K++] = (S(I, 1 / 3) * R) | 0;
        }
    }
    var padded = W + '\x80';
    while (padded.length % 64 !== 56) {
        padded += '\x00';
    }
    for (var U = 0; U < padded.length; U++) {
        var T = padded.charCodeAt(U);
        if (T >> 8) {
            return '';
        }
        O[U >> 2] |= T << (((3 - U) % 4) * 8);
    }
    O[O.length] = (N / R) | 0;
    O[O.length] = N;
    var hash = M;
    for (var T = 0; T < O.length;) {
        var H = O.slice(T, (T += 16));
        var G = hash;
        hash = hash.slice(0, 8);
        for (var U = 0; 64 > U; U++) {
            var F = H[U - 15];
            var E = H[U - 2];
            var D = hash[0];
            var C = hash[4];
            var B = hash[7] +
                (V(C, 6) ^ V(C, 11) ^ V(C, 25)) +
                ((C & hash[5]) ^ (~C & hash[6])) +
                L[U] +
                (H[U] =
                    16 > U
                        ? H[U]
                        : (H[U - 16] +
                            (V(F, 7) ^ V(F, 18) ^ (F >>> 3)) +
                            H[U - 7] +
                            (V(E, 17) ^ V(E, 19) ^ (E >>> 10))) |
                            0);
            var A = (V(D, 2) ^ V(D, 13) ^ V(D, 22)) +
                ((D & hash[1]) ^ (D & hash[2]) ^ (hash[1] & hash[2]));
            hash = [B + A | 0].concat(hash);
            hash[4] = hash[4] + B | 0;
        }
        for (var U = 0; 8 > U; U++) {
            hash[U] = hash[U] + G[U] | 0;
        }
    }
    for (var U = 0; 8 > U; U++) {
        for (var T = 3; T + 1; T--) {
            var z = (hash[U] >> (8 * T)) & 255;
            P += (z < 16 ? '0' : '') + z.toString(16);
        }
    }
    return P;
};
function fuzzySign(text) {
    return text.substring(19) + text.substring(0, 19);
}
var WikiDich = /** @class */ (function () {
    function WikiDich() {
        this.id = 'wikidich';
        this.name = 'Wiki Dịch (WikiCV)';
        this.icon = 'src/vi/wikidich/icon.png';
        this.version = '2.3.0';
        this.pluginSettings = {
            site: {
                value: 'https://wikicv.org',
                label: 'Site URL',
            },
        };
        this.filters = {};
    }
    Object.defineProperty(WikiDich.prototype, "site", {
        get: function () {
            return storage_1.storage.get('site') || 'https://wikicv.org';
        },
        enumerable: false,
        configurable: true
    });
    WikiDich.prototype.toPath = function (href) {
        try {
            var url = href.startsWith('http') ? new URL(href) : new URL(href, this.site);
            return url.pathname;
        }
        catch (_a) {
            return href.replace(this.site, '');
        }
    };
    WikiDich.prototype.stripAds = function ($) {
        $('script, style, iframe, .ads, [class*="ad-"], [class*="quangcao"]').remove();
    };
    WikiDich.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('a[href*="/truyen/"]').each(function (_, ele) {
            var href = loadedCheerio(ele).attr('href') || '';
            var path = _this.toPath(href);
            if (!/^\/truyen\/[^/]+$/.test(path))
                return;
            var name = loadedCheerio(ele).text().trim() ||
                loadedCheerio(ele).attr('title') ||
                '';
            if (!name ||
                name.length < 2 ||
                name.includes('Đăng bài') ||
                novels.some(function (n) { return n.path === path; })) {
                return;
            }
            novels.push({ name: name, path: path });
        });
        return novels;
    };
    WikiDich.prototype.parseChapters = function (loadedCheerio) {
        var _this = this;
        var chapters = [];
        loadedCheerio('a[href*="/truyen/"]').each(function (_, ele) {
            var href = loadedCheerio(ele).attr('href') || '';
            if (href.includes('/review/'))
                return;
            var path = _this.toPath(href);
            var parts = path.split('/').filter(Boolean);
            if (parts[0] !== 'truyen' || parts.length < 3)
                return;
            var name = loadedCheerio(ele).text().trim();
            if (!name || chapters.some(function (c) { return c.path === path; }))
                return;
            chapters.push({ name: name, path: path });
        });
        return chapters;
    };
    WikiDich.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = pageNo > 1
                            ? "".concat(this.site, "/chuong-moi?page=").concat(pageNo)
                            : "".concat(this.site, "/");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    WikiDich.prototype.fetchToc = function (html, novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var bookId, signKey, pageSize, chapters, seen, headers, start, sign, tocUrl, toc, batch, _i, batch_1, ch;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        bookId = (_a = html.match(/bookId\s*=\s*"([^"]+)"/)) === null || _a === void 0 ? void 0 : _a[1];
                        signKey = (_b = html.match(/signKey\s*=\s*"([^"]+)"/)) === null || _b === void 0 ? void 0 : _b[1];
                        if (!bookId || !signKey) {
                            return [2 /*return*/, this.parseChapters((0, cheerio_1.load)(html))];
                        }
                        pageSize = 99;
                        chapters = [];
                        seen = new Set();
                        headers = {
                            'X-Requested-With': 'XMLHttpRequest',
                            Referer: this.site + (novelPath || '/'),
                        };
                        start = 0;
                        _c.label = 1;
                    case 1:
                        if (!(start < 20000)) return [3 /*break*/, 4];
                        sign = sha256Latin1(fuzzySign(signKey + start + pageSize));
                        tocUrl = "".concat(this.site, "/book/index?bookId=").concat(encodeURIComponent(bookId)) +
                            "&start=".concat(start, "&size=").concat(pageSize, "&signKey=").concat(encodeURIComponent(signKey), "&sign=").concat(sign);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(tocUrl, { headers: headers })
                                .then(function (r) { return r.text(); })
                                .catch(function () { return ''; })];
                    case 2:
                        toc = _c.sent();
                        batch = toc ? this.parseChapters((0, cheerio_1.load)(toc)) : [];
                        for (_i = 0, batch_1 = batch; _i < batch_1.length; _i++) {
                            ch = batch_1[_i];
                            if (seen.has(ch.path))
                                continue;
                            seen.add(ch.path);
                            chapters.push(__assign(__assign({}, ch), { chapterNumber: chapters.length + 1 }));
                        }
                        if (batch.length < pageSize)
                            return [3 /*break*/, 4];
                        _c.label = 3;
                    case 3:
                        start += pageSize;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, chapters.length ? chapters : this.parseChapters((0, cheerio_1.load)(html))];
                }
            });
        });
    };
    WikiDich.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, $, novel, cover, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _b.sent();
                        $ = (0, cheerio_1.load)(body);
                        this.stripAds($);
                        novel = {
                            path: novelPath,
                            name: $('.book-info h1, h2.title, h1.title, h1').first().text().trim() ||
                                'Truyện Wiki',
                            chapters: [],
                            totalPages: 1,
                        };
                        cover = $('.book-info img, .cover img, img[alt*="cover"]').attr('src');
                        novel.cover = cover
                            ? cover.startsWith('http')
                                ? cover
                                : this.site + cover
                            : undefined;
                        novel.summary = $('.book-desc-detail, .story-desc, .desc-text')
                            .text()
                            .trim();
                        novel.author = $('a[href*="/tac-gia/"]').text().trim();
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        _a = novel;
                        return [4 /*yield*/, this.fetchToc(body, novelPath)];
                    case 2:
                        _a.chapters = _b.sent();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    WikiDich.prototype.parsePage = function (novelPath, _page) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _b.sent();
                        _a = {};
                        return [4 /*yield*/, this.fetchToc(body, novelPath)];
                    case 2: return [2 /*return*/, (_a.chapters = _b.sent(), _a)];
                }
            });
        });
    };
    WikiDich.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        this.stripAds($);
                        return [2 /*return*/, ($('#bookContentBody').html() ||
                                $('.reading-content').html() ||
                                $('.chapter-content').html() ||
                                '')];
                }
            });
        });
    };
    WikiDich.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchUrl = "".concat(this.site, "/tim-kiem?q=").concat(encodeURIComponent(searchTerm), "&page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    return WikiDich;
}());
exports.default = new WikiDich();
