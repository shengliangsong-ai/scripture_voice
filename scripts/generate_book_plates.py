#!/usr/bin/env python3
"""Generate 66 compact, museum-grade static 16:9 SVG study plates—one per canonical Bible book."""

import hashlib
import json
from pathlib import Path
from typing import Dict, List, Tuple

OUT_DIR = Path("public/data/images/books")
MANIFEST_PATH = Path("public/data/images/manifest.json")

# (id, slug, roman, palette_key, motif_key)
BOOKS: List[Tuple[int, str, str, str, str]] = [
    (1, "genesis", "I", "cosmos", "creation_cosmos"),
    (2, "exodus", "II", "amber", "parted_sea_pillar"),
    (3, "leviticus", "III", "gold", "menorah_sanctuary"),
    (4, "numbers", "IV", "desert", "desert_tents_stars"),
    (5, "deuteronomy", "V", "slate", "stone_tablets"),
    (6, "joshua", "VI", "terracotta", "trumpet_walls"),
    (7, "judges", "VII", "ember", "jar_torch"),
    (8, "ruth", "VIII", "harvest", "wheat_sheaves"),
    (9, "1samuel", "IX", "sage", "harp_crown"),
    (10, "2samuel", "X", "royal", "throne_harp"),
    (11, "1kings", "XI", "gold", "temple_pillars"),
    (12, "2kings", "XII", "ember", "chariot_mantle"),
    (13, "1chronicles", "XIII", "slate", "scroll_lyre"),
    (14, "2chronicles", "XIV", "gold", "temple_altar"),
    (15, "ezra", "XV", "parchment", "open_scroll_quill"),
    (16, "nehemiah", "XVI", "terracotta", "city_gate_wall"),
    (17, "esther", "XVII", "royal", "scepter_arch"),
    (18, "job", "XVIII", "cosmos", "whirlwind_stars"),
    (19, "psalm", "XIX", "sage", "still_waters_harp"),
    (20, "proverbs", "XX", "gold", "wisdom_lamps"),
    (21, "ecclesiastes", "XXI", "amber", "hourglass_sun"),
    (22, "songofsolomon", "XXII", "rose", "vineyard_lily"),
    (23, "isaiah", "XXIII", "ember", "seraph_mountain"),
    (24, "jeremiah", "XXIV", "terracotta", "potters_wheel"),
    (25, "lamentations", "XXV", "slate", "weeping_willow_wall"),
    (26, "ezekiel", "XXVI", "cosmos", "celestial_wheels"),
    (27, "daniel", "XXVII", "royal", "starry_arch_lions"),
    (28, "hosea", "XXVIII", "rose", "olive_vine_dawn"),
    (29, "joel", "XXIX", "amber", "outpoured_light_hills"),
    (30, "amos", "XXX", "terracotta", "plumb_line_basket"),
    (31, "obadiah", "XXXI", "slate", "rock_fortress"),
    (32, "jonah", "XXXII", "ocean", "ship_waves"),
    (33, "micah", "XXXIII", "sage", "bethlehem_hills_star"),
    (34, "nahum", "XXXIV", "ocean", "river_gates_storm"),
    (35, "habakkuk", "XXXV", "amber", "watchtower_dawn"),
    (36, "zephaniah", "XXXVI", "gold", "morning_horizon"),
    (37, "haggai", "XXXVII", "parchment", "cornerstone_temple"),
    (38, "zechariah", "XXXVIII", "gold", "olive_lampstand"),
    (39, "malachi", "XXXIX", "ember", "sun_of_righteousness"),
    (40, "matthew", "XL", "royal", "bethlehem_star_mount"),
    (41, "mark", "XLI", "ocean", "galilee_boat_waves"),
    (42, "luke", "XLII", "amber", "lantern_scroll"),
    (43, "john", "XLIII", "cosmos", "courtyard_lantern_vine"),
    (44, "acts", "XLIV", "ember", "pentecost_flame_ship"),
    (45, "romans", "XLV", "slate", "roman_arch_cross"),
    (46, "1corinthians", "XLVI", "gold", "sanctuary_lamps_olive"),
    (47, "2corinthians", "XLVII", "terracotta", "earthen_vessel_light"),
    (48, "galatians", "XLVIII", "sage", "fruitful_olive_tree"),
    (49, "ephesians", "XLIX", "slate", "shield_cornerstone"),
    (50, "philippians", "L", "gold", "laurel_scroll"),
    (51, "colossians", "LI", "cosmos", "rooted_cedar_crown"),
    (52, "1thessalonians", "LII", "amber", "watchful_dawn_star"),
    (53, "2thessalonians", "LIII", "slate", "steadfast_beacon"),
    (54, "1timothy", "LIV", "parchment", "pastoral_lamp"),
    (55, "2timothy", "LV", "ember", "torch_crowned_scroll"),
    (56, "titus", "LVI", "ocean", "cretan_harbor_anchor"),
    (57, "philemon", "LVII", "parchment", "wax_sealed_letter"),
    (58, "hebrews", "LVIII", "gold", "anchor_veil"),
    (59, "james", "LIX", "sage", "scales_rudder"),
    (60, "1peter", "LX", "slate", "living_stone_lighthouse"),
    (61, "2peter", "LXI", "cosmos", "daystar_horizon"),
    (62, "1john", "LXII", "ember", "hearth_flame_fellowship"),
    (63, "2john", "LXIII", "rose", "intertwined_branches"),
    (64, "3john", "LXIV", "parchment", "pilgrim_lantern_door"),
    (65, "jude", "LXV", "slate", "hilltop_watchtower"),
    (66, "revelation", "LXVI", "royal", "seven_lampstands_alpha_omega"),
]

