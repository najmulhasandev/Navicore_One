#!/usr/bin/env python3
"""Audit the built HTML in .next/server/app: titles, descriptions, H1 count, canonical, robots, JSON-LD, TODO leaks.
Run after `next build`:  python3 scripts/audit-build.py"""
import glob, json, re, sys, html, os

root = ".next/server/app"
pages = [p for p in glob.glob(f"{root}/**/*.html", recursive=True) if "_global-error" not in p and "_not-found" not in p]
errs, notes = [], []
titles, descs = {}, {}
n_noindex = 0
for p in sorted(pages):
    h = open(p, encoding="utf8").read()
    rel = p[len(root):-5] or "/"
    t = re.search(r"<title>(.*?)</title>", h, re.S)
    t = html.unescape(t.group(1)) if t else ""
    d = re.search(r'<meta name="description" content="(.*?)"', h)
    d = html.unescape(d.group(1)) if d else ""
    canon = re.search(r'<link rel="canonical" href="(.*?)"', h)
    robots = re.search(r'<meta name="robots" content="(.*?)"', h)
    h1 = len(re.findall(r"<h1[\s>]", h))
    ld = re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)
    ldtypes = []
    for j in ld:
        v = json.loads(j)
        for x in (v if isinstance(v, list) else [v]):
            ldtypes.append(x.get("@type"))
    if len(t) >= 60: errs.append(f"{rel}: title {len(t)} chars")
    if not (50 <= len(d) < 155): errs.append(f"{rel}: description {len(d)} chars")
    if h1 != 1: errs.append(f"{rel}: {h1} h1 elements")
    if not canon: errs.append(f"{rel}: no canonical")
    if t in titles: errs.append(f"{rel}: duplicate title with {titles[t]}")
    if d in descs: errs.append(f"{rel}: duplicate description with {descs[d]}")
    titles[t] = rel; descs[d] = rel
    if "[TODO" in h or "TODO: confirm" in h: errs.append(f"{rel}: TODO text leaked into HTML")
    if "og:image" not in h: errs.append(f"{rel}: no og:image")
    noindex = bool(robots and "noindex" in robots.group(1))
    n_noindex += noindex
    if rel.startswith("/os/") and "BreadcrumbList" not in ldtypes: errs.append(f"{rel}: no BreadcrumbList")
    if rel == "/index" or rel == "/":
        for need in ("Organization", "SoftwareApplication"):
            if need not in ldtypes: errs.append(f"home: missing {need} JSON-LD")
    if re.search(r"navicore os\b", h) and False: pass
    notes.append((rel, len(t), len(d), h1, "noindex" if noindex else "index", ",".join(ldtypes)))

print(f"pages audited: {len(pages)}   part pages: {sum(1 for n in notes if n[0].startswith('/os/'))}   noindex: {n_noindex}")
for n in notes[:0]: print(n)
for rel in ("/index", "/os", "/contact", "/partners", "/privacy"):
    for n in notes:
        if n[0] == rel: print("  ", n)
sm = open(".next/server/app/sitemap.xml.body", encoding="utf8").read() if os.path.exists(".next/server/app/sitemap.xml.body") else ""
urls = re.findall(r"<loc>(.*?)</loc>", sm)
print(f"sitemap urls: {len(urls)}")
noindex_paths = [n[0] for n in notes if n[4] == "noindex"]
for u in urls:
    path = re.sub(r"^https?://[^/]+", "", u) or "/"
    if path in noindex_paths: errs.append(f"sitemap lists noindex page {path}")
if errs:
    print("\nERRORS"); print("\n".join(" - " + e for e in errs)); sys.exit(1)
print("Build audit passed.")
