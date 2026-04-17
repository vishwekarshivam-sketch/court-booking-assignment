"""
IITB Sports Font Family Builder — Fixed for available system fonts
5 custom branded typefaces for IIT Bombay Sports
Palette: #C4622D (copper orange), warm charcoal, black
Feel: Heritage & prestigious, bold, premium, condensed gothic for display
"""

import os
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._n_a_m_e import NameRecord

OUTPUT_DIR = "/home/claude/iitb-sports-fonts/output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def set_name(font, name_id, string, platform_id=3, encoding_id=1, language_id=0x0409):
    name_table = font["name"]
    record = NameRecord()
    record.nameID = name_id
    record.platformID = platform_id
    record.platEncID = encoding_id
    record.langID = language_id
    record.string = string.encode("utf-16-be")
    name_table.names = [n for n in name_table.names
                        if not (n.nameID == name_id and n.platformID == platform_id
                                and n.platEncID == encoding_id and n.langID == language_id)]
    name_table.names.append(record)

def update_all_names(font, family, style, full_name, postscript):
    set_name(font, 1, family)
    set_name(font, 2, style)
    set_name(font, 4, full_name)
    set_name(font, 6, postscript)
    set_name(font, 16, family)
    set_name(font, 17, style)

def scale_glyphs_horizontal(font, scale_x):
    if "glyf" not in font:
        return
    glyf = font["glyf"]
    hmtx = font["hmtx"]
    for name in font.getGlyphOrder():
        glyph = glyf[name]
        if glyph.isComposite():
            continue
        if not hasattr(glyph, "coordinates") or glyph.coordinates is None:
            continue
        coords = list(glyph.coordinates)
        new_coords = [(int(x * scale_x), y) for x, y in coords]
        glyph.coordinates = type(glyph.coordinates)(new_coords)
        if name in hmtx.metrics:
            aw, lsb = hmtx.metrics[name]
            hmtx.metrics[name] = (int(aw * scale_x), int(lsb * scale_x))
    head = font["head"]
    head.xMin = int(head.xMin * scale_x)
    head.xMax = int(head.xMax * scale_x)

def adjust_tracking(font, extra_spacing):
    hmtx = font["hmtx"]
    for name in hmtx.metrics:
        aw, lsb = hmtx.metrics[name]
        hmtx.metrics[name] = (max(0, aw + extra_spacing), lsb)

def set_weight_class(font, weight):
    font["OS/2"].usWeightClass = weight

def set_width_class(font, width):
    font["OS/2"].usWidthClass = width

def adjust_line_height(font, multiplier):
    os2 = font["OS/2"]
    hhea = font["hhea"]
    os2.sTypoLineGap = int(os2.sTypoLineGap * multiplier)
    hhea.lineGap = int(hhea.lineGap * multiplier)

def save_font(font, name_stem):
    ttf_path = os.path.join(OUTPUT_DIR, f"{name_stem}.ttf")
    woff2_path = os.path.join(OUTPUT_DIR, f"{name_stem}.woff2")
    font.save(ttf_path)
    font2 = TTFont(ttf_path)
    font2.flavor = "woff2"
    font2.save(woff2_path)
    ttf_size = os.path.getsize(ttf_path) // 1024
    woff2_size = os.path.getsize(woff2_path) // 1024
    print(f"  ✓ {name_stem}.ttf  ({ttf_size} KB)")
    print(f"  ✓ {name_stem}.woff2  ({woff2_size} KB)")

# ─────────────────────────────────────────────
# FONT 1: IITB Sport Display
# Base: DejaVuSansCondensed-Bold
# Role: Hero headlines, team names, event titles
# Feel: Condensed gothic — tall, tight, powerful, athletic
# ─────────────────────────────────────────────
print("\n[1/5] Building IITBSport-Display...")
font = TTFont("/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf")

scale_glyphs_horizontal(font, 0.84)  # Strong condense for tall-tight silhouette
adjust_tracking(font, -22)           # Very tight tracking — athletic, no breath between letters
adjust_line_height(font, 0.80)       # Tight stacking for multi-line hero lockups

set_weight_class(font, 800)
set_width_class(font, 3)  # Condensed

update_all_names(font,
    family="IITB Sport Display",
    style="Bold",
    full_name="IITB Sport Display Bold",
    postscript="IITBSportDisplay-Bold"
)
set_name(font, 5, "Version 1.0; IITB Sports 2025")
set_name(font, 0, "Copyright 2025 IIT Bombay Sports. Based on DejaVu fonts (Bitstream Vera).")
set_name(font, 13, "For use within IIT Bombay Sports digital properties.")

