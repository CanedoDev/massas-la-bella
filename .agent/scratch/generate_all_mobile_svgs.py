import math

def generate_custom_wavy_rect(w, h, margin, top_cycles, bottom_cycles, left_cycles, right_cycles, amp,
                             wavy_top=True, wavy_bottom=True, wavy_left=True, wavy_right=True):
    path_segments = []
    
    def add_segment(x1, y1, x2, y2, cycles, is_wavy, normal_dir=1):
        if not is_wavy:
            path_segments.append(f"L {x2:.3f} {y2:.3f}")
            return
            
        dx = x2 - x1
        dy = y2 - y1
        length = math.hypot(dx, dy)
        ux = dx / length
        uy = dy / length
        nx = -uy
        ny = ux
        
        num_half_cycles = int(cycles * 2)
        step_len = length / num_half_cycles
        
        current_x = x1
        current_y = y1
        
        for step in range(num_half_cycles):
            direction = normal_dir * (1 if step % 2 == 0 else -1)
            next_line_x = x1 + (step + 1) * step_len * ux
            next_line_y = y1 + (step + 1) * step_len * uy
            
            cp1_x = current_x + (step_len / 3) * ux + amp * 0.8 * direction * nx
            cp1_y = current_y + (step_len / 3) * uy + amp * 0.8 * direction * ny
            
            cp2_x = current_x + (2 * step_len / 3) * ux + amp * 0.8 * direction * nx
            cp2_y = current_y + (2 * step_len / 3) * uy + amp * 0.8 * direction * ny
            
            path_segments.append(f"C {cp1_x:.3f} {cp1_y:.3f}, {cp2_x:.3f} {cp2_y:.3f}, {next_line_x:.3f} {next_line_y:.3f}")
            
            current_x = next_line_x
            current_y = next_line_y

    tl_x = margin if wavy_left else 0
    tl_y = margin if wavy_top else 0
    
    tr_x = w - margin if wavy_right else w
    tr_y = margin if wavy_top else 0
    
    br_x = w - margin if wavy_right else w
    br_y = h - margin if wavy_bottom else h
    
    bl_x = margin if wavy_left else 0
    bl_y = h - margin if wavy_bottom else h
    
    path_segments.append(f"M {tl_x:.3f} {tl_y:.3f}")
    # Top
    add_segment(tl_x, tl_y, tr_x, tr_y, top_cycles, wavy_top, normal_dir=-1)
    # Right
    add_segment(tr_x, tr_y, br_x, br_y, right_cycles, wavy_right, normal_dir=1)
    # Bottom
    add_segment(br_x, br_y, bl_x, bl_y, bottom_cycles, wavy_bottom, normal_dir=1)
    # Left
    add_segment(bl_x, bl_y, tl_x, tl_y, left_cycles, wavy_left, normal_dir=-1)
    path_segments.append("Z")
    
    return " ".join(path_segments)

# ==============================================================================
# 1. GENERATE bg-produtos-mobile.svg (Flat sides, wavy top & bottom)
# ==============================================================================
prod_path = generate_custom_wavy_rect(
    w=390, h=797, margin=6, 
    top_cycles=6.5, bottom_cycles=6.5, left_cycles=13.5, right_cycles=13.5, amp=4,
    wavy_top=True, wavy_bottom=True, wavy_left=False, wavy_right=False
)
prod_svg = f"""<svg preserveAspectRatio="none" width="390" height="797" viewBox="0 0 390 797" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="{prod_path}" fill="#FEEDBF"/>
</svg>"""

with open("img/bg-produtos-mobile.svg", "w", encoding="utf-8") as f:
    f.write(prod_svg)

print("bg-produtos-mobile.svg written successfully (flat sides)!")

# ==============================================================================
# 2. GENERATE bg-menu-mobile.svg (Flat top, bottom, and right; wavy left division)
# ==============================================================================
menu_path = generate_custom_wavy_rect(
    w=390, h=850, margin=6, 
    top_cycles=6.5, bottom_cycles=6.5, left_cycles=13.5, right_cycles=13.5, amp=4,
    wavy_top=False, wavy_bottom=False, wavy_left=True, wavy_right=False
)
menu_svg = f"""<svg preserveAspectRatio="none" width="390" height="850" viewBox="0 0 390 850" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="{menu_path}" fill="white"/>
</svg>"""

with open("img/bg-menu-mobile.svg", "w", encoding="utf-8") as f:
    f.write(menu_svg)

print("bg-menu-mobile.svg written successfully (wavy left drawer only)!")

