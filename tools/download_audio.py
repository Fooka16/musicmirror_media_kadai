"""
Kenney CC0 フリー素材をダウンロードし、診断用 MP3 に変換するスクリプト
出典: https://kenney.nl/ (CC0)
"""

import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path

import imageio_ffmpeg

BASE = "https://gamesounds.xyz/Kenney%27s%20Sound%20Pack/"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# 質問ごとに対照的な音源を選定（Kenney CC0）
AUDIO_MAP = {
    # Q1: 楽しいメロディ vs ほわほわした響き
    "q1-a.mp3": {
        "path": "Music Loops/Loops/Cheerful Annoyance.ogg",
        "filters": "afade=t=in:st=0:d=0.3,afade=t=out:st=11.5:d=0.5",
    },
    "q1-b.mp3": {
        "path": "Music Loops/Loops/Space Cadet.ogg",
        "filters": "afade=t=in:st=0:d=0.8,afade=t=out:st=11.5:d=1.0,lowpass=f=1600,volume=0.85",
    },
    # Q2: 落ち着いたクラシック vs 不思議な響き
    "q2-a.mp3": {
        "path": "Music Loops/Loops/German Virtue.ogg",
        "filters": "afade=t=in:st=0:d=0.5,afade=t=out:st=11.5:d=0.8,volume=0.9",
    },
    "q2-b.mp3": {
        "path": "Music Loops/Retro/Retro Mystic.ogg",
        "filters": "afade=t=in:st=0:d=0.4,afade=t=out:st=11.5:d=0.6",
    },
    "q3-a.mp3": "Music Loops/Loops/Drumming Sticks.ogg",
    # Q3-B: 草原のような穏やかな響き（低刺激・余白）
    "q3-b.mp3": {
        "path": "Music Loops/Loops/Flowing Rocks.ogg",
        "filters": "afade=t=in:st=0:d=1.5,afade=t=out:st=11.5:d=1.5,lowpass=f=950,highpass=f=80,volume=0.58,atempo=0.82",
    },
    "q4-a.mp3": "Digital Audio/pepSound1.ogg",
    "q4-b.mp3": "Music Loops/Loops/Italian Mom.ogg",
    # Q5: はっきりしたメロディ vs ベース・ドラム強めのグルーヴ
    "q5-a.mp3": {
        "path": "Music Loops/Loops/Polka Train.ogg",
        "filters": "afade=t=in:st=0:d=0.3,afade=t=out:st=11.5:d=0.5,equalizer=f=2000:width_type=o:width=2:g=4,equalizer=f=120:width_type=o:width=2:g=-3,volume=0.95",
    },
    "q5-b.mp3": {
        "path": "Music Loops/Retro/Retro Beat.ogg",
        "filters": "afade=t=in:st=0:d=0.3,afade=t=out:st=11.5:d=0.5,bass=g=28:f=48:w=1.0,equalizer=f=80:width_type=o:width=2:g=12,equalizer=f=160:width_type=o:width=2:g=8,equalizer=f=4000:width_type=o:width=2:g=-12,equalizer=f=8000:width_type=o:width=2:g=-15,lowpass=f=650,volume=1.1",
    },
    "q6-a.mp3": "Music Loops/Loops/Sad Town.ogg",
    "q6-b.mp3": "Digital Audio/laser1.ogg",
}

CLIP_MS = 12000  # 12秒にトリミング
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "audio"


def download_file(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading: {url}")
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SonicMirror/1.0"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        dest.write_bytes(response.read())


DEFAULT_FILTERS = "afade=t=in:st=0:d=0.3,afade=t=out:st=11.5:d=0.5"


def get_entry(name: str, value: str | dict) -> tuple[str, str]:
    if isinstance(value, dict):
        return value["path"], value.get("filters", DEFAULT_FILTERS)
    return value, DEFAULT_FILTERS


def convert_to_mp3(source: Path, dest: Path, filters: str = DEFAULT_FILTERS) -> None:
    duration_sec = CLIP_MS / 1000
    command = [
        FFMPEG,
        "-y",
        "-i",
        str(source),
        "-t",
        str(duration_sec),
        "-af",
        filters,
        "-codec:a",
        "libmp3lame",
        "-b:a",
        "128k",
        str(dest),
    ]
    subprocess.run(command, check=True, capture_output=True)
    print(f"Created: {dest.name} ({duration_sec:.1f}s)")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    temp_dir = OUTPUT_DIR / "_temp"
    temp_dir.mkdir(exist_ok=True)

    targets = AUDIO_MAP
    if len(sys.argv) > 1:
        requested = set(sys.argv[1:])
        targets = {k: v for k, v in AUDIO_MAP.items() if k in requested}
        if not targets:
            raise SystemExit(f"No matching files. Available: {', '.join(AUDIO_MAP)}")

    for output_name, entry in targets.items():
        source_path, filters = get_entry(output_name, entry)
        encoded_path = "/".join(urllib.parse.quote(part) for part in source_path.split("/"))
        url = BASE + encoded_path
        temp_ogg = temp_dir / Path(source_path).name

        download_file(url, temp_ogg)
        convert_to_mp3(temp_ogg, OUTPUT_DIR / output_name, filters)

    attribution = OUTPUT_DIR / "ATTRIBUTION.txt"
    attribution.write_text(
        "Audio assets (CC0)\n"
        "Created/distributed by Kenney (www.kenney.nl)\n"
        "License: Creative Commons Zero (CC0)\n"
        "https://creativecommons.org/publicdomain/zero/1.0/\n"
        "Hosted via gamesounds.xyz mirror for development.\n",
        encoding="utf-8",
    )

    # 一時ファイル削除
    for f in temp_dir.glob("*"):
        f.unlink()
    temp_dir.rmdir()

    print(f"\nDone. {len(targets)} files saved to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