PALETTES: Dict[str, Dict[str, str]] = {
    "cosmos": {"bg1": "#1D2636", "bg2": "#2C394B", "sky": "#394867", "accent": "#D8B467", "soft": "#9DB2CE", "ink": "#F3EBDD", "frame": "#B89550"},
    "amber": {"bg1": "#F5ECD9", "bg2": "#E5D3B3", "sky": "#D7B98E", "accent": "#8B5A2B", "soft": "#B6864C", "ink": "#3B2818", "frame": "#9A7444"},
    "gold": {"bg1": "#F7F1E3", "bg2": "#EADBBF", "sky": "#DFC89E", "accent": "#9C6F27", "soft": "#C59E55", "ink": "#3D2E16", "frame": "#A88440"},
    "desert": {"bg1": "#F3E8D6", "bg2": "#DEC6A4", "sky": "#C9A67B", "accent": "#7A4924", "soft": "#A8744B", "ink": "#3A2414", "frame": "#8E633C"},
    "slate": {"bg1": "#ECEAE4", "bg2": "#D6D2C9", "sky": "#BAC0C4", "accent": "#46525C", "soft": "#78848E", "ink": "#272E35", "frame": "#7E786A"},
    "terracotta": {"bg1": "#F4EAE2", "bg2": "#E4CBB9", "sky": "#D1A98F", "accent": "#8A462B", "soft": "#B66E50", "ink": "#3D2016", "frame": "#995E42"},
    "ember": {"bg1": "#2C201C", "bg2": "#463128", "sky": "#664433", "accent": "#E6A954", "soft": "#C47449", "ink": "#F7ECE1", "frame": "#C18D48"},
    "harvest": {"bg1": "#F6EFE0", "bg2": "#E7D5AE", "sky": "#D8BE87", "accent": "#8E6220", "soft": "#B98B42", "ink": "#3B2A12", "frame": "#9D7637"},
    "sage": {"bg1": "#EEF1EA", "bg2": "#D8E0D1", "sky": "#BCC9B2", "accent": "#4D6447", "soft": "#7B9273", "ink": "#243022", "frame": "#7A896F"},
    "royal": {"bg1": "#282233", "bg2": "#3E344D", "sky": "#564768", "accent": "#DFBA6A", "soft": "#A794BE", "ink": "#F6EFE5", "frame": "#B9944F"},
    "parchment": {"bg1": "#F8F4EC", "bg2": "#EAE0CE", "sky": "#DACBB2", "accent": "#6E5236", "soft": "#9C7E5E", "ink": "#332619", "frame": "#8E7355"},
    "rose": {"bg1": "#F5ECEA", "bg2": "#E4CECA", "sky": "#CFAEA9", "accent": "#7F4147", "soft": "#AB6C71", "ink": "#381D20", "frame": "#946266"},
    "ocean": {"bg1": "#EBF0F2", "bg2": "#CEDBE0", "sky": "#A7C0CA", "accent": "#2E5466", "soft": "#5D8394", "ink": "#1C323D", "frame": "#5E7B88"},
}


