#!/usr/bin/env python3
"""
Motor de Gráficos Platzi — Deep Research: Impacto Digital en Jóvenes
Genera 8 visualizaciones en estilo Platzi Dark con datos de ambos deep researches.
"""

import os
import json
import math

# ── Paleta Platzi ────────────────────────────────────────────────────────────
BG       = "#101219"
CARD     = "#181B28"
ELEVATED = "#202538"
GRID     = "#23293F"
MINT     = "#0AE88A"
BLUE     = "#3D51F2"
LILAC    = "#8E9BF7"
YELLOW   = "#F2D412"
ORANGE   = "#FE7E57"
RED      = "#F0524B"
CYAN     = "#00F0FF"
WHITE    = "#FFFFFF"
GRAY     = "#8892A4"

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgba(h, a=1.0):
    r, g, b = hex_to_rgb(h)
    return f"rgba({r},{g},{b},{a})"

def write_svg(filename, content, w=1920, h=1080):
    path = os.path.join(OUTPUT_DIR, filename)
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;700&amp;family=IBM+Plex+Mono:wght@400;600&amp;display=swap');
      text {{ font-family: "IBM Plex Sans", "Segoe UI", Arial, sans-serif; }}
      .mono {{ font-family: "IBM Plex Mono", "Courier New", monospace; font-feature-settings: "tnum" 1, "zero" 1; }}
    </style>
  </defs>
  {content}