# ==============================================================================
# 3. GENERATE bg-empty-mobile.svg (Flat sides and bottom; wavy top)
# ==============================================================================
empty_path = generate_custom_wavy_rect(
    w=390, h=60, margin=6, 
    top_cycles=4.5, bottom_cycles=2.5, left_cycles=2.5, right_cycles=2.5, amp=3,
    wavy_top=True, wavy_bottom=False, wavy_left=False, wavy_right=False
)
empty_svg = f"""<svg preserveAspectRatio="none" width="390" height="60" viewBox="0 0 390 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="{empty_path}" fill="white"/>
</svg>"""

with open("img/bg-empty-mobile.svg", "w", encoding="utf-8") as f:
    f.write(empty_svg)

print("bg-empty-mobile.svg written successfully (flat sides/bottom)!")

# ==============================================================================
# 4. GENERATE bg-hero-title-mobile.svg (All sides wavy - floating card)
# ==============================================================================
hero_path = generate_custom_wavy_rect(
    w=420, h=420, margin=6, 
    top_cycles=7.5, bottom_cycles=7.5, left_cycles=7.5, right_cycles=7.5, amp=5,
    wavy_top=True, wavy_bottom=True, wavy_left=True, wavy_right=True
)
hero_svg = f"""<svg preserveAspectRatio="none" width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
<foreignObject x="-10" y="-10" width="440" height="440"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);clip-path:url(#bgblur_mobile_clip_path);height:100%;width:100%"></div></foreignObject>
<path data-figma-bg-blur-radius="10" fill-rule="evenodd" clip-rule="evenodd" d="{hero_path}" fill="#ffffff" fill-opacity="0.88"/>
<defs>
<clipPath id="bgblur_mobile_clip_path" transform="translate(10 10)"><path fill-rule="evenodd" clip-rule="evenodd" d="{hero_path}"/></clipPath>
</defs>
</svg>"""

with open("img/bg-hero-title-mobile.svg", "w", encoding="utf-8") as f:
    f.write(hero_svg)

print("bg-hero-title-mobile.svg written successfully (all sides wavy, square, frosted cream)!")

# ==============================================================================
# 5. GENERATE bg-cta-mobile.svg (Flat sides; wavy top & bottom)
# ==============================================================================
cta_path = generate_custom_wavy_rect(
    w=390, h=420, margin=6, 
    top_cycles=6.5, bottom_cycles=6.5, left_cycles=7.5, right_cycles=7.5, amp=4,
    wavy_top=True, wavy_bottom=True, wavy_left=False, wavy_right=False
)
cta_svg = f"""<svg preserveAspectRatio="none" width="390" height="420" viewBox="0 0 390 420" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="{cta_path}" fill="#F5C864"/>
</svg>"""

with open("img/bg-cta-mobile.svg", "w", encoding="utf-8") as f:
    f.write(cta_svg)

print("bg-cta-mobile.svg written successfully (flat sides)!")

# ==============================================================================
# 6. GENERATE DESKTOP bg-header-wave.svg (Flat top/sides; wavy bottom)
# ==============================================================================
header_path = generate_custom_wavy_rect(
    w=1440, h=120, margin=8, 
    top_cycles=8.5, bottom_cycles=8.5, left_cycles=2.5, right_cycles=2.5, amp=4,
    wavy_top=False, wavy_bottom=True, wavy_left=False, wavy_right=False
)
header_svg = f"""<svg preserveAspectRatio="none" width="1440" height="120" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="{header_path}" fill="white"/>
</svg>"""

with open("img/bg-header-wave.svg", "w", encoding="utf-8") as f:
    f.write(header_svg)

print("bg-header-wave.svg (desktop) written successfully (flat top/sides; wavy bottom)!")

# ==============================================================================
# 7. GENERATE DESKTOP bg-empty.svg (Flat bottom/sides; wavy top)
# ==============================================================================
empty_desktop_path = generate_custom_wavy_rect(
    w=1440, h=120, margin=8, 
    top_cycles=8.5, bottom_cycles=8.5, left_cycles=2.5, right_cycles=2.5, amp=4,
    wavy_top=True, wavy_bottom=False, wavy_left=False, wavy_right=False
)
empty_desktop_svg = f"""<svg preserveAspectRatio="none" width="1440" height="120" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="{empty_desktop_path}" fill="white"/>
</svg>"""

with open("img/bg-empty.svg", "w", encoding="utf-8") as f:
    f.write(empty_desktop_svg)

print("bg-empty.svg (desktop) written successfully (flat bottom/sides; wavy top)!")