def render_motif(motif: str, p: Dict[str, str], seed: int) -> str:
    """Return crisp classical vector artwork centered in the 1280x720 plate."""
    a, s, ink, sky = p["accent"], p["soft"], p["ink"], p["sky"]

    if motif in ("creation_cosmos", "whirlwind_stars", "celestial_wheels", "daystar_horizon"):
        stars = "".join(
            f'<circle cx="{220 + ((seed * 73 + i * 137) % 840)}" cy="{120 + ((seed * 41 + i * 97) % 240)}" r="{1.5 + (i % 3) * 0.9:.1f}" fill="{ink}" opacity="0.65"/>'
            for i in range(18)
        )
        rings = (
            f'<circle cx="640" cy="320" r="145" fill="none" stroke="{a}" stroke-width="2" opacity="0.75"/>'
            f'<circle cx="640" cy="320" r="110" fill="none" stroke="{s}" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.8"/>'
            f'<circle cx="640" cy="320" r="54" fill="{a}" opacity="0.22"/>'
            f'<circle cx="640" cy="320" r="34" fill="{a}" opacity="0.85"/>'
        )
        waves = (
            f'<path d="M120 485 Q320 450 520 485 T920 485 T1160 485" fill="none" stroke="{s}" stroke-width="2" opacity="0.75"/>'
            f'<path d="M120 520 Q360 490 600 520 T1080 520 T1160 520" fill="none" stroke="{ink}" stroke-width="1.4" opacity="0.45"/>'
            f'<path d="M120 555 Q340 530 560 555 T1000 555 T1160 555" fill="none" stroke="{s}" stroke-width="1.2" opacity="0.5"/>'
        )
        return stars + rings + waves

    if motif in ("parted_sea_pillar", "ship_waves", "galilee_boat_waves", "river_gates_storm", "cretan_harbor_anchor"):
        sun = f'<circle cx="640" cy="240" r="68" fill="{a}" opacity="0.26"/><circle cx="640" cy="240" r="42" fill="{a}" opacity="0.78"/>'
        if motif == "parted_sea_pillar":
            pillar = f'<path d="M612 95 C602 220 622 330 618 485 L662 485 C658 330 678 220 668 95 Z" fill="{a}" opacity="0.32"/><path d="M160 490 Q360 360 555 495 M1120 490 Q920 360 725 495" fill="none" stroke="{s}" stroke-width="3"/>'
            return sun + pillar + f'<path d="M160 525 Q400 495 640 525 T1120 525" fill="none" stroke="{ink}" stroke-width="1.5" opacity="0.5"/>'
        boat = (
            f'<path d="M510 430 L770 430 L730 482 L550 482 Z" fill="{a}" opacity="0.85"/>'
            f'<line x1="640" y1="220" x2="640" y2="430" stroke="{ink}" stroke-width="3"/>'
            f'<path d="M644 235 Q735 305 720 405 L644 405 Z" fill="{ink}" opacity="0.82"/>'
            f'<path d="M636 260 Q575 315 585 398 L636 398 Z" fill="{s}" opacity="0.65"/>'
        )
        waves = (
            f'<path d="M140 495 Q280 465 420 495 T700 495 T980 495 T1140 495" fill="none" stroke="{a}" stroke-width="2.5"/>'
            f'<path d="M140 532 Q310 505 480 532 T820 532 T1140 532" fill="none" stroke="{s}" stroke-width="1.8" opacity="0.75"/>'
        )
        return sun + boat + waves

    if motif in ("menorah_sanctuary", "olive_lampstand", "seven_lampstands_alpha_omega", "sanctuary_lamps_olive", "wisdom_lamps"):
        branches = "".join(
            f'<path d="M640 450 Q{640 + dx} 375 {640 + dx} 255" fill="none" stroke="{a}" stroke-width="4" stroke-linecap="round"/>'
            f'<ellipse cx="{640 + dx}" cy="236" rx="7" ry="13" fill="{ink}" opacity="0.85"/>'
            for dx in (-135, -90, -45, 45, 90, 135)
        )
        stem = (
            f'<line x1="640" y1="220" x2="640" y2="515" stroke="{a}" stroke-width="5"/>'
            f'<ellipse cx="640" cy="200" rx="9" ry="16" fill="{a}"/>'
            f'<path d="M555 515 L725 515 L700 492 L580 492 Z" fill="{a}" opacity="0.85"/>'
            f'<circle cx="640" cy="315" r="190" fill="none" stroke="{s}" stroke-width="1.2" opacity="0.45"/>'
        )
        return stem + branches

    if motif in ("stone_tablets", "open_scroll_quill", "scroll_lyre", "laurel_scroll", "wax_sealed_letter", "torch_crowned_scroll"):
        tablets = (
            f'<rect x="470" y="185" width="155" height="275" rx="77" fill="none" stroke="{a}" stroke-width="3.5"/>'
            f'<rect x="655" y="185" width="155" height="275" rx="77" fill="none" stroke="{a}" stroke-width="3.5"/>'
            f'<rect x="484" y="200" width="127" height="245" rx="64" fill="{sky}" opacity="0.28"/>'
            f'<rect x="669" y="200" width="127" height="245" rx="64" fill="{sky}" opacity="0.28"/>'
        )
        lines = "".join(
            f'<line x1="515" y1="{265 + i * 26}" x2="585" y2="{265 + i * 26}" stroke="{ink}" stroke-width="2" opacity="0.55"/>'
            f'<line x1="695" y1="{265 + i * 26}" x2="765" y2="{265 + i * 26}" stroke="{ink}" stroke-width="2" opacity="0.55"/>'
            for i in range(6)
        )
        olive = (
            f'<path d="M390 480 Q510 520 640 500 Q770 520 890 480" fill="none" stroke="{s}" stroke-width="2"/>'
            f'<circle cx="640" cy="500" r="10" fill="{a}"/>'
        )
        return tablets + lines + olive

    if motif in ("still_waters_harp", "harp_crown", "throne_harp"):
        hills = (
            f'<path d="M120 440 Q320 330 560 415 T1000 390 L1160 440 L1160 565 L120 565 Z" fill="{sky}" opacity="0.35"/>'
            f'<path d="M120 490 Q420 465 640 490 T1160 490" fill="none" stroke="{s}" stroke-width="2"/>'
            f'<path d="M120 525 Q420 505 640 525 T1160 525" fill="none" stroke="{s}" stroke-width="1.4" opacity="0.65"/>'
        )
        harp = (
            f'<path d="M565 440 C550 320 570 215 620 185 C675 160 725 225 705 335 C692 405 660 440 615 440 Z" fill="none" stroke="{a}" stroke-width="4.5"/>'
            f'<line x1="560" y1="440" x2="650" y2="440" stroke="{a}" stroke-width="6" stroke-linecap="round"/>'
        )
        strings = "".join(
            f'<line x1="{585 + i * 18}" y1="{218 + i * 6}" x2="{585 + i * 18}" y2="438" stroke="{ink}" stroke-width="1.3" opacity="0.65"/>'
            for i in range(6)
        )
        return hills + harp + strings

    if motif in ("temple_pillars", "temple_altar", "city_gate_wall", "scepter_arch", "starry_arch_lions", "roman_arch_cross", "cornerstone_temple", "trumpet_walls"):
        arch = (
            f'<path d="M475 510 L475 305 A165 165 0 0 1 805 305 L805 510" fill="none" stroke="{a}" stroke-width="4"/>'
            f'<path d="M505 510 L505 310 A135 135 0 0 1 775 310 L775 510" fill="{sky}" opacity="0.22" stroke="{s}" stroke-width="1.5"/>'
            f'<line x1="360" y1="510" x2="920" y2="510" stroke="{a}" stroke-width="3"/>'
        )
        emblem = (
            f'<line x1="640" y1="245" x2="640" y2="415" stroke="{ink}" stroke-width="3.5" opacity="0.8"/>'
            f'<line x1="585" y1="305" x2="695" y2="305" stroke="{ink}" stroke-width="3.5" opacity="0.8"/>'
            f'<circle cx="640" cy="305" r="56" fill="none" stroke="{a}" stroke-width="1.5" opacity="0.65"/>'
        )
        return arch + emblem

    if motif in ("wheat_sheaves", "vineyard_lily", "olive_vine_dawn", "fruitful_olive_tree", "rooted_cedar_crown", "intertwined_branches"):
        trunk = (
            f'<path d="M640 505 C640 430 635 370 640 275" stroke="{a}" stroke-width="6" fill="none" stroke-linecap="round"/>'
            f'<path d="M640 390 Q575 340 520 315 M640 355 Q710 305 765 280 M640 315 Q590 250 565 215 M640 305 Q690 245 715 210" stroke="{a}" stroke-width="3" fill="none" stroke-linecap="round"/>'
        )
        leaves = "".join(
            f'<ellipse cx="{cx}" cy="{cy}" rx="28" ry="12" transform="rotate({rot} {cx} {cy})" fill="{s}" opacity="0.55"/>'
            for cx, cy, rot in [
                (515, 310, -25), (765, 275, 25), (560, 210, -40), (720, 205, 40),
                (640, 195, 0), (495, 355, -15), (785, 330, 18), (600, 265, -28), (680, 255, 28)
            ]
        )
        ground = f'<path d="M350 505 Q640 485 930 505" fill="none" stroke="{ink}" stroke-width="2" opacity="0.55"/>'
        return ground + leaves + trunk

    if motif in ("lantern_scroll", "courtyard_lantern_vine", "pastoral_lamp", "pilgrim_lantern_door", "earthen_vessel_light", "hearth_flame_fellowship", "jar_torch"):
        glow = f'<circle cx="640" cy="335" r="145" fill="{a}" opacity="0.16"/><circle cx="640" cy="335" r="90" fill="{a}" opacity="0.22"/>'
        lantern = (
            f'<path d="M585 250 L695 250 L718 285 L562 285 Z" fill="{a}" opacity="0.85"/>'
            f'<rect x="578" y="285" width="124" height="165" rx="6" fill="none" stroke="{a}" stroke-width="3.5"/>'
            f'<path d="M640 315 Q665 355 640 392 Q615 355 640 315 Z" fill="{a}"/>'
            f'<path d="M562 450 L718 450 L735 480 L545 480 Z" fill="{a}" opacity="0.85"/>'
            f'<circle cx="640" cy="228" r="16" fill="none" stroke="{a}" stroke-width="3"/>'
        )
        return glow + lantern

    if motif in ("bethlehem_star_mount", "bethlehem_hills_star", "seraph_mountain", "sun_of_righteousness", "morning_horizon", "outpoured_light_hills", "watchful_dawn_star", "hourglass_sun"):
        rays = "".join(
            f'<line x1="640" y1="220" x2="{640 + dx}" y2="{220 + dy}" stroke="{a}" stroke-width="1.8" opacity="0.6"/>'
            for dx, dy in [(0, -110), (0, 110), (-110, 0), (110, 0), (-75, -75), (75, -75), (-75, 75), (75, 75)]
        )
        star = f'<polygon points="640,145 658,202 715,220 658,238 640,295 622,238 565,220 622,202" fill="{a}" opacity="0.88"/>'
        hills = (
            f'<path d="M120 490 Q360 340 620 445 T1160 430 L1160 565 L120 565 Z" fill="{sky}" opacity="0.4"/>'
            f'<path d="M120 525 Q460 405 760 490 T1160 485" fill="none" stroke="{ink}" stroke-width="2" opacity="0.5"/>'
        )
        return rays + star + hills

    # Architectural / nautical / prophetic tools (anchors, scales, watchtower, potter, desert tents)
    halo = f'<circle cx="640" cy="330" r="150" fill="none" stroke="{a}" stroke-width="1.5" opacity="0.45"/><circle cx="640" cy="330" r="115" fill="{sky}" opacity="0.2"/>'
    anchor = (
        f'<circle cx="640" cy="215" r="22" fill="none" stroke="{a}" stroke-width="4"/>'
        f'<line x1="640" y1="237" x2="640" y2="465" stroke="{a}" stroke-width="4.5"/>'
        f'<line x1="575" y1="285" x2="705" y2="285" stroke="{a}" stroke-width="4"/>'
        f'<path d="M535 390 Q560 470 640 470 Q720 470 745 390" fill="none" stroke="{a}" stroke-width="4.5" stroke-linecap="round"/>'
        f'<polygon points="535,390 520,418 552,412" fill="{a}"/>'
        f'<polygon points="745,390 760,418 728,412" fill="{a}"/>'
    )
    return halo + anchor


