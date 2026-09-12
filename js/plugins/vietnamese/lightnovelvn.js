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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var jszip_1 = __importDefault(require("jszip"));
var fetch_1 = require("@libs/fetch");
var storage_1 = require("@libs/storage");
var aes_1 = require("@libs/aes");
var b64ToBytes = function (value) {
    return Uint8Array.from(atob(value), function (c) { return c.charCodeAt(0); });
};
var joinZipPath = function (fromFile, href) {
    var raw = href.split('#')[0].split('?')[0];
    if (!raw)
        return fromFile;
    if (/^https?:\/\//i.test(raw))
        return raw;
    if (raw.startsWith('/'))
        return raw.replace(/^\/+/, '');
    var parts = fromFile.split('/');
    parts.pop();
    for (var _i = 0, _a = raw.split('/'); _i < _a.length; _i++) {
        var seg = _a[_i];
        if (!seg || seg === '.')
            continue;
        if (seg === '..')
            parts.pop();
        else
            parts.push(seg);
    }
    return parts.join('/');
};
var LightNovelVN = /** @class */ (function () {
    function LightNovelVN() {
        this.id = 'lightnovel.vn';
        this.name = 'Light Novel VN';
        this.version = '2.1.1';
        this.icon = 'src/vi/lightnovelvn/icon.png';
        this.pluginSettings = {
            site: {
                value: 'https://hub.ranobe.vn',
                label: 'Site URL',
            },
        };
        this.readerOrigin = 'https://hub.lightnovel.vn';
    }
    Object.defineProperty(LightNovelVN.prototype, "site", {
        get: function () {
            return storage_1.storage.get('site') || 'https://hub.ranobe.vn';
        },
        enumerable: false,
        configurable: true
    });
    LightNovelVN.prototype.readerHeaders = function (extra) {
        return __assign({ Origin: this.readerOrigin, Referer: "".concat(this.readerOrigin, "/reader/") }, extra);
    };
    LightNovelVN.prototype.collectBooks = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('a[href*="reader?book="]').each(function (_, ele) {
            var _a, _b, _c;
            var href = loadedCheerio(ele).attr('href') || '';
            var book = (_a = href.match(/book=([a-f0-9-]+)/i)) === null || _a === void 0 ? void 0 : _a[1];
            if (!book)
                return;
            var path = "/book/".concat(book);
            var name = ((_b = loadedCheerio(ele).attr('title')) === null || _b === void 0 ? void 0 : _b.trim()) ||
                loadedCheerio(ele).text().trim() ||
                ((_c = loadedCheerio(ele).find('img').attr('alt')) === null || _c === void 0 ? void 0 : _c.trim()) ||
                book;
            if (novels.some(function (n) { return n.path === path; }))
                return;
            var cover = loadedCheerio(ele).find('img').attr('src');
            novels.push({
                name: name,
                path: path,
                cover: cover
                    ? cover.startsWith('http')
                        ? cover
                        : _this.site + cover
                    : undefined,
            });
        });
        return novels;
    };
    LightNovelVN.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/').then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.collectBooks((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    LightNovelVN.prototype.parseChapters = function () {
        return [];
    };
    LightNovelVN.prototype.skipSpineId = function (id, href) {
        return /nav|toc|ncx/i.test("".concat(id, " ").concat(href));
    };
    LightNovelVN.prototype.htmlFromZip = function (zip, filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var file, xml, $, nodes, _loop_1, _i, nodes_1, item, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = zip.file(filePath);
                        if (!file)
                            return [2 /*return*/, ''];
                        return [4 /*yield*/, file.async('string')];
                    case 1:
                        xml = _a.sent();
                        $ = (0, cheerio_1.load)(xml);
                        $('script, style').remove();
                        $('image').each(function (_, el) {
                            var node = $(el);
                            var src = node.attr('src') ||
                                node.attr('href') ||
                                node.attr('xlink:href') ||
                                '';
                            if (!src)
                                return;
                            node.replaceWith($('<img/>').attr('src', src).attr('alt', ''));
                        });
                        nodes = [];
                        $('img').each(function (_, el) {
                            var node = $(el);
                            var src = node.attr('src') || '';
                            if (src && !src.startsWith('data:') && !/^https?:\/\//i.test(src)) {
                                nodes.push({ src: src, zipPath: joinZipPath(filePath, src) });
                            }
                        });
                        _loop_1 = function (item) {
                            var imgFile, buf, lower, mime, binary, chunk, i, dataUri;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        imgFile = zip.file(item.zipPath);
                                        if (!imgFile)
                                            return [2 /*return*/, "continue"];
                                        return [4 /*yield*/, imgFile.async('uint8array')];
                                    case 1:
                                        buf = _b.sent();
                                        if (buf.byteLength > 8000000)
                                            return [2 /*return*/, "continue"];
                                        lower = item.zipPath.toLowerCase();
                                        mime = lower.endsWith('.png')
                                            ? 'image/png'
                                            : lower.endsWith('.webp')
                                                ? 'image/webp'
                                                : lower.endsWith('.gif')
                                                    ? 'image/gif'
                                                    : 'image/jpeg';
                                        binary = '';
                                        chunk = 0x8000;
                                        for (i = 0; i < buf.length; i += chunk) {
                                            binary += String.fromCharCode.apply(String, buf.subarray(i, i + chunk));
                                        }
                                        dataUri = "data:".concat(mime, ";base64,").concat(btoa(binary));
                                        $("img[src=\"".concat(item.src, "\"], image[href=\"").concat(item.src, "\"]")).each(function (_, el) {
                                            var node = $(el);
                                            node.attr('src', dataUri);
                                            node.attr('href', dataUri);
                                            node.attr('xlink:href', dataUri);
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, nodes_1 = nodes;
                        _a.label = 2;
                    case 2:
                        if (!(_i < nodes_1.length)) return [3 /*break*/, 5];
                        item = nodes_1[_i];
                        return [5 /*yield**/, _loop_1(item)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        html = $('body').html() || $.root().html() || xml;
                        return [2 /*return*/, html];
                }
            });
        });
    };
    LightNovelVN.prototype.loadBook = function (bookId) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenRes, tokenJson, epubRes, encrypted, _a, key, iv, data, plain, zip, opfPath, opf, title, author, manifest, itemRe, item, attrs, id, href, spineIds, chapters, _i, spineIds_1, id, href, filePath, file, xml, textLen, name_1, book;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        if (((_b = this.cached) === null || _b === void 0 ? void 0 : _b.id) === bookId)
                            return [2 /*return*/, this.cached.book];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.readerOrigin, "/api/reader/token?book=").concat(encodeURIComponent(bookId)), { headers: this.readerHeaders() })];
                    case 1:
                        tokenRes = _m.sent();
                        return [4 /*yield*/, tokenRes.json()];
                    case 2:
                        tokenJson = (_m.sent());
                        if (!tokenJson.token || !tokenJson.key) {
                            throw new Error(tokenJson.msg || 'Hub từ chối cấp token EPUB');
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.readerOrigin, "/uploads/ebooks/").concat(bookId, ".epub"), {
                                headers: this.readerHeaders({
                                    'X-Reader-Token': tokenJson.token,
                                }),
                            })];
                    case 3:
                        epubRes = _m.sent();
                        if (!epubRes.ok) {
                            throw new Error("Kh\u00F4ng t\u1EA3i \u0111\u01B0\u1EE3c EPUB (".concat(epubRes.status, ")"));
                        }
                        _a = Uint8Array.bind;
                        return [4 /*yield*/, epubRes.arrayBuffer()];
                    case 4:
                        encrypted = new (_a.apply(Uint8Array, [void 0, _m.sent()]))();
                        key = b64ToBytes(tokenJson.key);
                        iv = encrypted.subarray(0, 12);
                        data = encrypted.subarray(12);
                        plain = (0, aes_1.gcm)(key, iv).decrypt(data);
                        return [4 /*yield*/, jszip_1.default.loadAsync(plain)];
                    case 5:
                        zip = _m.sent();
                        opfPath = Object.keys(zip.files).find(function (n) { return n.toLowerCase().endsWith('.opf'); }) || '';
                        if (!opfPath)
                            throw new Error('EPUB không có file OPF');
                        return [4 /*yield*/, zip.file(opfPath).async('string')];
                    case 6:
                        opf = _m.sent();
                        title = ((_d = (_c = opf.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i)) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.trim()) ||
                            'Light Novel Hub';
                        author = (_f = (_e = opf
                            .match(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/i)) === null || _e === void 0 ? void 0 : _e[1]) === null || _f === void 0 ? void 0 : _f.trim();
                        manifest = new Map();
                        itemRe = /<item\b([^>]+)>/gi;
                        while ((item = itemRe.exec(opf))) {
                            attrs = item[1];
                            id = (_g = attrs.match(/\bid="([^"]+)"/i)) === null || _g === void 0 ? void 0 : _g[1];
                            href = (_h = attrs.match(/\bhref="([^"]+)"/i)) === null || _h === void 0 ? void 0 : _h[1];
                            if (id && href)
                                manifest.set(id, href);
                        }
                        spineIds = __spreadArray([], opf.matchAll(/idref="([^"]+)"/gi), true).map(function (m) { return m[1]; });
                        chapters = [];
                        _i = 0, spineIds_1 = spineIds;
                        _m.label = 7;
                    case 7:
                        if (!(_i < spineIds_1.length)) return [3 /*break*/, 10];
                        id = spineIds_1[_i];
                        href = manifest.get(id);
                        if (!href)
                            return [3 /*break*/, 9];
                        if (this.skipSpineId(id, href))
                            return [3 /*break*/, 9];
                        filePath = joinZipPath(opfPath, href);
                        file = zip.file(filePath);
                        if (!file)
                            return [3 /*break*/, 9];
                        return [4 /*yield*/, file.async('string')];
                    case 8:
                        xml = _m.sent();
                        textLen = xml.replace(/<[^>]+>/g, '').trim().length;
                        if (textLen < 20 && !/<img|<image /i.test(xml))
                            return [3 /*break*/, 9];
                        name_1 = ((_k = (_j = xml.match(/<h1[^>]*>([^<]+)<\/h1>/i)) === null || _j === void 0 ? void 0 : _j[1]) === null || _k === void 0 ? void 0 : _k.trim()) ||
                            ((_l = filePath.split('/').pop()) === null || _l === void 0 ? void 0 : _l.replace(/\.[^.]+$/, '')) ||
                            "Ph\u1EA7n ".concat(chapters.length + 1);
                        chapters.push({
                            name: name_1,
                            path: "/book/".concat(bookId, "/").concat(chapters.length),
                            filePath: filePath,
                        });
                        _m.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 7];
                    case 10:
                        if (!chapters.length) {
                            throw new Error('EPUB không có chương đọc được');
                        }
                        book = { title: title, author: author, zip: zip, chapters: chapters };
                        this.cached = { id: bookId, book: book };
                        return [2 /*return*/, book];
                }
            });
        });
    };
    LightNovelVN.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var bookId, listing, card, book;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bookId = novelPath.replace(/^\/book\//, '').split('/')[0];
                        return [4 /*yield*/, this.popularNovels(1)];
                    case 1:
                        listing = _a.sent();
                        card = listing.find(function (n) { return n.path === "/book/".concat(bookId); });
                        return [4 /*yield*/, this.loadBook(bookId)];
                    case 2:
                        book = _a.sent();
                        return [2 /*return*/, {
                                path: "/book/".concat(bookId),
                                name: (card === null || card === void 0 ? void 0 : card.name) || book.title,
                                cover: card === null || card === void 0 ? void 0 : card.cover,
                                author: book.author,
                                chapters: book.chapters.map(function (ch, i) { return ({
                                    name: ch.name,
                                    path: ch.path,
                                    chapterNumber: i + 1,
                                }); }),
                                totalPages: 1,
                            }];
                }
            });
        });
    };
    LightNovelVN.prototype.parsePage = function (_novelPath, _page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { chapters: [] }];
            });
        });
    };
    LightNovelVN.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, bookId, index, book, chapter, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parts = chapterPath.split('/').filter(Boolean);
                        bookId = parts[1];
                        index = Number(parts[2]);
                        if (!bookId || Number.isNaN(index)) {
                            throw new Error('Đường dẫn chương Hub không hợp lệ');
                        }
                        return [4 /*yield*/, this.loadBook(bookId)];
                    case 1:
                        book = _a.sent();
                        chapter = book.chapters[index];
                        if (!chapter)
                            throw new Error('Không tìm thấy chương trong EPUB');
                        return [4 /*yield*/, this.htmlFromZip(book.zip, chapter.filePath)];
                    case 2:
                        html = _a.sent();
                        if ((html || '').length >= 200)
                            return [2 /*return*/, html];
                        return [2 /*return*/, ("".concat(html, "<p>").concat(book.title, "</p><p>").concat(chapter.name, "</p>") +
                                '<p>Trang EPUB này chủ yếu là ảnh minh họa; mở chương kế để đọc nội dung.</p>')];
                }
            });
        });
    };
    LightNovelVN.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, q;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.popularNovels(1)];
                    case 1:
                        novels = _a.sent();
                        q = searchTerm.trim().toLowerCase();
                        return [2 /*return*/, novels.filter(function (n) { return n.name.toLowerCase().includes(q); })];
                }
            });
        });
    };
    return LightNovelVN;
}());
exports.default = new LightNovelVN();
