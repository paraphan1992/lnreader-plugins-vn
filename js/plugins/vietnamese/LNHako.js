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
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var novelStatus_1 = require("@libs/novelStatus");
var filterInputs_1 = require("@libs/filterInputs");
var storage_1 = require("@libs/storage");
// ln.hako.vn is blocked by several Vietnamese ISPs (connection reset), so the
// plugin falls back to the official mirrors and remembers the one that works.
var MIRRORS = [
    'https://ln.hako.vn',
    'https://docln.sbs',
    'https://docln.net',
];
var ACTIVE_KEY = 'activeSite';
var wait = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var trimSite = function (value) { return (value || '').trim().replace(/\/+$/, ''); };
var HakoPlugin = /** @class */ (function () {
    function HakoPlugin() {
        this.id = 'ln.hako';
        this.name = 'Hako';
        this.icon = 'src/vi/hakolightnovel/icon.png';
        this.version = '1.2.0';
        this.pluginSettings = {
            site: {
                value: 'https://ln.hako.vn',
                label: 'Site URL',
            },
        };
        this.imageRequestInit = {
            headers: { Referer: 'https://ln.hako.vn/' },
        };
        this.filters = {
            alphabet: {
                type: filterInputs_1.FilterTypes.Picker,
                value: '',
                label: 'Chữ cái',
                options: [
                    { label: 'Tất cả', value: '' },
                    { label: 'Khác', value: 'khac' },
                    { label: 'A', value: 'a' },
                    { label: 'B', value: 'b' },
                    { label: 'C', value: 'c' },
                    { label: 'D', value: 'd' },
                    { label: 'E', value: 'e' },
                    { label: 'F', value: 'f' },
                    { label: 'G', value: 'g' },
                    { label: 'H', value: 'h' },
                    { label: 'I', value: 'i' },
                    { label: 'J', value: 'j' },
                    { label: 'K', value: 'k' },
                    { label: 'L', value: 'l' },
                    { label: 'M', value: 'm' },
                    { label: 'N', value: 'n' },
                    { label: 'O', value: 'o' },
                    { label: 'P', value: 'p' },
                    { label: 'Q', value: 'q' },
                    { label: 'R', value: 'r' },
                    { label: 'S', value: 's' },
                    { label: 'T', value: 't' },
                    { label: 'U', value: 'u' },
                    { label: 'V', value: 'v' },
                    { label: 'W', value: 'w' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'Z', value: 'z' },
                ],
            },
            type: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Phân loại',
                value: [],
                options: [
                    { label: 'Truyện dịch', value: 'truyendich' },
                    { label: 'Truyện sáng tác', value: 'sangtac' },
                    { label: 'Convert', value: 'convert' },
                ],
            },
            status: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Tình trạng',
                value: [],
                options: [
                    { label: 'Đang tiến hành', value: 'dangtienhanh' },
                    { label: 'Tạm ngưng', value: 'tamngung' },
                    { label: 'Đã hoàn thành', value: 'hoanthanh' },
                ],
            },
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sắp xếp',
                value: 'top',
                options: [
                    { label: 'A-Z', value: 'tentruyen' },
                    { label: 'Z-A', value: 'tentruyenza' },
                    { label: 'Mới cập nhật', value: 'capnhat' },
                    { label: 'Truyện mới', value: 'truyenmoi' },
                    { label: 'Theo dõi', value: 'theodoi' },
                    { label: 'Top toàn thời gian', value: 'top' },
                    { label: 'Top tháng', value: 'topthang' },
                    { label: 'Số từ', value: 'sotu' },
                ],
            },
        };
    }
    Object.defineProperty(HakoPlugin.prototype, "preferredSite", {
        get: function () {
            return trimSite(storage_1.storage.get('site')) || MIRRORS[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HakoPlugin.prototype, "site", {
        get: function () {
            var active = trimSite(storage_1.storage.get(ACTIVE_KEY));
            var site = active || this.preferredSite;
            if (this.imageRequestInit.headers) {
                this.imageRequestInit.headers.Referer = "".concat(site, "/");
            }
            return site;
        },
        enumerable: false,
        configurable: true
    });
    HakoPlugin.prototype.candidates = function () {
        var active = trimSite(storage_1.storage.get(ACTIVE_KEY));
        var custom = this.preferredSite !== MIRRORS[0];
        var list = (custom ? __spreadArray([this.preferredSite, active], MIRRORS, true) : __spreadArray([active], MIRRORS, true)).filter(Boolean);
        return list.filter(function (host, index) { return list.indexOf(host) === index; });
    };
    HakoPlugin.prototype.fetchHtml = function (pathAndQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var lastError, _i, _a, host, attempt, res, html, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.candidates();
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
                                headers: { Referer: "".concat(host, "/") },
                            })];
                    case 4:
                        res = _b.sent();
                        return [4 /*yield*/, res.text()];
                    case 5:
                        html = _b.sent();
                        // A blocked host can also answer with an ISP warning page.
                        if (res.status >= 500 ||
                            res.status === 403 ||
                            !/hako|docln/i.test(html)) {
                            lastError = new Error("Hako ".concat(host, " tr\u1EA3 v\u1EC1 HTTP ").concat(res.status));
                            return [3 /*break*/, 9];
                        }
                        if (host !== trimSite(storage_1.storage.get(ACTIVE_KEY))) {
                            storage_1.storage.set(ACTIVE_KEY, host, Date.now() + 12 * 60 * 60 * 1000);
                        }
                        if (this.imageRequestInit.headers) {
                            this.imageRequestInit.headers.Referer = "".concat(host, "/");
                        }
                        return [2 /*return*/, html];
                    case 6:
                        err_1 = _b.sent();
                        lastError = err_1;
                        return [4 /*yield*/, wait(300)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        attempt++;
                        return [3 /*break*/, 2];
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: throw lastError instanceof Error
                        ? lastError
                        : new Error('Không kết nối được Hako. Thử đổi mạng hoặc Site URL.');
                }
            });
        });
    };
    HakoPlugin.prototype.parseNovels = function ($) {
        var novels = [];
        $('.thumb-item-flow').each(function (_, el) {
            var _a, _b;
            var item = $(el);
            var a = item.find('.series-title a').first();
            var href = a.attr('href');
            var name = (a.attr('title') || a.text()).trim();
            if (!href || !name)
                return;
            var path = href.replace(/^(https?:\/\/[^/]+)/, '');
            if (novels.some(function (novel) { return novel.path === path; }))
                return;
            var img = item.find('.img-in-ratio').first();
            var cover = img.attr('data-bg') ||
                ((_b = (_a = img.attr('style')) === null || _a === void 0 ? void 0 : _a.match(/url\((['"]?)(https?:[^'")]+)\1\)/)) === null || _b === void 0 ? void 0 : _b[2]);
            novels.push({ name: name, path: path, cover: cover });
        });
        return novels;
    };
    HakoPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var link, params, _i, _c, novelType, _d, _e, status_1, html;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        link = '/danh-sach';
                        params = new URLSearchParams();
                        if (filters) {
                            if (filters.alphabet.value) {
                                link += '/' + filters.alphabet.value;
                            }
                            for (_i = 0, _c = filters.type.value; _i < _c.length; _i++) {
                                novelType = _c[_i];
                                params.append(novelType, '1');
                            }
                            for (_d = 0, _e = filters.status.value; _d < _e.length; _d++) {
                                status_1 = _e[_d];
                                params.append(status_1, '1');
                            }
                        }
                        params.append('sapxep', showLatestNovels ? 'capnhat' : (filters === null || filters === void 0 ? void 0 : filters.sort.value) || 'top');
                        params.append('page', String(pageNo));
                        return [4 /*yield*/, this.fetchHtml("".concat(link, "?").concat(params.toString()))];
                    case 1:
                        html = _f.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(html))];
                }
            });
        });
    };
    HakoPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $, novel, cover, summary, chapters;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml(novelPath)];
                    case 1:
                        html = _c.sent();
                        $ = (0, cheerio_1.load)(html);
                        novel = {
                            path: novelPath,
                            name: $('.series-name a').first().text().trim() ||
                                $('.series-name').first().text().trim() ||
                                $('title').text().split('-')[0].trim(),
                            chapters: [],
                        };
                        cover = $('.series-cover .img-in-ratio, .img-in-ratio').first();
                        novel.cover =
                            cover.attr('data-bg') ||
                                ((_b = (_a = cover.attr('style')) === null || _a === void 0 ? void 0 : _a.match(/url\((['"]?)(https?:[^'")]+)\1\)/)) === null || _b === void 0 ? void 0 : _b[2]);
                        summary = $('.summary-content').first().clone();
                        summary.find('br').replaceWith('\n');
                        summary.find('p').after('\n');
                        novel.summary = summary
                            .text()
                            .split('\n')
                            .map(function (line) { return line.trim(); })
                            .filter(Boolean)
                            .join('\n');
                        novel.genres = $('.series-gerne-item')
                            .map(function (_, el) { return $(el).text().trim(); })
                            .get()
                            .filter(Boolean)
                            .join(',');
                        $('.info-item').each(function (_, el) {
                            var label = $(el).find('.info-name').text().trim().toLowerCase();
                            var value = $(el)
                                .find('.info-value')
                                .text()
                                .replace(/\s+/g, ' ')
                                .trim();
                            if (!value)
                                return;
                            if (label.startsWith('tác giả'))
                                novel.author = value;
                            else if (label.startsWith('họa sĩ'))
                                novel.artist = value;
                            else if (label.startsWith('tình trạng'))
                                novel.status = hakoStatus(value);
                        });
                        if (!novel.status)
                            novel.status = novelStatus_1.NovelStatus.Unknown;
                        chapters = [];
                        $('.volume-list').each(function (_, volumeEl) {
                            var volume = $(volumeEl);
                            var volumeName = volume
                                .find('.sect-title')
                                .first()
                                .text()
                                .replace(/\s+/g, ' ')
                                .trim();
                            var lastNum = 0;
                            var part = 1;
                            volume.find('ul.list-chapters > li').each(function (__, li) {
                                var _a;
                                var a = $(li).find('.chapter-name a').first();
                                var href = a.attr('href');
                                if (!href)
                                    return;
                                var name = (a.attr('title') || a.text()).replace(/\s+/g, ' ').trim();
                                var chapterNumber = Number((_a = name.match(/Chương\s*(\d+)/i)) === null || _a === void 0 ? void 0 : _a[1]);
                                if (chapterNumber && chapterNumber !== lastNum) {
                                    lastNum = chapterNumber;
                                    part = 1;
                                }
                                else {
                                    chapterNumber = lastNum + part / 10;
                                    part += 1;
                                }
                                var time = $(li)
                                    .find('.chapter-time')
                                    .text()
                                    .trim()
                                    .split('/')
                                    .map(Number);
                                var releaseTime = time.length === 3 && time.every(function (n) { return Number.isFinite(n) && n > 0; })
                                    ? new Date(time[2], time[1] - 1, time[0]).toISOString()
                                    : undefined;
                                chapters.push({
                                    name: name,
                                    path: href.replace(/^(https?:\/\/[^/]+)/, ''),
                                    page: volumeName,
                                    chapterNumber: chapterNumber,
                                    releaseTime: releaseTime,
                                });
                            });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    HakoPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $, protectedEl, s_1, k_1, c, decryptedHtml, content, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml(chapterPath)];
                    case 1:
                        html = _a.sent();
                        $ = (0, cheerio_1.load)(html);
                        protectedEl = $('#chapter-c-protected');
                        if (protectedEl.length) {
                            s_1 = protectedEl.attr('data-s') || 'none';
                            k_1 = protectedEl.attr('data-k') || '';
                            c = [];
                            try {
                                c = JSON.parse(protectedEl.attr('data-c') || '[]');
                            }
                            catch (_b) {
                                // malformed payload: fall through to whatever plain content exists
                            }
                            if (Array.isArray(c) && c.length > 0) {
                                c.sort(function (a, b) { return +a.substring(0, 4) - +b.substring(0, 4); });
                                decryptedHtml = c
                                    .map(function (chunk) {
                                    var ciphertext = chunk.substring(4);
                                    if (s_1 === 'xor_shuffle')
                                        return decryptXor(ciphertext, k_1);
                                    if (s_1 === 'base64_reverse')
                                        return decryptBase64Reverse(ciphertext);
                                    return decryptNone(ciphertext);
                                })
                                    .join('')
                                    .replace(/\[note(\d+)\]/gi, '<sup><a href="#note$1">[$1]</a></sup>');
                                protectedEl.replaceWith(decryptedHtml);
                            }
                        }
                        content = $('#chapter-content');
                        content.find('[style*="display: none"], [style*="display:none"]').remove();
                        content.find('script, style, iframe').remove();
                        content
                            .find('a[href^="/truyen/"]')
                            .has('img[src*="chapter-banners"]')
                            .remove();
                        content.find('img').each(function (_, el) {
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
                        body = content.html() || '';
                        return [2 /*return*/, body.trim() ? body : 'Không tìm thấy nội dung chương.'];
                }
            });
        });
    };
    HakoPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml('/tim-kiem?keywords=' +
                            encodeURIComponent(searchTerm) +
                            '&page=' +
                            pageNo)];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, this.parseNovels((0, cheerio_1.load)(html))];
                }
            });
        });
    };
    return HakoPlugin;
}());
function hakoStatus(value) {
    var text = value.toLowerCase();
    if (text.includes('hoàn thành') || text.includes('completed')) {
        return novelStatus_1.NovelStatus.Completed;
    }
    if (text.includes('tạm ngưng'))
        return novelStatus_1.NovelStatus.OnHiatus;
    if (text.includes('đang tiến hành'))
        return novelStatus_1.NovelStatus.Ongoing;
    return novelStatus_1.NovelStatus.Unknown;
}
function decodeBase64(str) {
    return Uint8Array.from(atob(str), function (c) { return c.charCodeAt(0); });
}
// Hermes only gained TextDecoder recently; decode UTF-8 by hand as a fallback.
function utf8Decode(bytes) {
    if (typeof TextDecoder !== 'undefined') {
        return new TextDecoder('utf-8').decode(bytes);
    }
    var out = '';
    for (var i = 0; i < bytes.length;) {
        var b0 = bytes[i++];
        var code = b0;
        if (b0 >= 0xf0) {
            code =
                ((b0 & 0x07) << 18) |
                    ((bytes[i++] & 0x3f) << 12) |
                    ((bytes[i++] & 0x3f) << 6) |
                    (bytes[i++] & 0x3f);
        }
        else if (b0 >= 0xe0) {
            code =
                ((b0 & 0x0f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
        }
        else if (b0 >= 0xc0) {
            code = ((b0 & 0x1f) << 6) | (bytes[i++] & 0x3f);
        }
        if (code > 0xffff) {
            code -= 0x10000;
            out += String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff));
        }
        else {
            out += String.fromCharCode(code);
        }
    }
    return out;
}
function decryptXor(ciphertext, key) {
    var data = decodeBase64(ciphertext);
    var keyLen = key.length;
    return utf8Decode(data.map(function (byte, i) { return byte ^ key.charCodeAt(i % keyLen); }));
}
function decryptBase64Reverse(ciphertext) {
    var reversed = ciphertext.split('').reverse().join('');
    return utf8Decode(decodeBase64(reversed));
}
function decryptNone(ciphertext) {
    return utf8Decode(decodeBase64(ciphertext));
}
exports.default = new HakoPlugin();
