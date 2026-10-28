#!/usr/bin/env python3
"""Builds ONE self-contained file, dist/Παιχνίδια.html: the home page with every game
(and its scripts, question bank, pictures, sounds) and the technology stories inside it.
Android opens files as content://, which cannot follow links to neighbouring files,
so nothing may live outside the one file.

    python3 build-offline.py [stories folder]   (default ../stories/out/Ιστορίες)
"""
import base64, html, json, mimetypes, re, sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
STORIES = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / 'stories' / 'out' / 'Ιστορίες'
OUT = ROOT / 'dist' / 'Παιχνίδια.html'
HOME = {'index.html', 'Διαδραστικά.html'}  # links to these go back to the menu
LOCAL = re.compile(r'href="([^"#:]+\.html?)(?:#[^"]*)?"')
ESC = ''  # stands in for '<' where it would end the <script type="text/plain"> holding a page


def data_uri(p):
    mime = mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    if p.suffix == '.js':
        mime = 'text/javascript'
    return f'data:{mime};base64,' + base64.b64encode(p.read_bytes()).decode()


def assets(text):
    """Files a game loads at runtime by path (bank/x.js, presets/x.png, Sounds/x.mp3)."""
    files = {}
    for folder in ('bank', 'presets', 'Sounds'):
        if folder + '/' in text:
            for p in sorted((ROOT / folder).iterdir()):
                if p.is_file() and p.name != 'manifest.js':
                    files[f'{folder}/{p.name}'] = files[f'{folder}/{quote(p.name, safe="")}'] = data_uri(p)
    return files


# Runs first in every game: serves those paths from the map, sends local links to the menu.
SHIM = '''<script>(function(){
var F=$F;
function hook(proto,prop){var d=Object.getOwnPropertyDescriptor(proto,prop);
 Object.defineProperty(proto,prop,{configurable:true,get:function(){return d.get.call(this)},set:function(v){d.set.call(this,F[v]||v)}});}
hook(HTMLScriptElement.prototype,'src');hook(HTMLImageElement.prototype,'src');hook(HTMLMediaElement.prototype,'src');
var A=window.Audio;window.Audio=function(u){return u===undefined?new A():new A(F[u]||u)};window.Audio.prototype=A.prototype;
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
 var h=a.getAttribute('href');if(/^[^#:]+\\.html?(#|$)/.test(h)){e.preventDefault();parent.postMessage({open:h.split('#')[0]},'*');}},true);
})();</script>'''


def inline_scripts(text):
    def sub(m):
        js = (ROOT / m.group(1)).read_text(encoding='utf-8')
        return '<script>\n' + re.sub(r'</(?=script)', r'<\\/', js, flags=re.I) + '\n</script>'  # a '</script' in a comment would end the tag
    return re.sub(r'<script src="([^":]+\.js)"></script>', sub, text)


def pack(text):
    assert ESC not in text
    return re.sub(r'<(?=!--|/?script)', ESC, text, flags=re.I)


def build_game(name):
    text = (ROOT / name).read_text(encoding='utf-8')
    shim = SHIM.replace('$F', json.dumps(assets(text)))
    text = inline_scripts(text)
    text = re.sub(r'<head>', lambda m: '<head>' + shim, text, count=1, flags=re.I)
    return text


def story_cards(stories):
    cards = []
    for i, p in enumerate(stories):
        m = re.match(r'\d+\s+(.*?)(?:\s+—\s+(.*))?$', p.stem)
        el, en = (m.group(1), m.group(2) or '') if m else (p.stem, '')
        cards.append(f'''  <a class="card" href="story-{i}.html">
    <div class="header">
      <div class="emoji">📖</div>
      <div>
        <div class="name">{html.escape(el)}</div>
        <div class="year">{html.escape(en)}</div>
      </div>
    </div>
  </a>''')
    return '<h2 class="category">📖 Ιστορίες</h2>\n<div class="grid">\n' + '\n'.join(cards) + '\n</div>\n'


PLAYER = '''<div id="player" hidden><button id="homeBtn" title="Αρχική">🏠</button></div>
<style>
#player{position:fixed;inset:0;z-index:100;background:#000}
#player[hidden]{display:none}
#player iframe{width:100%;height:100%;border:0;display:block;background:#fff}
#homeBtn{position:fixed;left:8px;top:8px;z-index:101;font-size:28px;width:56px;height:56px;border-radius:50%;
 border:2px solid #ffb347;background:rgba(30,60,114,.75);color:#fff;cursor:pointer}
</style>
<script>
(function(){
// a new iframe per page: reusing one would add every page to the back history
var player=document.getElementById('player'),frame=null;
function close(){if(frame)frame.remove();frame=null;player.hidden=true;document.body.style.overflow='';}
function open(name){
  // not history.back(): a game's own #hash steps sit in the history too
  if(name in HOME){close();history.replaceState(null,'');return;}
  var el=document.getElementById('page:'+name);
  if(!el){alert('Περίμενε λίγο να φορτώσει η σελίδα και ξαναπάτα.');return;}
  if(frame)frame.remove();
  frame=document.createElement('iframe');frame.allow='autoplay; fullscreen';frame.allowFullscreen=true;
  frame.srcdoc=el.textContent.replace(/\\ue000/g,'<');
  frame.onload=function(){this.focus();};
  player.prepend(frame);player.hidden=false;document.body.style.overflow='hidden';
  if(history.state&&history.state.game)history.replaceState({game:name},'');else history.pushState({game:name},'');
}
var HOME=$HOME;
document.getElementById('homeBtn').onclick=function(){open('index.html');};
window.addEventListener('popstate',function(){if(!(history.state&&history.state.game))close();});
window.addEventListener('message',function(e){if(frame&&e.source===frame.contentWindow&&e.data&&e.data.open)open(e.data.open);});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
  var h=a.getAttribute('href');if(/^[^#:]+\\.html?(#|$)/.test(h)){e.preventDefault();open(h.split('#')[0]);}});
})();
</script>
'''


def main():
    home = (ROOT / 'index.html').read_text(encoding='utf-8')
    home = home.replace('href="favicon.svg"', f'href="{data_uri(ROOT / "favicon.svg")}"')
    pages = {}
    todo = [h for h in LOCAL.findall(home) if h not in HOME]
    while todo:  # every game the menu links to, and every game those link to
        name = todo.pop()
        if name in pages or name in HOME:
            continue
        pages[name] = build_game(name)
        todo += LOCAL.findall((ROOT / name).read_text(encoding='utf-8'))

    stories = sorted(STORIES.glob('*.html')) if STORIES.is_dir() else []
    if not stories:
        print(f'! no stories found in {STORIES}', file=sys.stderr)
    for i, p in enumerate(stories):
        pages[f'story-{i}.html'] = p.read_text(encoding='utf-8')

    blocks = ''.join(f'<script type="text/plain" id="page:{n}">{pack(t)}</script>\n' for n, t in pages.items())
    tail = (story_cards(stories) if stories else '') + PLAYER.replace('$HOME', json.dumps(dict.fromkeys(HOME, 1))) + blocks
    home = home.replace('</body>', tail + '</body>', 1)
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(home, encoding='utf-8')
    print(f'{OUT}  {OUT.stat().st_size / 1e6:.1f} MB  ({len(pages) - len(stories)} games, {len(stories)} stories)')


if __name__ == '__main__':
    main()
