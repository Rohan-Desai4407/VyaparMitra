from PIL import Image

def remove_bg(input_path, output_path, tolerance=20):
    img = Image.open(input_path).convert("RGBA")
    pixels = list(img.getdata())
    
    # Sample background from multiple corners for accuracy
    corners = [pixels[0], pixels[img.width - 1], pixels[(img.height - 1) * img.width], pixels[img.height * img.width - 1]]
    # Use top-left corner as primary bg color
    bg = corners[0]
    
    new_pixels = []
    for p in pixels:
        if (abs(p[0] - bg[0]) < tolerance and
            abs(p[1] - bg[1]) < tolerance and
            abs(p[2] - bg[2]) < tolerance):
            new_pixels.append((255, 255, 255, 0))
        else:
            new_pixels.append(p)
    
    img.putdata(new_pixels)
    img.save(output_path, "PNG")
    print(f"Done! Saved to {output_path}")

remove_bg("d:/VyaparMitra/public/logo.png", "d:/VyaparMitra/public/logo.png", tolerance=20)
