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
var decodeZipSeg = function (seg) {
    try {
        return decodeURIComponent(seg);
    }
    catch (_a) {
        return seg;
    }
};
var joinZipPath = function (fromFile, href) {
    var raw = href.split('#')[0].split('?')[0];
    if (!raw)
        return fromFile;
    raw = decodeZipSeg(raw);
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
            parts.push(decodeZipSeg(seg));
    }
    return parts.join('/');
};
var zipLookup = function (zip, path) {
    var direct = zip.file(path) ||
        zip.file(encodeURI(path)) ||
        (function () {
            try {
                return zip.file(decodeURIComponent(path));
            }
            catch (_a) {
                return null;
            }
        })();
    if (direct)
        return direct;
    var norm = path.replace(/\\/g, '/').toLowerCase();
    var key = Object.keys(zip.files).find(function (name) { return name.replace(/\\/g, '/').toLowerCase() === norm; });
    return key ? zip.file(key) : null;
};
var wait = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
function fetchRetry(url, init) {
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
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, init)];
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
var cleanTitle = function (value) {
    return value
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
};
/** Maps each content file to the first TOC title that points at it. */
function readTocTitles(zip, opfPath, opfFlat, manifestItems) {
    return __awaiter(this, void 0, void 0, function () {
        var titles, add, navItem, navPath_1, navFile, $_1, _a, tocNav, tocId_1, ncxItem, ncxPath_1, ncxFile, $_2, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    titles = new Map();
                    add = function (fromFile, href, title) {
                        var name = cleanTitle(title);
                        if (!href || !name)
                            return;
                        var target = joinZipPath(fromFile, href).toLowerCase();
                        if (!titles.has(target))
                            titles.set(target, name);
                    };
                    navItem = manifestItems.find(function (item) {
                        return /\bproperties="[^"]*\bnav\b/i.test(item.attrs);
                    });
                    if (!navItem) return [3 /*break*/, 2];
                    navPath_1 = joinZipPath(opfPath, navItem.href);
                    navFile = zipLookup(zip, navPath_1);
                    if (!navFile) return [3 /*break*/, 2];
                    _a = cheerio_1.load;
                    return [4 /*yield*/, navFile.async('string')];
                case 1:
                    $_1 = _a.apply(void 0, [_d.sent(), { xmlMode: true }]);
                    tocNav = $_1('nav')
                        .filter(function (_, el) { return /toc/i.test($_1(el).attr('epub:type') || ''); })
                        .first();
                    (tocNav.length ? tocNav : $_1('nav').first()).find('a').each(function (_, el) {
                        add(navPath_1, $_1(el).attr('href') || '', $_1(el).text());
                    });
                    _d.label = 2;
                case 2:
                    if (!!titles.size) return [3 /*break*/, 4];
                    tocId_1 = (_c = opfFlat.match(/<spine\b[^>]*\btoc="([^"]+)"/i)) === null || _c === void 0 ? void 0 : _c[1];
                    ncxItem = manifestItems.find(function (item) { return item.id === tocId_1; }) ||
                        manifestItems.find(function (item) { return /\.ncx$/i.test(item.href); });
                    if (!ncxItem) return [3 /*break*/, 4];
                    ncxPath_1 = joinZipPath(opfPath, ncxItem.href);
                    ncxFile = zipLookup(zip, ncxPath_1);
                    if (!ncxFile) return [3 /*break*/, 4];
                    _b = cheerio_1.load;
                    return [4 /*yield*/, ncxFile.async('string')];
                case 3:
                    $_2 = _b.apply(void 0, [_d.sent(), { xmlMode: true }]);
                    $_2('navPoint').each(function (_, el) {
                        var point = $_2(el);
                        add(ncxPath_1, point.children('content').attr('src') || '', point.children('navLabel').first().text());
                    });
                    _d.label = 4;
                case 4: return [2 /*return*/, titles];
            }
        });
    });
}
var LightNovelVN = /** @class */ (function () {
    function LightNovelVN() {
        this.id = 'lightnovel.vn';
        this.name = 'Light Novel VN';
        this.version = '2.2.1';
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
            var site = (storage_1.storage.get('site') || '').trim();
            return site.replace(/\/+$/, '') || 'https://hub.ranobe.vn';
        },
        enumerable: false,
        configurable: true
    });
    LightNovelVN.prototype.readerHeaders = function (extra) {
        return __assign({ Origin: this.readerOrigin, Referer: "".concat(this.readerOrigin, "/reader/") }, extra);
    };
    LightNovelVN.prototype.absCover = function (src) {
        if (!src)
            return undefined;
        var value = src.trim();
        if (!value || value.startsWith('data:'))
            return undefined;
        if (value.includes('_next/image')) {
            try {
                var parsed = new URL(value, this.site);
                var inner = parsed.searchParams.get('url');
                if (inner)
                    value = inner;
            }
            catch (_a) {
                // keep original
            }
        }
        if (value.startsWith('http'))
            return value;
        if (value.startsWith('//'))
            return "https:".concat(value);
        return this.site + (value.startsWith('/') ? value : "/".concat(value));
    };
    LightNovelVN.prototype.collectBooks = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('a[href*="reader?book="]').each(function (_, ele) {
            var _a, _b, _c;
            var node = loadedCheerio(ele);
            var href = node.attr('href') || '';
            var book = (_a = href.match(/book=([a-f0-9-]+)/i)) === null || _a === void 0 ? void 0 : _a[1];
            if (!book)
                return;
            var path = "/book/".concat(book);
            if (novels.some(function (n) { return n.path === path; }))
                return;
            var card = node.parent();
            var name = ((_b = node.attr('title')) === null || _b === void 0 ? void 0 : _b.trim()) ||
                ((_c = node.find('img').attr('alt')) === null || _c === void 0 ? void 0 : _c.trim()) ||
                '';
            if (!name || name === 'Đọc sách') {
                name =
                    card
                        .find('p.font-bold, p.line-clamp-2, h2, h3')
                        .first()
                        .text()
                        .trim() ||
                        card
                            .parent()
                            .find('p.font-bold, p.line-clamp-2')
                            .first()
                            .text()
                            .trim() ||
                        '';
            }
            if (!name || name === 'Đọc sách')
                name = book;
            var cover = _this.absCover(card.find('img').attr('src') ||
                card.parent().find('img').attr('src') ||
                node.find('img').attr('src'));
            novels.push({ name: name, path: path, cover: cover });
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
                        return [4 /*yield*/, fetchRetry(this.site + '/').then(function (r) { return r.text(); })];
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
    LightNovelVN.prototype.htmlFromZip = function (zip, filePath, budget) {
        return __awaiter(this, void 0, void 0, function () {
            var file, xml, $, nodes, _i, nodes_1, item, imgFile, buf, lower, mime, binary, chunk, i, slice, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = zipLookup(zip, filePath);
                        if (!file)
                            return [2 /*return*/, ''];
                        return [4 /*yield*/, file.async('string')];
                    case 1:
                        xml = _a.sent();
                        $ = (0, cheerio_1.load)(xml);
                        $('script, style').remove();
                        $('image').each(function (_, el) {
                            var node = $(el);
                            var src = node.attr('src') || node.attr('href') || node.attr('xlink:href') || '';
                            if (!src)
                                return;
                            node.replaceWith($('<img/>').attr('src', src).attr('alt', ''));
                        });
                        nodes = [];
                        $('img').each(function (_, el) {
                            var node = $(el);
                            var src = node.attr('src') || '';
                            if (src && !src.startsWith('data:') && !/^https?:\/\//i.test(src)) {
                                nodes.push({ node: node, zipPath: joinZipPath(filePath, src) });
                            }
                        });
                        _i = 0, nodes_1 = nodes;
                        _a.label = 2;
                    case 2:
                        if (!(_i < nodes_1.length)) return [3 /*break*/, 5];
                        item = nodes_1[_i];
                        imgFile = zipLookup(zip, item.zipPath);
                        if (!imgFile)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, imgFile.async('uint8array')];
                    case 3:
                        buf = _a.sent();
                        // Images are inlined as base64; cap the total so one chapter cannot
                        // hand the reader WebView tens of MB.
                        if (buf.byteLength > budget.bytes) {
                            item.node.replaceWith('<p><i>[Ảnh quá lớn, đã bỏ qua]</i></p>');
                            return [3 /*break*/, 4];
                        }
                        budget.bytes -= buf.byteLength;
                        lower = item.zipPath.toLowerCase();
                        mime = lower.endsWith('.png')
                            ? 'image/png'
                            : lower.endsWith('.webp')
                                ? 'image/webp'
                                : lower.endsWith('.gif')
                                    ? 'image/gif'
                                    : 'image/jpeg';
                        binary = '';
                        chunk = 256;
                        for (i = 0; i < buf.length; i += chunk) {
                            slice = buf.subarray(i, i + chunk);
                            binary += String.fromCharCode.apply(null, Array.from(slice));
                        }
                        item.node.attr('src', "data:".concat(mime, ";base64,").concat(btoa(binary)));
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
            var tokenRes, tokenJson, epubRes, encrypted, _a, key, iv, data, plain, zip, opfPath, opfFile, opf, title, author, opfFlat, manifestItems, itemRe, item, attrs, id, href, manifest, spineFiles, spineRe, spineMatch, href, filePath, _i, _b, name_1, fileLabel, titles, chapters, _c, spineFiles_1, filePath, title_1, current, book;
            var _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        if (((_d = this.cached) === null || _d === void 0 ? void 0 : _d.id) === bookId)
                            return [2 /*return*/, this.cached.book];
                        return [4 /*yield*/, fetchRetry("".concat(this.readerOrigin, "/api/reader/token?book=").concat(encodeURIComponent(bookId)), { headers: this.readerHeaders() })];
                    case 1:
                        tokenRes = _m.sent();
                        return [4 /*yield*/, tokenRes.json()];
                    case 2:
                        tokenJson = (_m.sent());
                        if (!tokenJson.token || !tokenJson.key) {
                            throw new Error(tokenJson.msg || 'Hub từ chối cấp token EPUB');
                        }
                        return [4 /*yield*/, fetchRetry("".concat(this.readerOrigin, "/uploads/ebooks/").concat(bookId, ".epub"), {
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
                        opfFile = zipLookup(zip, opfPath);
                        if (!opfFile)
                            throw new Error('EPUB không đọc được file OPF');
                        return [4 /*yield*/, opfFile.async('string')];
                    case 6:
                        opf = _m.sent();
                        title = ((_f = (_e = opf.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i)) === null || _e === void 0 ? void 0 : _e[1]) === null || _f === void 0 ? void 0 : _f.trim()) ||
                            'Light Novel Hub';
                        author = (_h = (_g = opf
                            .match(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/i)) === null || _g === void 0 ? void 0 : _g[1]) === null || _h === void 0 ? void 0 : _h.trim();
                        opfFlat = opf.replace(/\s+/g, ' ');
                        manifestItems = [];
                        itemRe = /<item\b([^>]+)>/gi;
                        while ((item = itemRe.exec(opfFlat))) {
                            attrs = item[1];
                            id = (_j = attrs.match(/\bid="([^"]+)"/i)) === null || _j === void 0 ? void 0 : _j[1];
                            href = (_k = attrs.match(/\bhref="([^"]+)"/i)) === null || _k === void 0 ? void 0 : _k[1];
                            if (id && href)
                                manifestItems.push({ id: id, href: href, attrs: attrs });
                        }
                        manifest = new Map(manifestItems.map(function (entry) { return [entry.id, entry.href]; }));
                        spineFiles = [];
                        spineRe = /<itemref\b[^>]*\bidref="([^"]+)"/gi;
                        while ((spineMatch = spineRe.exec(opfFlat))) {
                            href = manifest.get(spineMatch[1]);
                            if (!href || this.skipSpineId(spineMatch[1], href))
                                continue;
                            filePath = joinZipPath(opfPath, href);
                            if (zipLookup(zip, filePath))
                                spineFiles.push(filePath);
                        }
                        if (!spineFiles.length) {
                            for (_i = 0, _b = Object.keys(zip.files); _i < _b.length; _i++) {
                                name_1 = _b[_i];
                                if (!/\.x?html?$/i.test(name_1) || ((_l = zip.files[name_1]) === null || _l === void 0 ? void 0 : _l.dir))
                                    continue;
                                if (this.skipSpineId('', name_1))
                                    continue;
                                spineFiles.push(name_1);
                            }
                        }
                        fileLabel = function (filePath, index) {
                            return decodeZipSeg(filePath.split('/').pop() || '')
                                .replace(/\.[^.]+$/, '')
                                .replace(/[-_]+/g, ' ')
                                .trim() || "Ph\u1EA7n ".concat(index + 1);
                        };
                        return [4 /*yield*/, readTocTitles(zip, opfPath, opfFlat, manifestItems)];
                    case 7:
                        titles = _m.sent();
                        chapters = [];
                        for (_c = 0, spineFiles_1 = spineFiles; _c < spineFiles_1.length; _c++) {
                            filePath = spineFiles_1[_c];
                            title_1 = titles.get(filePath.toLowerCase());
                            current = chapters[chapters.length - 1];
                            if (title_1 || !current || !titles.size) {
                                chapters.push({
                                    name: title_1 ||
                                        (titles.size && !current
                                            ? 'Mở đầu'
                                            : fileLabel(filePath, chapters.length)),
                                    path: "/book/".concat(bookId, "/").concat(chapters.length),
                                    filePaths: [filePath],
                                });
                            }
                            else {
                                current.filePaths.push(filePath);
                            }
                        }
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
            var bookId, listing, card, book, err_2, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bookId = novelPath.replace(/^\/book\//, '').split('/')[0];
                        return [4 /*yield*/, this.popularNovels(1)];
                    case 1:
                        listing = _a.sent();
                        card = listing.find(function (n) { return n.path === "/book/".concat(bookId); });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.loadBook(bookId)];
                    case 3:
                        book = _a.sent();
                        return [2 /*return*/, {
                                path: "/book/".concat(bookId),
                                name: (card === null || card === void 0 ? void 0 : card.name) && card.name !== 'Đọc sách' ? card.name : book.title,
                                cover: card === null || card === void 0 ? void 0 : card.cover,
                                author: book.author,
                                chapters: book.chapters.map(function (ch, i) { return ({
                                    name: ch.name,
                                    path: ch.path,
                                    chapterNumber: i + 1,
                                }); }),
                                totalPages: 1,
                            }];
                    case 4:
                        err_2 = _a.sent();
                        msg = err_2 instanceof Error ? err_2.message : String(err_2);
                        return [2 /*return*/, {
                                path: "/book/".concat(bookId),
                                name: (card === null || card === void 0 ? void 0 : card.name) || 'Light Novel Hub',
                                cover: card === null || card === void 0 ? void 0 : card.cover,
                                summary: msg,
                                chapters: [
                                    {
                                        name: 'Không mở được EPUB — bấm để xem lỗi',
                                        path: "/book/".concat(bookId, "/err"),
                                        chapterNumber: 1,
                                    },
                                ],
                                totalPages: 1,
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LightNovelVN.prototype.parsePage = function (novelPath, _page) {
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
    LightNovelVN.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, bookId, indexToken, index, book, chapter, htmlParts, budget, _i, _a, filePath, _b, _c, html;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        parts = chapterPath.split('/').filter(Boolean);
                        bookId = parts[1];
                        indexToken = parts[2];
                        if (!bookId) {
                            throw new Error('Đường dẫn chương Hub không hợp lệ');
                        }
                        if (indexToken === 'err') {
                            return [2 /*return*/, ('<p>Không giải được EPUB trên máy (file lớn / mạng chậm).</p>' +
                                    '<p>Kéo trang truyện xuống làm mới, hoặc mở WebView trên nguồn Light Novel VN.</p>')];
                        }
                        index = Number(indexToken);
                        if (Number.isNaN(index)) {
                            throw new Error('Đường dẫn chương Hub không hợp lệ');
                        }
                        return [4 /*yield*/, this.loadBook(bookId)];
                    case 1:
                        book = _d.sent();
                        chapter = book.chapters[index];
                        if (!chapter) {
                            // The app keeps chapter rows from older plugin versions (one row per
                            // EPUB file) after a refresh; those indexes no longer exist.
                            return [2 /*return*/, ('<p>Chương này thuộc mục lục cũ của plugin, nội dung đã được gộp vào ' +
                                    'các chương phía trên.</p>' +
                                    '<p>Muốn mục lục gọn: xóa truyện khỏi thư viện rồi mở lại.</p>')];
                        }
                        htmlParts = [];
                        budget = { bytes: 12000000 };
                        _i = 0, _a = chapter.filePaths;
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        filePath = _a[_i];
                        _c = (_b = htmlParts).push;
                        return [4 /*yield*/, this.htmlFromZip(book.zip, filePath, budget)];
                    case 3:
                        _c.apply(_b, [_d.sent()]);
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        html = htmlParts.join('\n');
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
