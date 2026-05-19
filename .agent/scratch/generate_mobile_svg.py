import math

def generate_wavy_rect(w, h, margin, top_bottom_cycles, left_right_cycles, amp):
    # We will generate a continuous path that goes:
    # 1. Top edge: Left to Right (y ~ margin)
    # 2. Right edge: Top to Bottom (x ~ w - margin)
    # 3. Bottom edge: Right to Left (y ~ h - margin)
    # 4. Left edge: Bottom to Top (x ~ margin)
    
    path_segments = []
    
    # --- Helper to generate a wavy segment between A and B ---
    # normal_dir is 1 or -1 to control which way the first half-cycle goes
    def add_wavy_segment(x1, y1, x2, y2, cycles, amp, normal_dir=1):
        dx = x2 - x1
        dy = y2 - y1
        length = math.hypot(dx, dy)
        
        # Unit direction vector
        ux = dx / length
        uy = dy / length
        
        # Unit normal vector (pointing "outward" or "inward")
        # For top edge going L->R, normal pointing UP (outward) is (-uy, ux) -> (0, 1) if L->R is (1,0)
        # Let's define the outward normal:
        nx = -uy
        ny = ux
        
        # We have 2 * cycles half-cycles
        num_half_cycles = int(cycles * 2)
        step_len = length / num_half_cycles
        
        current_x = x1
        current_y = y1
        
        for step in range(num_half_cycles):
            # Direction of this half-cycle's peak (alternating)
            direction = normal_dir * (1 if step % 2 == 0 else -1)
            
            # Next point on the main line
            next_line_x = x1 + (step + 1) * step_len * ux
            next_line_y = y1 + (step + 1) * step_len * uy
            
            # Control points
            # We want the peak to be in the middle of the step
            # Standard Bezier approximation for a sine wave half-cycle:
            # CP1 is at 1/3 of the step, shifted by amp * 1.3 * direction along the normal
            # CP2 is at 2/3 of the step, shifted by amp * 1.3 * direction along the normal
            cp1_x = current_x + (step_len / 3) * ux + amp * 1.33 * direction * nx
            cp1_y = current_y + (step_len / 3) * uy + amp * 1.33 * direction * ny
            
            cp2_x = current_x + (2 * step_len / 3) * ux + amp * 1.33 * direction * nx
            cp2_y = current_y + (2 * step_len / 3) * uy + amp * 1.33 * direction * ny
            
            path_segments.append(f"C {cp1_x:.3f} {cp1_y:.3f}, {cp2_x:.3f} {cp2_y:.3f}, {next_line_x:.3f} {next_line_y:.3f}")
            
            current_x = next_line_x
            current_y = next_line_y

    # Let's define the corners of our wavy rectangle
    # We will round the corners slightly or just start the waves at the corners
    # Let's define the main vertices:
    tl_x, tl_y = margin, margin
    tr_x, tr_y = w - margin, margin
    br_x, br_y = w - margin, h - margin
    bl_x, bl_y = margin, h - margin
    
    # Start at top-left
    path_segments.append(f"M {tl_x:.3f} {tl_y:.3f}")
    
    # 1. Top Edge: tl -> tr
    # Normal points up/outwards (y decreases)
    # So normal_dir should make the first curve go outwards (up) or inwards.
    # In the original, the top edge starts by going down/inwards or up/outwards?
    # Original top edge first Bezier: C14.1521 -12.0539 22.0696 15.9124 36.8512 15.9124
    # It goes to y = -12 (outwards) then y = 15.9 (inwards).
    # Let's make it start going outwards (upwards) -> normal_dir = -1 (since ny is positive and we want negative y shift)
    add_wavy_segment(tl_x, tl_y, tr_x, tr_y, top_bottom_cycles, amp, normal_dir=-1)
    
    # 2. Right Edge: tr -> br
    # Normal points right/outwards (x increases)
    # First curve should go outwards (rightwards) -> normal_dir = 1 (since nx is positive)
    add_wavy_segment(tr_x, tr_y, br_x, br_y, left_right_cycles, amp, normal_dir=1)
    
    # 3. Bottom Edge: br -> bl
    # Normal points down/outwards (y increases)
    # First curve should go outwards (downwards) -> normal_dir = 1
    add_wavy_segment(br_x, br_y, bl_x, bl_y, top_bottom_cycles, amp, normal_dir=1)
    
    # 4. Left Edge: bl -> tl
    # Normal points left/outwards (x decreases)
    # First curve should go outwards (leftwards) -> normal_dir = -1
    add_wavy_segment(bl_x, bl_y, tl_x, tl_y, left_right_cycles, amp, normal_dir=-1)
    
    path_segments.append("Z")
    
    return " ".join(path_segments)

# Configuration for mobile background
# A mobile background width of 420 and height of 720 is ideal.
# Top/bottom cycles: 6 (so 12 half-waves across 400px width. Each wave is ~33px wide, very smooth!)
# Left/right cycles: 12 (so 24 half-waves down 700px height. Each wave is ~30px wide, perfectly balanced!)
# Amplitude: 6 (peak-to-peak 12px, beautiful and visible but not pointy!)
w = 420
h = 720
margin = 12
top_bottom_cycles = 6.5 # Half cycles align perfectly
left_right_cycles = 11.5

path_d = generate_wavy_rect(w, h, margin, top_bottom_cycles, left_right_cycles, amp=6)

svg_content = f"""<svg preserveAspectRatio="none" width="{w}" height="{h}" viewBox="0 0 {w} {h}" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="{path_d}" fill="#FEEDBF"/>
</svg>
"""

with open("c:/Canedo Web Studio/massas-la-bella/massas la bella/img/bg-produtos-mobile.svg", "w") as f:
    f.write(svg_content)

print("SVG generated successfully at img/bg-produtos-mobile.svg!")