def build_svg(book_id: int, slug: str, roman: str, palette_key: str, motif: str) -> str:
    p = PALETTES[palette_key]
    seed = int(hashlib.md5(slug.encode("utf-8")).hexdigest()[:8], 16)
    artwork = render_motif(motif, p, seed)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="Canonical Book {book_id}">'
        f'<defs>'
        f'<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
        f'<stop offset="0%" stop-color="{p["bg1"]}"/>'
        f'<stop offset="100%" stop-color="{p["bg2"]}"/>'
        f'</linearGradient>'
        f'<radialGradient id="glow" cx="50%" cy="46%" r="52%">'
        f'<stop offset="0%" stop-color="{p["sky"]}" stop-opacity="0.35"/>'
        f'<stop offset="100%" stop-color="{p["bg2"]}" stop-opacity="0"/>'
        f'</radialGradient>'
        f'</defs>'
        f'<rect width="1280" height="720" fill="url(#bg)"/>'
        f'<rect width="1280" height="720" fill="url(#glow)"/>'
        f'<rect x="34" y="34" width="1212" height="652" fill="none" stroke="{p["frame"]}" stroke-width="1.5" opacity="0.6"/>'
        f'<rect x="46" y="46" width="1188" height="628" fill="none" stroke="{p["frame"]}" stroke-width="0.8" opacity="0.4"/>'
        f'{artwork}'
        f'<text x="640" y="622" text-anchor="middle" font-family="Georgia, \'Times New Roman\', serif" font-size="18" letter-spacing="6" fill="{p["ink"]}" opacity="0.62">{roman} · {book_id:02d} / 66</text>'
        f'</svg>'
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    total_bytes = 0
    for book_id, slug, roman, palette_key, motif in BOOKS:
        svg_text = build_svg(book_id, slug, roman, palette_key, motif)
        target = OUT_DIR / f"{slug}.svg"
        target.write_text(svg_text, encoding="utf-8")
        total_bytes += target.stat().st_size

    # Keep public/data/images/manifest.json synced (preserving 4 flagship oil paintings + adding all 66 book plates)
    manifest = {}
    if MANIFEST_PATH.exists():
        try:
            manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        except Exception:
            manifest = {}

    for book_id, slug, _roman, _pal, _motif in BOOKS:
        manifest[f"book:{slug}"] = {
            "url": f"/data/images/books/{slug}.svg",
            "caption": f"Canonical Study Plate — Book {book_id:02d}",
        }

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Generated {len(BOOKS)} book SVG plates in {OUT_DIR} (total: {total_bytes / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
