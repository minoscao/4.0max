from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "交付文档" / "MVP管理员端PC-Dashboard-Mockup-v4-List-Detail.png"
IMPLEMENTATION = ROOT / "qa-desktop.png"


def label_font(size: int):
    try:
        return ImageFont.truetype("arial.ttf", size)
    except OSError:
        return ImageFont.load_default()


def compare(source: Image.Image, implementation: Image.Image, output: Path):
    width = max(source.width, implementation.width)
    source = source.resize((width, implementation.height), Image.Resampling.LANCZOS)
    header = 42
    canvas = Image.new("RGB", (width * 2, implementation.height + header), "#F3F5F6")
    canvas.paste(source.convert("RGB"), (0, header))
    canvas.paste(implementation.convert("RGB"), (width, header))
    draw = ImageDraw.Draw(canvas)
    font = label_font(18)
    draw.text((18, 11), "SOURCE MOCKUP", fill="#142231", font=font)
    draw.text((width + 18, 11), "IMPLEMENTATION", fill="#142231", font=font)
    draw.line((width, 0, width, canvas.height), fill="#EB5B13", width=2)
    canvas.save(output)


source_image = Image.open(SOURCE)
implementation_image = Image.open(IMPLEMENTATION)
compare(source_image, implementation_image, ROOT / "qa-comparison-full.png")

source_crop = source_image.crop((165, 250, 1518, 748))
implementation_crop = implementation_image.crop((165, 250, 1518, 748))
compare(source_crop, implementation_crop, ROOT / "qa-comparison-task-workspace.png")