</svg>'''
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f"✓ {filename}")
    return path

def bg_rect(w=1920, h=1080):
    return f'<rect width="{w}" height="{h}" fill="{BG}"/>'

def card(x, y, w, h, color=CARD, rx=12):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{color}" rx="{rx}"/>'

def badge_text(x, y, text, color=MINT):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="13" font-weight="700" letter-spacing="2" class="mono">{text}</text>'

def title_text(x, y, text, size=36, color=WHITE, anchor="start"):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="700" text-anchor="{anchor}">{text}</text>'

def sub_text(x, y, text, size=16, color=GRAY, anchor="start"):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="400" text-anchor="{anchor}">{text}</text>'

def label_text(x, y, text, size=14, color=WHITE, anchor="middle"):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="500" text-anchor="{anchor}">{text}</text>'

def value_text(x, y, text, size=24, color=MINT, anchor="middle"):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="700" text-anchor="{anchor}" class="mono">{text}</text>'

def source_text(x, y, text, color=GRAY):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="12" font-weight="400">{text}</text>'

def grid_line(x1, y1, x2, y2):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{GRID}" stroke-width="1"/>'

def neon_line(x1, y1, x2, y2, color=MINT, w=2):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}" stroke-linecap="round"/>'

# ═══════════════════════════════════════════════════════════════════════════════
# GRÁFICO 1 — Tiempo de Pantalla por Región (Bar Vertical)
# ═══════════════════════════════════════════════════════════════════════════════
def chart_01_screen_time():
    data = [
        ("Brasil",    9.22, MINT),
        ("Colombia",  8.72, MINT),
        ("Argentina", 8.68, MINT),
        ("ALC Prom.", 8.53, LILAC),
        ("EE.UU.",    7.03, ORANGE),
        ("Global",    6.85, BLUE),
    ]
    W, H = 1920, 1080
    chart_x, chart_y = 180, 240
    chart_w, chart_h = 940, 620

    max_val = 10
    bar_w   = 110
    gap     = (chart_w - len(data) * bar_w) // (len(data) + 1)

    elems = [bg_rect(W, H)]

    # Gradiente de fondo
    elems.append(f'''<defs>
      <linearGradient id="bg_grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1A1F35"/>
        <stop offset="100%" stop-color="{BG}"/>
      </linearGradient>
    </defs>''')
    elems.append(f'<rect width="{W}" height="{H}" fill="url(#bg_grad)"/>')

    # Panel izquierdo (gráfico)
    elems.append(card(60, 60, chart_w + 120, H - 120, CARD))

    # Badge
    elems.append(badge_text(180, 118, "CONSUMO DIGITAL // REGIÓN AMÉRICAS", MINT))
    elems.append(title_text(180, 160, "Tiempo de Pantalla Diario Promedio", 38, WHITE))
    elems.append(sub_text(180, 190, "Horas de uso digital por habitante · 2025-2026", 16, GRAY))

    # Grid lines
    for i in range(6):
        val = i * 2
        yy = chart_y + chart_h - (val / max_val) * chart_h
        elems.append(grid_line(chart_x, yy, chart_x + chart_w, yy))
        elems.append(f'<text x="{chart_x - 12}" y="{yy + 5}" fill="{GRAY}" font-size="13" text-anchor="end" class="mono">{val}h</text>')

    # Barras
    for i, (label, val, color) in enumerate(data):
        bx = chart_x + gap + i * (bar_w + gap)
        bh = (val / max_val) * chart_h
        by = chart_y + chart_h - bh

        # Barra principal
        elems.append(f'<rect x="{bx}" y="{by}" width="{bar_w}" height="{bh}" fill="{color}" rx="6" opacity="0.9"/>')

        # Brillo superior
        elems.append(f'<rect x="{bx}" y="{by}" width="{bar_w}" height="8" fill="{rgba(WHITE, 0.15)}" rx="6"/>')

        # Valor encima
        elems.append(value_text(bx + bar_w // 2, by - 16, f"{val}h", 22, color))

        # Label debajo
        elems.append(label_text(bx + bar_w // 2, chart_y + chart_h + 32, label, 15, WHITE))

    # Eje X
    elems.append(neon_line(chart_x, chart_y + chart_h, chart_x + chart_w, chart_y + chart_h, GRID, 1))

    # Panel derecho (KPIs)
    kpis = [
        ("9h 13m", "Brasil lidera LATAM", MINT),
        ("8h 32m", "Promedio ALC", LILAC),
        ("9h diarias", "Gen Z Global (pico)", YELLOW),
        ("41%", "adolescentes >8h/día", ORANGE),
        ("70%+", "penetración móvil ALC", BLUE),
        (">4h", "50.4% teens EE.UU.", RED),
    ]
    kx, ky = 1180, 80
    for j, (val, label, color) in enumerate(kpis):
        yy = ky + j * 148
        elems.append(card(kx, yy, 680, 128, ELEVATED, 10))
        elems.append(value_text(kx + 170, yy + 52, val, 38, color))
        elems.append(sub_text(kx + 40, yy + 88, label, 15, GRAY))
        elems.append(f'<rect x="{kx}" y="{yy}" width="6" height="128" fill="{color}" rx="3"/>')

    # Fuentes
    elems.append(source_text(180, H - 70, "Fuentes: DemandSage (2026) · CDC Data Brief #513 (2024) · GWI · BID (2024) · PNUD (2025)"))

    return write_svg("01_screen_time_region.svg", "\n".join(elems), W, H)


# ═══════════════════════════════════════════════════════════════════════════════
# GRÁFICO 2 — Ansiedad y Depresión por Tiempo de Pantalla (Barras Agrupadas)
# ═══════════════════════════════════════════════════════════════════════════════
def chart_02_mental_health():
    W, H = 1920, 1080
    elems = [bg_rect(W, H)]

    chart_x, chart_y = 180, 240
    chart_w, chart_h = 960, 620
    max_val = 35

    grupos = [
        ("<4h/día", 12.3, 9.5),
        (">4h/día", 27.1, 25.9),
    ]
    colors = [MINT, BLUE]
    labels_bar = ["Ansiedad (%)", "Depresión (%)"]
    bar_w = 140
    group_gap = 200

    elems.append(card(60, 60, chart_w + 120, H - 120, CARD))

    elems.append(badge_text(180, 118, "SALUD MENTAL // ADOLESCENTES EE.UU.", RED))
    elems.append(title_text(180, 160, "Ansiedad y Depresión vs. Tiempo de Pantalla", 36, WHITE))
    elems.append(sub_text(180, 195, "Prevalencia de sintomatología clínica según exposición diaria · CDC 2024", 16, GRAY))

    for i in range(8):
        val = i * 5
        yy = chart_y + chart_h - (val / max_val) * chart_h
        elems.append(grid_line(chart_x, yy, chart_x + chart_w, yy))
        elems.append(f'<text x="{chart_x - 12}" y="{yy + 5}" fill="{GRAY}" font-size="13" text-anchor="end" class="mono">{val}%</text>')

    for gi, (glabel, anx, dep) in enumerate(grupos):
        gx = chart_x + 120 + gi * (2 * bar_w + group_gap + 60)

        for bi, (val, color) in enumerate([(anx, MINT), (dep, BLUE)]):
            bx = gx + bi * (bar_w + 20)
            bh = (val / max_val) * chart_h
            by = chart_y + chart_h - bh

            elems.append(f'<rect x="{bx}" y="{by}" width="{bar_w}" height="{bh}" fill="{color}" rx="6" opacity="0.88"/>')
            elems.append(f'<rect x="{bx}" y="{by}" width="{bar_w}" height="8" fill="{rgba(WHITE, 0.18)}" rx="6"/>')
            elems.append(value_text(bx + bar_w // 2, by - 14, f"{val}%", 22, color))

        mid_x = gx + bar_w + 10
        elems.append(label_text(mid_x, chart_y + chart_h + 34, glabel, 17, WHITE))

    elems.append(neon_line(chart_x, chart_y + chart_h, chart_x + chart_w, chart_y + chart_h, GRID, 1))

    # Leyenda
    for li, (lab, col) in enumerate(zip(labels_bar, colors)):
        lx = chart_x + li * 240
        elems.append(f'<rect x="{lx}" y="{chart_y + chart_h + 64}" width="20" height="16" fill="{col}" rx="4"/>')
        elems.append(sub_text(lx + 28, chart_y + chart_h + 78, lab, 14, WHITE))

    # Panel KPI derecho
    kpis = [
        ("×2.2", "Riesgo depresión en >3h redes", RED),
        ("+120%", "Incremento ansiedad >4h/día", ORANGE),
        ("6.6%", "Ideación suicida adolescentes CO", LILAC),
        ("22%", "Prevalencia TCA en jóvenes", YELLOW),
        ("1.8×", "Mayor impacto en mujeres jóvenes ALC", MINT),
    ]
    kx, ky = 1200, 100
    for j, (val, label, color) in enumerate(kpis):
        yy = ky + j * 164
        elems.append(card(kx, yy, 660, 140, ELEVATED, 10))
        elems.append(value_text(kx + 160, yy + 58, val, 40, color))
        elems.append(sub_text(kx + 36, yy + 96, label, 14, GRAY))
        elems.append(f'<rect x="{kx}" y="{yy}" width="6" height="140" fill="{color}" rx="3"/>')

    elems.append(source_text(180, H - 70, "Fuentes: CDC Data Brief #513 (2024) · US Surgeon General Advisory (2023) · BID (2024) · PNUD (2025)"))
    return write_svg("02_mental_health_screen.svg", "\n".join(elems), W, H)


# ═══════════════════════════════════════════════════════════════════════════════
# GRÁFICO 3 — Deuda Cognitiva: Impacto IA en Aprendizaje (Barras Horizontales)
# ═══════════════════════════════════════════════════════════════════════════════
def chart_03_cognitive_debt():
    W, H = 1920, 1080
    elems = [bg_rect(W, H)]

    metrics = [
        ("Incapacidad de citar propio texto",     83.3, RED,    "83.3% con LLM"),
        ("Reducción en reflexión interna",         66.0, ORANGE, "-66% por uso de IA"),
        ("Reducción razonamiento crítico",         41.0, YELLOW, "-41% por unidad de uso"),
        ("Menor necesidad de comprender fondo",    21.0, LILAC,  "-21% en profundidad"),
        ("Caída en exámenes no asistidos",         35.0, BLUE,   "Caída significativa PNAS"),
        ("Delegación evaluación conceptual",       56.0, MINT,   "56% delega a IA"),
    ]

    chart_x, chart_y = 500, 200
    chart_w, chart_h = 1120, 640
    max_val = 100

    elems.append(card(60, 60, W - 120, H - 120, CARD))
    elems.append(badge_text(500, 118, "DEUDA COGNITIVA // UNIVERSITARIOS Y SECUNDARIA", ORANGE))
    elems.append(title_text(500, 158, "Impacto del Uso de IA en el Rendimiento Real", 36, WHITE))
    elems.append(sub_text(500, 192, "Estudios: MIT Media Lab · Oregon State · PNAS Bastani et al. · Stanojev 2026", 15, GRAY))

    bar_h = 62
    spacing = chart_h // len(metrics)

    for i, (label, val, color, note) in enumerate(metrics):
        by = chart_y + i * spacing + 16
        bw = (val / max_val) * chart_w

        # Fondo gris
        elems.append(f'<rect x="{chart_x}" y="{by}" width="{chart_w}" height="{bar_h - 8}" fill="{GRID}" rx="6" opacity="0.4"/>')
        # Barra coloreada
        elems.append(f'<rect x="{chart_x}" y="{by}" width="{bw}" height="{bar_h - 8}" fill="{color}" rx="6" opacity="0.9"/>')
        # Brillo
        elems.append(f'<rect x="{chart_x}" y="{by}" width="{bw}" height="8" fill="{rgba(WHITE, 0.2)}" rx="6"/>')

        # Label izquierda
        elems.append(f'<text x="{chart_x - 16}" y="{by + bar_h//2}" fill="{WHITE}" font-size="14" font-weight="500" text-anchor="end">{label}</text>')
        # Valor derecha
        elems.append(f'<text x="{chart_x + bw + 12}" y="{by + bar_h//2}" fill="{color}" font-size="15" font-weight="700" class="mono">{note}</text>')

    elems.append(source_text(500, H - 70, "Fuentes: Kosmyna et al. MIT (2025) · Choudhuri & Sarma Oregon State (2026) · Bastani et al. PNAS (2025) · Stanojev Innovative Pedagogy (2026)"))
    return write_svg("03_cognitive_debt.svg", "\n".join(elems), W, H)


# ═══════════════════════════════════════════════════════════════════════════════
# GRÁFICO 4 — Colapso de Atención: Tiempo de Enfoque 2004-2026 (Line Chart)
# ═══════════════════════════════════════════════════════════════════════════════
def chart_04_attention_collapse():
    W, H = 1920, 1080
    data_pts = [
        (2004, 150, "150 seg"),
        (2008, 120, ""),
        (2012, 75,  "75 seg"),
        (2016, 63,  ""),
        (2020, 55,  ""),
        (2023, 47,  "47 seg"),
        (2026, 40,  "~40 seg"),
    ]
    elems = [bg_rect(W, H)]

    chart_x, chart_y = 180, 220
    chart_w, chart_h = 980, 620
    max_val = 160
    min_year, max_year = 2004, 2026

    elems.append(card(60, 60, chart_w + 120, H - 120, CARD))
    elems.append(badge_text(180, 118, "ECONOMÍA DE LA ATENCIÓN // CRISIS COGNITIVA LABORAL", RED))
    elems.append(title_text(180, 158, "Colapso del Tiempo de Enfoque Sostenido", 36, WHITE))
    elems.append(sub_text(180, 192, "Segundos de atención continua en pantalla · UC Irvine · Dra. Gloria Mark", 15, GRAY))

    # Grid
    for i in range(5):
        val = i * 40
        yy = chart_y + chart_h - (val / max_val) * chart_h
        elems.append(grid_line(chart_x, yy, chart_x + chart_w, yy))
        elems.append(f'<text x="{chart_x - 14}" y="{yy + 5}" fill="{GRAY}" font-size="13" text-anchor="end" class="mono">{val}s</text>')

    def pt(year, val):
        x = chart_x + (year - min_year) / (max_year - min_year) * chart_w
        y = chart_y + chart_h - (val / max_val) * chart_h
        return x, y

    # Área de relleno
    pts_area = " ".join(f"{pt(y, v)[0]},{pt(y, v)[1]}" for y, v, _ in data_pts)
    first_x, _ = pt(data_pts[0][0], data_pts[0][1])
    last_x,  _ = pt(data_pts[-1][0], data_pts[-1][1])
    bottom_y = chart_y + chart_h
    elems.append(f'<defs><linearGradient id="area_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="{RED}" stop-opacity="0.3"/><stop offset="100%" stop-color="{RED}" stop-opacity="0.02"/></linearGradient></defs>')
    elems.append(f'<polygon points="{first_x},{bottom_y} {pts_area} {last_x},{bottom_y}" fill="url(#area_grad)"/>')

    # Línea principal
    path_d = "M " + " L ".join(f"{pt(y, v)[0]:.1f},{pt(y, v)[1]:.1f}" for y, v, _ in data_pts)
    elems.append(f'<path d="{path_d}" fill="none" stroke="{RED}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')

    # Puntos y labels
    for year, val, lbl in data_pts:
        x, y = pt(year, val)
        elems.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="8" fill="{BG}" stroke="{RED}" stroke-width="3"/>')
        elems.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="{RED}"/>')
        if lbl:
            elems.append(f'<text x="{x:.1f}" y="{y - 18:.1f}" fill="{RED}" font-size="16" font-weight="700" text-anchor="middle" class="mono">{lbl}</text>')
        elems.append(f'<text x="{x:.1f}" y="{chart_y + chart_h + 28}" fill="{GRAY}" font-size="13" text-anchor="middle">{year}</text>')

    elems.append(neon_line(chart_x, chart_y + chart_h, chart_x + chart_w, chart_y + chart_h, GRID, 1))

    # Anotación -73%
    ax, ay = pt(2026, 40)
    elems.append(f'<text x="{ax - 60}" y="{ay - 52}" fill="{YELLOW}" font-size="28" font-weight="700" class="mono">-73%</text>')
    elems.append(f'<text x="{ax - 60}" y="{ay - 28}" fill="{GRAY}" font-size="13">desde 2004</text>')

    # Panel KPIs
    kpis = [
        ("23min 15s", "Recuperación de atención plena\ntras interrupción digital", RED),
        ("44%", "Interrupciones autoinducidas\npor revisión compulsiva", ORANGE),
        ("$9.6T", "Costo global desenganche\nlaboral/año (Gallup 2026)", YELLOW),
        ("15 pts", "Caída PISA Matemáticas\n2018–2022 (OCDE)", BLUE),
        ("-3%", "Contracción PIB tendencial\npor pérdida educativa", RED),
    ]
    kx, ky = 1220, 80
    for j, (val, label, color) in enumerate(kpis):
        yy = ky + j * 178
        elems.append(card(kx, yy, 640, 154, ELEVATED, 10))
        elems.append(value_text(kx + 160, yy + 62, val, 36, color))
        lines = label.split('\n')
        for li, line in enumerate(lines):
            elems.append(sub_text(kx + 36, yy + 96 + li * 20, line, 13, GRAY))
        elems.append(f'<rect x="{kx}" y="{yy}" width="6" height="154" fill="{color}" rx="3"/>')

    elems.append(source_text(180, H - 70, "Fuentes: Dr. Gloria Mark, UC Irvine (2004-2023) · Gallup State of Global Workplace (2025-2026) · OCDE PISA (2022)"))
    return write_svg("04_attention_collapse.svg", "\n".join(elems), W, H)


# ═══════════════════════════════════════════════════════════════════════════════
# GRÁFICO 5 — Litigios y Multas a Gigantes Tech (Bar Horizontal)
# ═══════════════════════════════════════════════════════════════════════════════
def chart_05_litigation():
    W, H = 1920, 1080
    data = [
        ("Meta · AG Multiestatal EE.UU.",        17100, MINT,    "2026"),
        ("Meta · Distritos Escolares (MDL 3047)", 27,    LILAC,   "2025"),
        ("Meta+YouTube · JCCP CA (KGM)",          6,     BLUE,    "2025"),
        ("Character.ai · Garcia v. Char.AI",      0.8,   ORANGE,  "2026"),
        ("TikTok · DSA Europa (potencial 6%)",    6000,  RED,     "2025"),
        ("Snap+TikTok · Demandas Estatales",      500,   YELLOW,  "2024-26"),
    ]

    elems = [bg_rect(W, H)]
    elems.append(card(60, 60, W - 120, H - 120, CARD))
    elems.append(badge_text(200, 118, "LITIGIOS GLOBALES // RESPONSABILIDAD CORPORATIVA DIGITAL", MINT))
    elems.append(title_text(200, 158, "Multas, Acuerdos y Veredictos contra Big Tech", 36, WHITE))
    elems.append(sub_text(200, 192, "Millones de USD · Jurisdicciones EE.UU. y Europa · 2024-2026", 15, GRAY))

    chart_x, chart_y = 520, 228
    chart_w = 1000
    bar_h   = 64
    spacing = (H - chart_y - 140) // len(data)

    max_val_log = 5  # log10(17100) ~ 4.23 → usamos escala visual proporcional normalizada

    # Escala logarítmica visual
    def bar_width(v):
        return max(40, (math.log10(v + 1) / math.log10(18000)) * chart_w)

    for i, (label, val, color, year) in enumerate(data):
        by = chart_y + i * spacing
        bw = bar_width(val)

        # Fondo
        elems.append(f'<rect x="{chart_x}" y="{by + 6}" width="{chart_w}" height="{bar_h - 12}" fill="{GRID}" rx="6" opacity="0.35"/>')
        # Barra
        elems.append(f'<rect x="{chart_x}" y="{by + 6}" width="{bw:.0f}" height="{bar_h - 12}" fill="{color}" rx="6" opacity="0.9"/>')
        # Brillo
        elems.append(f'<rect x="{chart_x}" y="{by + 6}" width="{bw:.0f}" height="8" fill="{rgba(WHITE, 0.2)}" rx="6"/>')

        # Label izq
        elems.append(f'<text x="{chart_x - 16}" y="{by + bar_h // 2 + 6}" fill="{WHITE}" font-size="14" font-weight="500" text-anchor="end">{label}</text>')
        # Año
        elems.append(f'<text x="{chart_x - 16}" y="{by + bar_h // 2 + 24}" fill="{GRAY}" font-size="12" text-anchor="end">{year}</text>')

        # Valor der
        disp = f"${val:,.0f}M" if val >= 1 else f"${val*1000:.0f}K"
        if val >= 1000:
            disp = f"${val/1000:.1f}B"
        elems.append(f'<text x="{chart_x + bw + 14}" y="{by + bar_h // 2 + 6}" fill="{color}" font-size="17" font-weight="700" class="mono">{disp}</text>')

    # Nota escala
    elems.append(sub_text(chart_x, H - 110, "Nota: Escala logarítmica visual para comparar órdenes de magnitud", 13, GRAY))
    elems.append(source_text(200, H - 75, "Fuentes: MDL-3047 (ND California) · JCCP 5255 (California) · AG Multiestatal EE.UU. · DSA Comisión Europea · Garcia v. Character Technologies (M.D. Florida, 2025)"))
    return write_svg("05_litigation_tech.svg", "\n".join(elems), W, H)


# ═══════════════════════════════════════════════════════════════════════════════
# GRÁFICO 6 — Impacto Brasil: Apuestas y Bolsa Família (Bento Grid KPIs)
# ═══════════════════════════════════════════════════════════════════════════════
def chart_06_brazil_bets():
    W, H = 1920, 1080
    elems = [bg_rect(W, H)]
    elems.append(card(60, 60, W - 120, H - 120, CARD))
    elems.append(badge_text(180, 118, "MOVILIDAD SOCIAL // BRASIL · APUESTAS DIGITALES", RED))
    elems.append(title_text(180, 158, "Devastación Financiera del Juego Digital en Brasil", 36, WHITE))
    elems.append(sub_text(180, 192, "Banco Central do Brasil · Estudo Especial nº 119/2024", 15, GRAY))

    kpis = [
        # (val, label, sublabel, color, x, y, w, h)
        ("R$20B/mes", "Gasto mensual\nen apuestas virtuales", "~USD 3,600M mensuales", RED,    180, 240, 480, 220),
        ("R$3B/mes",  "Recursos de\nBolsa Família desviados", "~20% del programa social", ORANGE, 700, 240, 480, 220),
        ("5M",        "Beneficiarios\nvulnerables afectados", "Fondos de alimentación y salud", YELLOW, 1220, 240, 480, 220),
        ("18-30",     "Cohorte de mayor\nexposición financiera", "Imposibilidad de ahorro temprano", MINT, 180, 500, 480, 220),
        ("R$240B",    "Drenaje anualizado\nde la economía real", "Equivale a ~4% del PIB Brasil", LILAC, 700, 500, 480, 220),
        ("Morosidad", "Tasas bancarias\nen alza", "Estratos socioeconómicos bajos", BLUE, 1220, 500, 480, 220),
        ("20%", "del presupuesto Bolsa Família\nes absorbido por plataformas digitales de juego", "", RED, 180, 760, 1520, 200),
    ]

    for (val, label, sub, color, x, y, w, h) in kpis:
        elems.append(card(x, y, w, h, ELEVATED, 12))
        elems.append(f'<rect x="{x}" y="{y}" width="{w}" height="6" fill="{color}" rx="3"/>')
        elems.append(value_text(x + w // 2, y + 80, val, 42, color, "middle"))
        lines = label.split('\n')
        for li, line in enumerate(lines):
            elems.append(sub_text(x + 24, y + 120 + li * 22, line, 15, WHITE))
        if sub:
            elems.append(sub_text(x + 24, y + h - 28, sub, 13, GRAY))

    elems.append(source_text(180, H - 75, "Fuentes: Banco Central do Brasil · Estudo Especial nº 119/2024 · OCDE · Hanushek & Woessmann (2024)"))
    return write_svg("06_brazil_bets.svg", "\n".join(elems), W, H)


# ═══════════════════════════════════════════════════════════════════════════════
# GRÁFICO 7 — Plataformas en ALC (% jóvenes) + Uso con Donut Chart
# ═══════════════════════════════════════════════════════════════════════════════
def chart_07_latam_platforms():
    W, H = 1920, 1080
    elems = [bg_rect(W, H)]
    elems.append(card(60, 60, W - 120, H - 120, CARD))
    elems.append(badge_text(180, 118, "PLATAFORMAS DIGITALES // NIÑOS Y JÓVENES LATAM", CYAN))
    elems.append(title_text(180, 158, "Uso de Plataformas en Menores 9-17 años · Brasil 2024", 35, WHITE))
    elems.append(sub_text(180, 192, "ICT Kids Online Brasil 2024 · Cetic.br / UNESCO", 15, GRAY))

    platforms = [
        ("WhatsApp",  71, MINT),
        ("YouTube",   66, BLUE),
        ("Instagram", 60, LILAC),
        ("TikTok",    50, RED),
        ("Facebook",  38, YELLOW),
        ("Twitter/X", 22, ORANGE),
    ]

    # Barras verticales
    chart_x, chart_y = 180, 240
    chart_w, chart_h = 820, 580
    bar_w = 100
    gap   = (chart_w - len(platforms) * bar_w) // (len(platforms) + 1)

    for i in range(5):
        val = i * 20
        yy = chart_y + chart_h - (val / 80) * chart_h
        elems.append(grid_line(chart_x, yy, chart_x + chart_w, yy))
        elems.append(f'<text x="{chart_x - 12}" y="{yy + 5}" fill="{GRAY}" font-size="13" text-anchor="end" class="mono">{val}%</text>')

    for i, (name, pct, color) in enumerate(platforms):
        bx = chart_x + gap + i * (bar_w + gap)
        bh = (pct / 80) * chart_h
        by = chart_y + chart_h - bh
        elems.append(f'<rect x="{bx}" y="{by}" width="{bar_w}" height="{bh}" fill="{color}" rx="6" opacity="0.9"/>')
        elems.append(f'<rect x="{bx}" y="{by}" width="{bar_w}" height="8" fill="{rgba(WHITE, 0.2)}" rx="6"/>')
        elems.append(value_text(bx + bar_w // 2, by - 14, f"{pct}%", 22, color))
        elems.append(label_text(bx + bar_w // 2, chart_y + chart_h + 32, name, 14, WHITE))

    elems.append(neon_line(chart_x, chart_y + chart_h, chart_x + chart_w, chart_y + chart_h, GRID, 1))

    # Donut chart — distribución tiempo pantalla Gen Z
    cx, cy, r_outer, r_inner = 1430, 500, 220, 120
    donut_data = [
        (38, "Entretenimiento", MINT),
        (22, "Redes Sociales",  BLUE),
        (18, "Videojuegos",     ORANGE),
        (12, "Educación",       LILAC),
        (10, "Otros",           GRAY),
    ]
    angle = -90
    for pct, label, color in donut_data:
        sweep = pct * 3.6
        a1 = math.radians(angle)
        a2 = math.radians(angle + sweep)
        x1 = cx + r_outer * math.cos(a1)
        y1 = cy + r_outer * math.sin(a1)
        x2 = cx + r_outer * math.cos(a2)
        y2 = cy + r_outer * math.sin(a2)
        x3 = cx + r_inner * math.cos(a2)
        y3 = cy + r_inner * math.sin(a2)
        x4 = cx + r_inner * math.cos(a1)
        y4 = cy + r_inner * math.sin(a1)
        large = 1 if sweep > 180 else 0
        elems.append(f'<path d="M{x1:.1f},{y1:.1f} A{r_outer},{r_outer} 0 {large},1 {x2:.1f},{y2:.1f} L{x3:.1f},{y3:.1f} A{r_inner},{r_inner} 0 {large},0 {x4:.1f},{y4:.1f} Z" fill="{color}" opacity="0.9"/>')

        # Label en el arco
        mid_a = math.radians(angle + sweep / 2)
        lx = cx + (r_outer + 36) * math.cos(mid_a)
        ly = cy + (r_outer + 36) * math.sin(mid_a)
        elems.append(f'<text x="{lx:.1f}" y="{ly:.1f}" fill="{color}" font-size="13" font-weight="700" text-anchor="middle">{pct}%</text>')

        angle += sweep

    # Centro donut
    elems.append(title_text(cx, cy - 18, "9h", 52, WHITE, "middle"))
    elems.append(sub_text(cx - 50, cy + 14, "promedio Gen Z", 14, GRAY, "middle"))

    # Leyenda donut
    for i, (pct, label, color) in enumerate(donut_data):
        lx = cx - 120
        ly = cy + r_outer + 60 + i * 28
        elems.append(f'<rect x="{lx}" y="{ly - 12}" width="16" height="16" fill="{color}" rx="4"/>')
        elems.append(sub_text(lx + 24, ly, label, 13, WHITE))

    elems.append(title_text(cx, cy - r_outer - 40, "Distribución Tiempo Pantalla", 20, WHITE, "middle"))
    elems.append(sub_text(cx - 80, cy - r_outer - 20, "Gen Z Global · 2026", 14, GRAY, "middle"))

    elems.append(source_text(180, H - 75, "Fuentes: Cetic.br / UNESCO ICT Kids Online Brasil (2024) · DemandSage (2026) · GWI Global Media Report"))
    return write_svg("07_latam_platforms.svg", "\n".join(elems), W, H)


# ═══════════════════════════════════════════════════════════════════════════════
# GRÁFICO 8 — Diapositiva Ejecutiva: Resumen Estratégico (Slide 16:9)
# ═══════════════════════════════════════════════════════════════════════════════
def chart_08_executive_slide():
    W, H = 1920, 1080
    elems = [bg_rect(W, H)]

    # Fondo con gradiente
    elems.append(f'''<defs>
      <linearGradient id="hero_grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0D1020"/>
        <stop offset="100%" stop-color="{BG}"/>
      </linearGradient>
    </defs>''')
    elems.append(f'<rect width="{W}" height="{H}" fill="url(#hero_grad)"/>')

    # Acento lateral izquierdo
    elems.append(f'<rect x="0" y="0" width="6" height="{H}" fill="{MINT}"/>')

    # Header
    elems.append(badge_text(80, 72, "DEEP RESEARCH SYNTHESIS // AGOSTO 2026", MINT))
    elems.append(title_text(80, 130, "Impacto Digital en la Juventud", 52, WHITE))
    elems.append(title_text(80, 188, "y la Economía Global", 52, LILAC))
    elems.append(sub_text(80, 230, "Síntesis ejecutiva de 2 deep research neurocognitivos y macroeconómicos", 17, GRAY))

    # Separador
    elems.append(neon_line(80, 258, 1840, 258, GRID, 1))

    # 6 métricas hero en 2 filas × 3
    metrics = [
        ("9h 13m",  "Tiempo pantalla Brasil\n(Líder Mundial)", MINT),
        ("$9.6T",   "Costo global\ndesenganche laboral/año", RED),
        ("47 seg",  "Atención sostenida\npromedio actual (2023)", ORANGE),
        ("-83.3%",  "Recordación propio texto\ncon asistencia LLM", YELLOW),
        ("$17.1B",  "Acuerdo Meta\nFiscales Generales EE.UU.", BLUE),
        ("$31T",    "Pérdida PIB futuro EE.UU.\npor déficit educativo", LILAC),
    ]

    cols = 3
    rows = 2
    mx0, my0 = 80, 290
    mw = (W - 160 - (cols - 1) * 24) // cols
    mh = (H - my0 - 80 - (rows - 1) * 24) // rows

    for i, (val, label, color) in enumerate(metrics):
        col = i % cols
        row = i // cols
        x = mx0 + col * (mw + 24)
        y = my0 + row * (mh + 24)

        elems.append(card(x, y, mw, mh, ELEVATED, 14))
        elems.append(f'<rect x="{x}" y="{y}" width="{mw}" height="6" fill="{color}" rx="3"/>')

        elems.append(value_text(x + mw // 2, y + mh // 2 - 10, val, 54, color, "middle"))
        lines = label.split('\n')
        for li, line in enumerate(lines):
            elems.append(sub_text(x + 24, y + mh // 2 + 36 + li * 22, line, 15, GRAY))

    # Footer
    elems.append(neon_line(80, H - 58, W - 80, H - 58, GRID, 1))
    elems.append(sub_text(80, H - 28, "Fuentes integradas: CDC · BID · PNUD · MIT · OCDE · Gallup · Banco Central Brasil · MDL-3047 · DSA Europa · PNAS · Cetic.br/UNESCO", 13, GRAY))
    elems.append(sub_text(W - 80, H - 28, "platzi-charts // antigravity", 13, GRAY, "end"))

    return write_svg("08_executive_slide.svg", "\n".join(elems), W, H)


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("Generando graficos Platzi - Impacto Digital en Jovenes y Economia")
    print("=" * 60)

    charts = [
        ("01 · Tiempo de Pantalla por Región",         chart_01_screen_time),
        ("02 · Ansiedad y Depresión vs Pantalla",       chart_02_mental_health),
        ("03 · Deuda Cognitiva: IA en Aprendizaje",     chart_03_cognitive_debt),
        ("04 · Colapso de la Atención 2004-2026",       chart_04_attention_collapse),
        ("05 · Litigios y Multas a Big Tech",           chart_05_litigation),
        ("06 · Brasil: Apuestas y Bolsa Família",       chart_06_brazil_bets),
        ("07 · Plataformas en LATAM + Donut",           chart_07_latam_platforms),
        ("08 · Diapositiva Ejecutiva Resumen",          chart_08_executive_slide),
    ]

    generated = []
    for name, fn in charts:
        print(f"\n  → {name}")
        try:
            path = fn()
            generated.append(path)
        except Exception as e:
            print(f"    ✗ Error: {e}")
            import traceback
            traceback.print_exc()

    # Manifest
    manifest = {
        "generated_at": "2026-08-29",
        "theme": "platzi_dark",
        "source_research": [
            "https://share.gemini.google/wv8rDXeBukrj",
            "https://share.gemini.google/KMCpkbkxBGoQ"
        ],
        "charts": [os.path.basename(p) for p in generated]
    }
    manifest_path = os.path.join(OUTPUT_DIR, "charts_manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"\n✅ {len(generated)} gráficos generados en: {OUTPUT_DIR}")
    print(f"📋 Manifest: {manifest_path}")