save_font(font, "IITBSport-Display")

# ─────────────────────────────────────────────
# FONT 2: IITB Sport Heading
# Base: DejaVuSansCondensed (Regular weight as heading, we set metrics for SemiBold feel)
# Role: Section headings, card titles, nav items
# Feel: Structured, authoritative, institutional
# ─────────────────────────────────────────────
print("\n[2/5] Building IITBSport-Heading...")
font = TTFont("/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf")

# Less condensed than display — breathable, clearly legible at medium sizes
scale_glyphs_horizontal(font, 0.93)
adjust_tracking(font, 15)   # Slightly open — heading hierarchy clearly distinct from display
adjust_line_height(font, 0.90)

set_weight_class(font, 600)
set_width_class(font, 4)  # SemiCondensed

update_all_names(font,
    family="IITB Sport Heading",
    style="SemiBold",
    full_name="IITB Sport Heading SemiBold",
    postscript="IITBSportHeading-SemiBold"
)
set_name(font, 5, "Version 1.0; IITB Sports 2025")
set_name(font, 0, "Copyright 2025 IIT Bombay Sports. Based on DejaVu fonts (Bitstream Vera).")

save_font(font, "IITBSport-Heading")

# ─────────────────────────────────────────────
# FONT 3: IITB Sport Text
# Base: Lora-Variable (editorial serif)
# Role: Article body, match reports, editorial long-form
# Feel: Premium, heritage, warm — like a sporting gazette
# ─────────────────────────────────────────────
print("\n[3/5] Building IITBSport-Text...")
font = TTFont("/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf")

# Subtle refinements only — Lora is already excellent
adjust_line_height(font, 0.93)
adjust_tracking(font, -4)

set_weight_class(font, 400)
set_width_class(font, 5)

update_all_names(font,
    family="IITB Sport Text",
    style="Regular",
    full_name="IITB Sport Text Regular",
    postscript="IITBSportText-Regular"
)
set_name(font, 5, "Version 1.0; IITB Sports 2025")
set_name(font, 0, "Copyright 2025 IIT Bombay Sports. Based on Lora by Cyreal (SIL OFL).")

save_font(font, "IITBSport-Text")

# ─────────────────────────────────────────────
# FONT 4: IITB Sport Mono
# Base: LiberationMono-Bold
# Role: Scoreboards, live scores, stats tables, timestamps
# Feel: Dense scoreboard ticker, precision data
# ─────────────────────────────────────────────
print("\n[4/5] Building IITBSport-Mono...")
font = TTFont("/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf")

adjust_tracking(font, -14)
adjust_line_height(font, 0.86)

set_weight_class(font, 700)
set_width_class(font, 5)

update_all_names(font,
    family="IITB Sport Mono",
    style="Bold",
    full_name="IITB Sport Mono Bold",
    postscript="IITBSportMono-Bold"
)
set_name(font, 5, "Version 1.0; IITB Sports 2025")
set_name(font, 0, "Copyright 2025 IIT Bombay Sports. Based on Liberation Mono (Red Hat, SIL OFL).")

save_font(font, "IITBSport-Mono")

# ─────────────────────────────────────────────
# FONT 5: IITB Sport Caption
# Base: Poppins-Light
# Role: Labels, captions, tags, metadata, photo credits
# Feel: Clean, modern, airy — counterbalances the heavy display faces
# ─────────────────────────────────────────────
print("\n[5/5] Building IITBSport-Caption...")
font = TTFont("/usr/share/fonts/truetype/google-fonts/Poppins-Light.ttf")

adjust_tracking(font, 10)    # Slight extra air for small-text legibility
adjust_line_height(font, 1.05)

set_weight_class(font, 300)
set_width_class(font, 5)

update_all_names(font,
    family="IITB Sport Caption",
    style="Light",
    full_name="IITB Sport Caption Light",
    postscript="IITBSportCaption-Light"
)
set_name(font, 5, "Version 1.0; IITB Sports 2025")
set_name(font, 0, "Copyright 2025 IIT Bombay Sports. Based on Poppins by Indian Type Foundry (SIL OFL).")

save_font(font, "IITBSport-Caption")

# ─────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────
print("\n" + "="*52)
print("IITB Sports Font Family — Build Complete")
print("="*52)
files = sorted(os.listdir(OUTPUT_DIR))
for f in files:
    size = os.path.getsize(os.path.join(OUTPUT_DIR, f)) // 1024
    print(f"  {f:<48} {size:>5} KB")
print(f"\nTotal files: {len(files)} (5 TTF + 5 WOFF2)")
