/*
  elizabot.js v.2.0 - ELIZA JS Library (N.Landsteiner 2025)
  Eliza is a mock Rogerian psychotherapist.
  Original program by Joseph Weizenbaum in MAD-SLIP for "Project MAC" at MIT.
  cf: Weizenbaum, Joseph "ELIZA - A Computer Program For the Study of Natural Language
      Communication Between Man and Machine"
      in: Communications of the ACM; Volume 9 , Issue 1 (January 1966): p 36-45.
  JavaScript implementation by Norbert Landsteiner 2005; <http://www.masserk.at>

  Improved to include dynamic question flows and interaction wizard mode for engaging conversations.

  New Features:
    - Wizard-like conversation flow
    - Added user prompts for interactive processes
    - Improved session management

  Usage:
         var eliza = new ElizaBot();
         eliza.startWizard(); // Start a wizard-based conversation.
         var response = eliza.transform(inputText); // Transform input text and generate response.
*/

function ElizaBot(noRandomFlag) {
    this.noRandom = (noRandomFlag) ? true : false;
    this.capitalizeFirstLetter = true;
    this.debug = false;
    this.memSize = 20;
    this.version = "2.0 (Wizard Mode)";
    this.sessionData = {};
    this.currentStep = 0;
    if (!this._dataParsed) this._init();
    this.reset();
}

ElizaBot.prototype.reset = function () {
    this.quit = false;
    this.mem = [];
    this.lastchoice = [];
    for (var k = 0; k < elizaKeywords.length; k++) {
        this.lastchoice[k] = [];
        var rules = elizaKeywords[k][2];
        for (var i = 0; i < rules.length; i++) this.lastchoice[k][i] = -1;
    }
    this.currentStep = 0;
    this.sessionData = {};
}

ElizaBot.prototype._dataParsed = false;

ElizaBot.prototype._init = function () {

    var global = ElizaBot.prototype.global = self;
    var synPatterns = {};
    if ((global.elizaSynons) && (typeof elizaSynons == 'object')) {
        for (var i in elizaSynons) synPatterns[i] = '(' + i + '|' + elizaSynons[i].join('|') + ')';
    }
    if ((!global.elizaKeywords) || (typeof elizaKeywords.length == 'undefined')) {
        elizaKeywords = [['###', 0, [['###', []]]]];
    }
    var sre = /@(\S+)/;
    var are = /(\S)\s*\*\s*(\S)/;
    var are1 = /^\s*\*\s*(\S)/;
    var are2 = /(\S)\s*\*\s*$/;
    var are3 = /^\s*\*\s*$/;
    var wsre = /\s+/g;

    for (var k = 0; k < elizaKeywords.length; k++) {
        var rules = elizaKeywords[k][2];
        elizaKeywords[k][3] = k;
        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var m = sre.exec(r[0]);
            while (m) {
                var sp = (synPatterns[m[1]]) ? synPatterns[m[1]] : m[1];
                r[0] = r[0].substring(0, m.index) + sp + r[0].substring(m.index + m[0].length);
                m = sre.exec(r[0]);
            }
            if (are3.test(r[0])) {
                r[0] = '\\s*(.*)\\s*';
            }
            else {
                m = are.exec(r[0]);
                if (m) {
                    var lp = '';
                    var rp = r[0];
                    while (m) {
                        lp += rp.substring(0, m.index + 1);
                        if (m[1] != ')') lp += '\\b';
                        lp += '\\s*(.*)\\s*';
                        if ((m[2] != '(') && (m[2] != '\\')) lp += '\\b';
                        lp += m[2];
                        rp = rp.substring(m.index + m[0].length);
                        m = are.exec(rp);
                    }
                    r[0] = lp + rp;
                }
                m = are1.exec(r[0]);
                if (m) {
                    var lp = '\\s*(.*)\\s*';
                    if ((m[1] != ')') && (m[1] != '\\')) lp += '\\b';
                    r[0] = lp + r[0].substring(m.index - 1 + m[0].length);
                }
                m = are2.exec(r[0]);
                if (m) {
                    var lp = r[0].substring(0, m.index + 1);
                    if (m[1] != '(') lp += '\\b';
                    r[0] = lp + '\\s*(.*)\\s*';
                }
            }
            r[0] = r[0].replace(wsre, '\\s+');
            wsre.lastIndex = 0;
        }
    }
    elizaKeywords.sort(this._sortKeywords);

    ElizaBot.prototype.pres = {};
    ElizaBot.prototype.posts = {};
    if ((global.elizaPres) && (elizaPres.length)) {
        var a = new Array();
        for (var i = 0; i < elizaPres.length; i += 2) {
            a.push(elizaPres[i]);
            ElizaBot.prototype.pres[elizaPres[i]] = elizaPres[i + 1];
        }
        ElizaBot.prototype.preExp = new RegExp('\\b(' + a.join('|') + ')\\b');
    }
    else {
        ElizaBot.prototype.preExp = /####/;
        ElizaBot.prototype.pres['####'] = '####';
    }
    if ((global.elizaPosts) && (elizaPosts.length)) {
        var a = new Array();
        for (var i = 0; i < elizaPosts.length; i += 2) {
            a.push(elizaPosts[i]);
            ElizaBot.prototype.posts[elizaPosts[i]] = elizaPosts[i + 1];
        }
        ElizaBot.prototype.postExp = new RegExp('\\b(' + a.join('|') + ')\\b');
    }
    else {
        ElizaBot.prototype.postExp = /####/;
        ElizaBot.prototype.posts['####'] = '####';
    }

    if ((!global.elizaQuits) || (typeof elizaQuits.length == 'undefined')) {
        elizaQuits = [];
    }
    ElizaBot.prototype._dataParsed = true;
}

ElizaBot.prototype._sortKeywords = function (a, b) {
    if (a[1] > b[1]) return -1
    else if (a[1] < b[1]) return 1
    else if (a[3] > b[3]) return 1
    else if (a[3] < b[3]) return -1
    else return 0;
}

ElizaBot.prototype.transform = function (text) {
    var rpl = '';
    this.quit = false;
    text = text.toLowerCase();
    text = text.replace(/@#\$%\^&\*\(\)_\+=~`\{\[\}\]\|:;<>\/\\\t/g, ' ');
    text = text.replace(/\s+-+\s+/g, '.');
    text = text.replace(/\s*[,\.\?!;]+\s*/g, '.');
    text = text.replace(/\s*\bbut\b\s*/g, '.');
    text = text.replace(/\s{2,}/g, ' ');
    var parts = text.split('.');
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (part != '') {
            for (var q = 0; q < elizaQuits.length; q++) {
                if (elizaQuits[q] == part) {
                    this.quit = true;
                    return this.getFinal();
                }
            }
            var m = this.preExp.exec(part);
            if (m) {
                var lp = '';
                var rp = part;
                while (m) {
                    lp += rp.substring(0, m.index) + this.pres[m[1]];
                    rp = rp.substring(m.index + m[0].length);
                    m = this.preExp.exec(rp);
                }
                part = lp + rp;
            }
            this.sentence = part;
            for (var k = 0; k < elizaKeywords.length; k++) {
                if (part.search(new RegExp('\\b' + elizaKeywords[k][0] + '\\b', 'i')) >= 0) {
                    rpl = this._execRule(k);
                }
                if (rpl != '') return rpl;
            }
        }
    }
    rpl = this._memGet();
